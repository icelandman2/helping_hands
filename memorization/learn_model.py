import sys
import pickle
import random
import datetime
from datetime import datetime as dt
import copy
import time

import requests
from flask import Flask, jsonify
from firebase import firebase

"""
Learning Management Class for Helping Hands

Currently a basic implementation of learning management/spaced-repetition algorithm for Helping Hands App.
Will return to make more advanced/useful over time. Eventually plan to implement a variant of SuperMemo.

Usage:

1. Initialize class with user tokens and list of tokens corresponding to unique items to learn. Typically default values will be ok
(some are for features I haven't implemented yet). Use minutes=True if you are testing, False for actual user implementation

2. Run get_today_cards for the user when they open app to get the tokens that you should study now. Please make sure to retain this 
order to feed back. Test user on these cards and feed back with update_knowledge (in order given to you) for the appropriate user. 
Obtain new training cards (note new ordering) by running get_today_cards again. Iterate between these until you get empty List from 
get_today_cards.

3. If you have already exhausted the cards in the deck for now, you can study again/more with get_extra_cards.

4. A user can be added with add_user, and tokens can be added with add_tokens. You can save/load to a pickle file using save_to_pickle
and get_from_pickle. These will fully populate the class with the saved state.

5. retrieve_shuffled_state, get_time_due, get_accuracy, get_init_recall_time, set_init_recall_time, get_min_ease, set_min_ease,
get_max_ease, set_max_ease, get_penalty, and set_penalty are available for use. All work as getter/setter functions for the appropriate
data.

Note: Uses system time, which may cause problems across timezones!

TODOS
1. Need to upgrade in order to adjust ease dynamically
2. Add option for user/vision algo to report hardness/closeness of "correct" answer
"""

