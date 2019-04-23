import sys
import pickle
import random
import datetime
from datetime import datetime as dt

"""
Learning Management Class for Helping Hands

Currently a skeleton implementation of learning management/spaced-repetition algorithm for Helping Hands App.
Will return to make more advanced/useful over time. Eventually plan to implement a variant of SuperMemo.

Usage:

1. Initialize class with list of tokens corresponding to unique items to learn. Typically default values will be ok
(some are for features I haven't implemented yet). Use minutes=True if you are testing, False for actual user implementation

2. Run get_today_cards to get the tokens that you should study now. Please make sure to retain this order to feed back.
Test user on these cards and feed back with update_knowledge (in order given to you). Obtain new training cards (note new
ordering) by running get_today_cards again. Iterate between these until you get empty List from get_today_cards.

Note that you can save/load to a pickle file using save_to_pickle and get_from_pickle. These will fully populate the class with
the saved state. Uses system time, which may cause problems across timezones!


Need to upgrade in order to adjust ease dynamically, and add option for user to report hardness of correct answer.
"""

class LearningManager:

	def __init__(self, tokens_to_learn=[], init_recall_time=1.0, min_ease = 1.1, max_ease=2.5, minutes=False, fail_penalty = 2.0):
		"""
		Initialize LearningManager Class.
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
		self.map = {k: (self.init_time, init_recall_time, 0, 0, max_ease) for v,k in enumerate(tokens_to_learn)}
		self.min_ease = min_ease
		self.max_ease = max_ease
		self.shuffled_state = []
		self.minutes = minutes
		self.penalty = fail_penalty

	def get_today_cards(self):
		"""
		Find the cards that need to be studied now, shuffle them, update the shuffled state to represent those cards
		and return the shuffled todo cards.
		@return today_cards: The cards that are due to be studied.
		"""

		current_time = dt.today()
		current_cards = [k for k in self.map if self.map[k][0]<current_time]
		random.shuffle(current_cards)
		self.shuffled_state = current_cards
		return current_cards

	def update_knowledge(self, results, bin=True):
		"""
		Update user's knowledge of the cards based on their results. Currently supports binary right/wrong,
		but may be updated to allow hardness measure.
		@param results: List[int] of answers in order to shuffled queries. 1 for correct, 0 for incorrect.
		@param bin: If binary. Currently only True is supported 
		"""

		current_time = dt.today()
		for i, term in enumerate(self.shuffled_state):
			local_list = list(self.map[term])
			#we note this word was attempted
			local_list[3] += 1
			if results[i]==0:
				#if user got it wrong, we shift down the time till they see again since it is a hard word
				local_list[1] /= self.penalty
			elif results[i]==1:
				#if user gets it right, we set a due date in the future for the card based on how hard it is
				if self.minutes:
					local_list[0] = current_time + datetime.timedelta(days=local_list[1])
				else:
					local_list[0] = current_time + datetime.timedelta(minutes=local_list[1])
				#we also mark it as correct
				local_list[2] += 1
				#finally, we update hardness by the current adjustment factor
				local_list[1] *= local_list[4]

			self.map[term] = tuple(local_list)

	def save_to_pickle(self):
		"""
		Saves the current state to a pickle file for later retrieval.
		"""

		tuple_to_pickle = (self.map, self.min_ease, self.max_ease, self.shuffled_state, self.minutes, self.penalty)
		with open('data/learning_data.pickle', 'wb') as handle:
			pickle.dump(tuple_to_pickle, handle, protocol=pickle.HIGHEST_PROTOCOL)

	def get_from_pickle(self):
		"""
		Loads a class state from the given pickle file.
		"""

		with open('data/learning_data.pickle', 'rb') as handle:
			retrieved_tuple = pickle.load(handle)
			self.map, self.min_ease, self.max_ease, self.shuffled_state, self.minutes, self.penalty = retrieved_tuple

def test_learningManager(tokens=[1,2,3]):

	test = LearningManager(tokens_to_learn=tokens, minutes=True)
	vals = test.get_today_cards()
	print(vals)
	test.update_knowledge([0, 1, 1])
	#newVals = test.get_today_cards()
	#@print(newVals)
	#test.update_knowledge([1])
	print(test.get_today_cards())
	test.save_to_pickle()
	newtest = LearningManager()
	newtest.get_from_pickle()
	print(newtest.get_today_cards())

if __name__ == '__main__':
    test_learningManager(tokens=["a", "b", "c"])