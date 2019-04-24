import sys
import pickle
import random
import datetime
from datetime import datetime as dt
import copy
import time

"""
Learning Management Class for Helping Hands

Currently a skeleton implementation of learning management/spaced-repetition algorithm for Helping Hands App.
Will return to make more advanced/useful over time. Eventually plan to implement a variant of SuperMemo.

Usage:

1. Initialize class with user tokens and list of tokens corresponding to unique items to learn. Typically default values will be ok
(some are for features I haven't implemented yet). Use minutes=True if you are testing, False for actual user implementation

2. Run get_today_cards for the user when they open app to get the tokens that you should study now. Please make sure to retain this 
order to feed back. Test user on these cards and feed back with update_knowledge (in order given to you) for the appropriate user. 
Obtain new training cards (note new ordering) by running get_today_cards again. Iterate between these until you get empty List from 
get_today_cards.

Note that you can save/load to a pickle file using save_to_pickle and get_from_pickle. These will fully populate the class with
the saved state. Uses system time, which may cause problems across timezones!


Need to upgrade in order to adjust ease dynamically, and add option for user to report hardness of correct answer.
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
		local_map = {k: (self.init_time, init_recall_time, 0, 0, max_ease) for v,k in enumerate(tokens_to_learn)}
		self.min_ease = min_ease
		self.max_ease = max_ease
		self.minutes = minutes
		self.penalty = fail_penalty

		self.users_ordered = users
		self.user_data = []
		for u in users:
			#tuple of local map initialized with the "shuffled state" not yet initialized
			u_tuple = (copy.deepcopy(local_map), [])
			self.user_data.append(u_tuple)

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
		current_cards = [k for k in cur_map if cur_map[k][0]<current_time]
		random.shuffle(current_cards)
		cur_shuf = current_cards
		self.user_data[user_index] = (cur_map, cur_shuf)
		return current_cards

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

		tuple_to_pickle = (self.users_ordered, self.user_data, self.min_ease, self.max_ease, self.minutes, self.penalty)
		with open('data/learning_data.pickle', 'wb') as handle:
			pickle.dump(tuple_to_pickle, handle, protocol=pickle.HIGHEST_PROTOCOL)

	def get_from_pickle(self):
		"""
		Loads a class state from the given pickle file.
		"""

		with open('data/learning_data.pickle', 'rb') as handle:
			retrieved_tuple = pickle.load(handle)
			self.users_ordered, self.user_data, self.min_ease, self.max_ease, self.minutes, self.penalty = retrieved_tuple

def test_learningManager():
	tokens = ['a', 'b', 'c']

	print("preparing learning manager on toy data and performing basic tests")
	for i in range(0, 19):
		time.sleep(.01)
		sys.stdout.write(".")
		sys.stdout.flush()
	print("")
	test = LearningManager([1, 2, 3], tokens_to_learn=tokens, minutes=True)
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
	for i in range(0, 19):
		time.sleep(.01)
		sys.stdout.write(".")
		sys.stdout.flush()
	print("")
	test.save_to_pickle()
	newV = LearningManager([1], tokens_to_learn=['a','c','d'], minutes=False)
	newV.get_from_pickle()
	assert len(newV.get_today_cards(1)) == 1, "failed to retrieve users properly"
	assert len(newV.get_today_cards(3)) == 3, "failed to retrieve users properly"
	#TODO update with check on minutes, tokens to learn
	print("save/load functionality checks passed!\n")
	print("all tests passed!")

if __name__ == '__main__':
    test_learningManager()