class LearningManager:

	def __init__(self, users, tokens_to_learn=[], init_recall_time=1.0, min_ease = 1.1, max_ease=2.5, minutes=False, fail_penalty = 2.0):
		"""
		Initialize LearningManager Class.
		@param users: List of tokens representing each user. Just [user] if only for one user
		@param tokens_to_learn: List of tokens representing items to learn
		@param init_recall_time: How long until due again, assuming we get it right this time
		@param min_ease: Minimal value of hardness adjustment for correct answers (unused)
		@param max_ease: Maximal value of hardness adjustment for correct answers (unused)
		@param minutes: Whether to use minutes (True) or days (False) for longness measure. Use minutes for testing.
		Pedagogy suggests using days in real-world applications
		"""
		
		self.init_time = dt.today()

		'''
		creates map object with token mapping to values
		0: time this card is due
		1: how long until card will be due at next interval if right
		2: how many times correct
		3: how many times tried
		4: current hardness adjustment
		'''
		#map of info to be deep-copied for every user
		self.map = {k: (self.init_time, init_recall_time, 0, 0, max_ease) for v,k in enumerate(tokens_to_learn)}

		#global variables
		self.init_recall_time = init_recall_time
		self.min_ease = min_ease
		self.max_ease = max_ease
		self.minutes = minutes
		self.penalty = fail_penalty
		self.users_ordered = users
		self.user_data = []
		self.firebase = firebase.FirebaseApplication('https://cs194wfinalproj.firebaseio.com', None)
		#names for deletion when updating firebase db
		self.firebase_name_prev = ""

		#initialize user_data
		for u in users:
			#tuple of local map initialized with the "shuffled state" not yet initialized
			u_tuple = (copy.deepcopy(self.map), [])
			self.user_data.append(u_tuple)

	def hardness_update_for_user(self, user, target_accuracy=.85, min_total_data=1):
		"""
		Examine the user's current performance on the tokens they are trying to learn, and suggest update to the ease
		and penalty bounds based on their learning characteristics. Returns -1 if insufficient data.
		@param user: The user to evaluate
		@param target_accuracy: Desired average accuracy
		@param min_total_data: The minimum number of cards attempted (in total) before accuracy adjustment starts
		@return nonadjust: The percentage of nonadjustable values due to low or high accuracy. Consider modifying min
		or max ease if you get this value.
		"""
		correct = 0
		allV = 0
		user_index = self.check_valid_user(user)
		if user_index == -1:
			return user_index

		#ERROR DO NOT USE FOR NOW
		user_map, user_shuf = list(self.user_data[user_index])
		for tok in user_map:
			acc, corr, alltoks = self.get_accuracy(user, tok)
			correct += corr
			allV += alltoks
		if allV < min_total_data:
			return -1

		tot_score = float(correct) / float(allV)
		count_tok = 0
		count_nonadjustable = 0
		for tok in user_map:
			count_tok += 1
			loc = user_map[tok]
			new_val = (tot_score/target_accuracy)*loc[4]
			loc[4] = max(min(new_val, self.max_ease), self.min_ease)
			if new_val > self.max_ease or new_val < self.min_ease:
				count_nonadjustable += 1
			user_map[tok] = loc
		return float(count_nonadjustable)/float(count_tok)



	def retrieve_shuffled_state(self, user):
		"""
		Get the current shuffled state the system expects for this user. Useful if you lost it somehow.
		@param user: the user to seek
		@return state: the shuffled state. -1 if user not found
		"""
		user_index = self.check_valid_user(user)
		if user_index == -1:
			return user_index
		cur_map, state = list(self.user_data[user_index])
		return state

	def get_time_due(self, user, token):
		"""
		Get the datetime that a given card will be due.
		@param user: The user we are checking for
		@param token: The card we want to know about
		@return time: the time this card will be due. Returns -1 if user not found. No error checking for card.
		"""
		user_index = self.check_valid_foruser(user)
		if user_index == -1:
			return user_index
		cur_map, state = list(self.user_data[user_index])
		time, r, c, a, e = cur_map[token]
		return time

	def get_accuracy(self, user, token):
		"""
		Get the accuracy for this user on a given card.
		@param user: The user we are checking for
		@param token: The card we want to know about
		@return accuracy: the accuracy of the user on this card. Returns -1 if user not found. No error checking for card.
		"""
		user_index = self.check_valid_user(user)
		if user_index == -1:
			return user_index
		cur_map, state = list(self.user_data[user_index])
		t, r, correct, allV, e = cur_map[token]
		if allV==0:
			return (0.0, 0, 0)
		accuracy = float(correct) / float(allV)
		return (accuracy, correct, allV)

	def get_init_recall_time(self):
		"""
		Get the default time till you see a card again if you get it right the first time.
		@return the recall time
		"""
		return self.init_recall_time

	def set_init_recall_time(self, new_val):
		"""
		Set the default time till you see a card again if you get it right the first time.
		@param new_val: The time (in minutes/days) to set to
		"""
		self.init_recall_time = new_val

	def get_min_ease(self):
		"""
		Get the current minimum ease.
		@return the minimum ease of the manager
		"""
		return self.min_ease

	def set_min_ease(self, new_val):
		"""
		Set a new minimum ease.
		@param new_val: the value to set the minimum ease to (must be >1), and less than max ease. 
		Returns -1 if out of bounds.
		"""
		if new_val < 1 or new_val>self.max_ease:
			return -1
		else:
			self.min_ease = new_val

	def get_max_ease(self):
		"""
		Get the current maximum ease.
		@return the maximum ease of the manager
		"""
		return self.max_ease

	def set_max_ease(self, new_val):
		"""
		Set a new maximum ease.
		@param new_val: the value to set the maximum ease to (must be >1), and greater than min ease. 
		Returns -1 if out of bounds.
		"""
		if new_val < 1 or new_val<self.min_ease:
			return -1
		else:
			self.max_ease = new_val

	def get_penalty(self):
		"""
		Get the current penalty factor for incorrect answers.
		@return the current penalty
		"""
		return self.penalty

	def set_penalty(self, new_val):
		"""
		Set the penalty factor for incorrect answers. Must be greater than 1
		@param new_val: the value to set as the new penalty factor
		@return -1 if out of bounds.
		"""
		if new_val<1:
			return -1
		else:
			self.penalty = new_val

	def check_valid_user(self, user):
		"""
		Function to check whether a user token is valid and return -1 if not
		@param user: the user to check 
		@return user_index: The index of the found user. Returns -1 if user not found (invalid user).
		"""
		try:
			user_index = self.users_ordered.index(user)
			return user_index
		except:
			#print("Error in the backroom - user token not found")
			return -1

	def add_user(self, user):
		"""
		Add a new user to the learning management system. 
		@param user: the unique token for the new user to be added
		@return -1 if user token already in use
		"""
		if user in self.users_ordered:
			return -1
		self.users_ordered.append(user)
		u_tuple = (copy.deepcopy(self.map), [])
		self.user_data.append(u_tuple)

	def add_tokens(self, tokens):
		"""
		Add some new tokens to the learning management system for all users. Note that any existing
		tokens included here will not be reset, and will instead be ignored (as if they weren't added)
		@param tokens: List of tokens to add
		"""
		token_map = {k: (self.init_time, self.init_recall_time, 0, 0, self.max_ease) for v,k in enumerate(tokens)}
		token_map.update(self.map)
		for i,u in enumerate(self.users_ordered):
			cur_map, shuf = list(self.user_data[i])
			token_map.update(cur_map)
			self.user_data[i] = (token_map, shuf)

	def get_today_cards(self, user):
		"""
		Find the cards that need to be studied now, shuffle them, update the shuffled state to represent those cards
		and return the shuffled todo cards.
		@param user: the user token we are retrieving
		@return today_cards: The cards that are due to be studied. Returns -1 if invalid user.
		"""

		current_time = dt.today()
		user_index = self.check_valid_user(user)
		if user_index == -1:
			return user_index
		cur_map, cur_shuf = list(self.user_data[user_index])
		#retrieves all past-due cards, shuffles them, updates state to represent that, and returns these card tokens
		current_cards = [k for k in cur_map if cur_map[k][0]<current_time]
		random.shuffle(current_cards)
		cur_shuf = current_cards
		self.user_data[user_index] = (cur_map, cur_shuf)
		return current_cards

	def get_extra_cards(self, user, num_cards=10):
		"""
		Do extra studying beyond just the cards that are due. If cards are due, will instead just return cards due.
		Returns the num_cards that are due the soonest otherwise. Note that this function updates the shuffled state. 
		@param user: The user token we are getting extra cards for
		@param num_cards: The number of extra cards to obtain
		@return cards: the extra cards to study. Returns -1 if invalid user
		"""

		check_today = self.get_today_cards(user)
		if len(check_today) > 0:
			return check_today
		user_index = self.check_valid_user(user)


		cur_map, cur_shuf = list(self.user_data[user_index])
		ordered_by_staleness = sorted(cur_map.items(), key = lambda kv:(list(kv[1])[0], kv[0]))

		cards = [v[0] for v in ordered_by_staleness]
		if len(cards)<num_cards:
			random.shuffle(cards)
			self.user_data[user_index] = (cur_map, cards)
			return cards
		else:
			oldest = cards[0:num_cards]
			random.shuffle(oldest)
			self.user_data[user_index] = (cur_map, oldest)
			return oldest

	def update_knowledge(self, user, results, bin=True):
		"""
		Update user's knowledge of the cards based on their results. Currently supports binary right/wrong,
		but may be updated to allow hardness measure.
		@param user: the user token to update
		@param results: List[int] of answers in order to shuffled queries. 1 for correct, 0 for incorrect.
		@param bin: If binary. Currently only True is supported 
		@return -1 if user is not valid or if the result List has the wrong length
		"""

		current_time = dt.today()
		user_index = self.check_valid_user(user)
		if user_index == -1:
			return user_index

		cur_map, cur_shuf = list(self.user_data[user_index])

		if(len(results)!=len(cur_shuf)):
			return -1

		for i, term in enumerate(cur_shuf):
			local_list = list(cur_map[term])
			#we note this word was attempted. Will currently mark as incorrect for invalid result tokens
			local_list[3] += 1
			if results[i]==0:
				#if user got it wrong, we shift down the time till they see again since it is a hard word
				local_list[1] /= self.penalty
			elif results[i]==1:
				#if user gets it right, we set a due date in the future for the card based on how hard it is
				if self.minutes:
					local_list[0] = current_time + datetime.timedelta(minutes=local_list[1])
				else:
					local_list[0] = current_time + datetime.timedelta(days=local_list[1])
				#we also mark it as correct
				local_list[2] += 1
				#finally, we update hardness by the current adjustment factor
				local_list[1] *= local_list[4]

			cur_map[term] = tuple(local_list)

		self.user_data[user_index] = (cur_map, cur_shuf)

	def save_to_pickle(self):
		"""
		Saves the current state to a pickle file for later retrieval.
		"""

		tuple_to_pickle = (self.users_ordered, self.user_data, self.min_ease, self.max_ease, self.minutes, self.penalty, self.map, self.init_recall_time)
		with open('data/learning_data.pickle', 'wb') as handle:
			pickle.dump(tuple_to_pickle, handle, protocol=pickle.HIGHEST_PROTOCOL)

	def get_from_pickle(self):
		"""
		Loads a class state from the given pickle file.
		"""

		with open('data/learning_data.pickle', 'rb') as handle:
			retrieved_tuple = pickle.load(handle)
			self.users_ordered, self.user_data, self.min_ease, self.max_ease, self.minutes, self.penalty, self.map, self.init_recall_time = retrieved_tuple


	def save_to_firebase(self):
		"""
		Saves the current state to firebase. Watch out for asynchronous issues. Hoping to update to just get data for a single user at some point.
		"""
		user_data_to_store = (self.users_ordered, self.user_data, self.min_ease, self.max_ease, self.minutes, self.penalty, self.map, self.init_recall_time)
		storage_id = self.firebase.post('/user_data', user_data_to_store)
		if len(self.firebase_name_prev)>1:
			self.firebase.delete('/user_data', self.firebase_name_prev)
		self.firebase_name_prev = storage_id['name']

	def get_firebase_id(self):
		"""
		Gets the ID of the firebase field of the current user data, provided we have called save_to_firebase. Will return "" otherwise.
		Important to save this field whenever you want to come back later and get your data!
		@return self.firebase_name_prev: the name of the field containing appropriate user data.
		"""
		return self.firebase_name_prev


	def get_from_firebase(self, firebase_id=None):
		"""
		Retrieve a saved state from firebase. Must have a valid state to retrieve. Does not error check. Generally just run without arguments
		@param firebase_id: the returned POST id to retrieve from
		"""
		retrieved_user_data = self.firebase.get('/user_data', None)
		if firebase_id is None:
			self.users_ordered, self.user_data, self.min_ease, self.max_ease, self.minutes, self.penalty, self.map, self.init_recall_time = retrieved_user_data[list(retrieved_user_data)[-1]]
		else:
			self.users_ordered, self.user_data, self.min_ease, self.max_ease, self.minutes, self.penalty, self.map, self.init_recall_time = retrieved_user_data[firebase_id]


def dotline():
	for i in range(0, 19):
		time.sleep(.01)
		sys.stdout.write(".")
		sys.stdout.flush()
	print("")

def test_learningManager(skip_long=False):
	"""
	Performs tests on LearningManager class for sanity check of implementation. Verifies correctness of 
	cards due for review, updates with new knowledge, time till next review, handling of multiple users,
	io errors, and save/load functionality. Not intended to be comprehensive.
	"""
	tokens = ['a', 'b', 'c']

	print("preparing learning manager on toy data and performing basic tests")
	dotline()
	test = LearningManager([1, 2, 3, 4], tokens_to_learn=tokens, minutes=True)
	vals = test.get_today_cards(1)
	assert len(vals) == len(tokens), "length of test does not match!"
	test.update_knowledge(1, [0, 1, 1])
	try:
		test.update_knowledge(1, [0, 1, 1])
	except:
		print("failed to review same cards multiple times prior to reshuffle!")
	v2 = test.get_today_cards(1)
	assert len(v2) == 1, "length after updating knowledge does not match!"
	assert v2[0] == vals[0], "cards to be re-studied do not match!"
	test.update_knowledge(1, [1])
	invalid_user_test1 = test.get_today_cards(0)
	assert invalid_user_test1 == -1, "fails to catch invalid user in get_today_cards"
	invalid_user_test2 = test.update_knowledge(3, [2,3,5,5])
	assert invalid_user_test2 == -1, "failts to catch invalid user in update_knowledge"
	invalid_response_tooshort = test.update_knowledge(1, [])
	assert invalid_response_tooshort == -1, "fails to catch if results are too short"
	invalid_response_toolong = test.update_knowledge(1, [1, 1, 1, 1, 1])
	assert invalid_response_tooshort == -1, "fails to catch if results are too long"
	check_user2 = test.get_today_cards(2)
	assert len(check_user2) == len(tokens), "messes with both users"
	user2_smart = test.update_knowledge(2, [1,1,1])
	assert len(test.get_today_cards(2)) == 0, "thinks user 2 still needs to review"
	for i in range(0, 2):
		test.update_knowledge(1, [0])
	test.update_knowledge(1, [1])
	assert len(test.get_today_cards(1)) == 0, "thinks user 1 still needs to review"
	print("model setup and basic checks passed!")

	if not skip_long:
		print("testing we delay the right amount of time until further review")
		for i in range(0, 19):
			assert len(test.get_today_cards(1)) == 0, "\nthinks user 1 still needs to review too early"
			time.sleep(.5)
			sys.stdout.write(".")
			sys.stdout.flush()
		print("")
		assert len(test.get_today_cards(1)) == 1, "\ndoesn't realize that user 1 needs to review"
		print("spaced repetition sanity check passed!")


	print("testing save/load functionality")
	dotline()
	test.save_to_pickle()
	newV = LearningManager([1], tokens_to_learn=['a','c','d'], minutes=False)
	newV.get_from_pickle()
	if not skip_long:
		assert len(newV.get_today_cards(1)) == 1, "failed to retrieve users properly"
	else:
		assert len(newV.get_today_cards(1)) == 0, "failed to retrieve users properly"
	assert len(newV.get_today_cards(3)) == 3, "failed to retrieve users properly"

	test.save_to_firebase()
	newV2 = LearningManager([1], tokens_to_learn=['a','c','d'], minutes=False)
	newV2.get_from_firebase()
	print("save/load functionality checks passed!")

	print("testing ability to get extra cards, add users, and add cards")
	dotline()
	check_extras = newV.get_extra_cards(4, num_cards=1)
	assert len(check_extras) == 3, "allowing user to skip cards"
	newV.update_knowledge(3, [0,0,1])
	cards = newV.get_today_cards(3)
	newV.update_knowledge(3, [0,1])
	newV.get_today_cards(3)
	newV.update_knowledge(3,[1])
	arr = newV.get_extra_cards(3, num_cards=2)
	assert cards[0] in arr and cards[1] in arr, "wrong cards returned in extra studying"
	newV.add_user("abc")
	assert len(newV.get_today_cards("abc")) == 3, "adding user failed"
	newV.add_tokens(["do", "re", "mi"])
	newV.add_tokens([])
	assert len(newV.get_today_cards("abc")) == 6, "adding tokens failed"
	print("card and user manipulation tests passed!")
	
	print("testing whether we can get/set values properly")
	dotline()
	assert newV.get_today_cards("abc") == newV.retrieve_shuffled_state("abc"), "error retrieving shuffled state"
	assert newV.get_init_recall_time() == 1, "recall time wrong"
	newV.set_init_recall_time(.5)
	assert newV.get_init_recall_time() == .5, "recall time changed wrong"
	assert newV.get_min_ease() == 1.1, "min ease wrong"
	newV.set_min_ease(1.2)
	assert newV.get_min_ease() == 1.2, "min ease changed wrong"
	assert newV.get_max_ease() == 2.5, "max ease wrong"
	newV.set_max_ease(2.3)
	assert newV.get_max_ease() == 2.3, "max ease changed wrong"
	assert newV.get_penalty() == 2.0, "penalty wrong"
	newV.set_penalty(2.1)
	assert newV.get_penalty() == 2.1, "penalty changed wrong"
	accuracy_test = LearningManager([1], tokens_to_learn=["a"], minutes=True)
	assert accuracy_test.get_accuracy(1, "a")[0] == 0.0, "wrong initial accuracy"
	accuracy_test.get_today_cards(1)
	accuracy_test.update_knowledge(1, [0])
	accuracy_test.update_knowledge(1, [1])
	assert accuracy_test.get_accuracy(1, "a")[0] == 0.5, "wrong updated accuracy"
	print("get/set checks passed!")
	print(newV.hardness_update_for_user(3))
	print("\nall tests passed!")


"""
{
  "get_cards": false,
  "update_knowledge": true,
  "username": 1,
  "results": [0, 1, 1]
}
"""

	
def google_cloud_parser(request):
	request_json = request.get_json(silent=True)
	if (request_json['get_cards']):
		return google_cloud_get_cards(request)
	elif request_json['update_knowledge']:
		return google_cloud_update_knowledge(request)

def google_cloud_get_cards(request):
	request_json = request.get_json(silent=True)
	username = request_json['username']

	tokens = ['a', 'b', 'c']

	lm = LearningManager([1, 2, 3, 4], tokens_to_learn=tokens, minutes=True)
	# lm = LearningManager()
	cards = lm.get_today_cards(username)

	return jsonify(cards=cards)

def google_cloud_update_knowledge(request):
	request_json = request.get_json(silent=True)
	username = request_json['username']
	results = request_json['results']

	tokens = ['a', 'b', 'c']

	lm = LearningManager([1, 2, 3, 4], tokens_to_learn=tokens, minutes=True)
	# lm = LearningManager()
	cards = lm.update_knowledge(username, results)


if __name__ == '__main__':
	test_learningManager(skip_long=True)
