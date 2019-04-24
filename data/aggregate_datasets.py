# creates dataset from disparate sources

import os
import random
import string

dataset_collection_dir = '/Users/swetharevanur/Documents/spring/cs194w/datasets'

# create raw data directories
total_data_dir = os.path.join(dataset_collection_dir, 'total')

alpha_categories = list(string.ascii_lowercase.upper())
alpha_categories.remove('J')
alpha_categories.remove('Z')
numeric_categories = list(range(10))
categories = alpha_categories + numeric_categories

for category in categories:
    dir_name = os.path.join(total_data_dir, str(category))
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)

# get all dataset directory names
dataset_list = []
for file in os.listdir(dataset_collection_dir):
    if os.path.isdir(os.path.join(dataset_collection_dir, file)):
        dataset_list.append(file)

for dataset in dataset_list:
    dataset_dir = os.path.join(dataset_collection_dir, dataset)

    if dataset == 'dataset1':
        users = ['3', '4', '5', '6', '7', '9', '10']
        for user in users:
            user_dir = os.path.join(dataset_dir, 'user_' + user)
            for file in os.listdir(user_dir):
                if file.endswith(".jpg"):
                    category = file[0]
                    source_dir = os.path.join(user_dir, file)
                    dest_dir = os.path.join(total_data_dir, category, dataset + '_user' + user + '_' + file)
                    os.rename(source_dir, dest_dir)
    elif dataset == 'dataset2':
        dataset_categories = []
        for file in os.listdir(dataset_dir):
            if os.path.isdir(os.path.join(dataset_dir, file)):
                dataset_categories.append(file)
        dataset_categories.remove('point') # ignore point for now
        for dataset_category in dataset_categories:
            for file in os.listdir(os.path.join(dataset_dir, dataset_category)):
                if file.endswith(".jpg"):
                    source_dir = os.path.join(dataset_dir, dataset_category, file)
                    dest_dir = os.path.join(total_data_dir, dataset_category, dataset + '_category' + dataset_category + '_' + file)
                    os.rename(source_dir, dest_dir)
    elif dataset == 'dataset3':
        users = ['1', '2', '3', '4', '5']
        for user in users:
            user_dir = os.path.join(dataset_dir, 'user_' + user)
            for file in os.listdir(user_dir):
                if file.endswith(".png"):
                    category = file.split('_')[1].upper()
                    if category == 'J' or category == 'Z': continue
                    source_dir = os.path.join(user_dir, file)
                    dest_dir = os.path.join(total_data_dir, category, dataset + '_user' + user + '_' + file)
                    os.rename(source_dir, dest_dir)
    elif dataset == 'dataset4':
        users = ['1', '2', '3', '4', '5']
        for user in users:
            user_dir = os.path.join(dataset_dir, 'user_' + user)
            for category in alpha_categories:
                source_dir = os.path.join(user_dir, category.lower())
                for file in os.listdir(source_dir):
                    if file.endswith(".png"):
                        if file.split('_')[0] == 'depth': continue # ignore depth maps
                        dest_dir = os.path.join(total_data_dir, category, dataset + '_user' + user + '_' + file)
                        os.rename(os.path.join(source_dir, file), dest_dir)
    elif dataset == 'dataset5':
        users = ['1', '2']
        for user in users:
            user_dir = os.path.join(dataset_dir, 'user_' + user)
            for file in os.listdir(user_dir):
                if file.endswith(".jpg"):
                    category = file[0]
                    source_dir = os.path.join(user_dir, file)
                    dest_dir = os.path.join(total_data_dir, category, dataset + '_user' + user + '_' + file)
                    os.rename(source_dir, dest_dir)
    elif dataset == 'dataset6':
        sets = ['1', '2', '3']
        for _set in sets:
            set_dir = os.path.join(dataset_dir, 'set_' + _set)
            for file in os.listdir(set_dir):
                if file.endswith(".jpg"):
                    category = str(file[0])
                    if category == 'Z': continue
                    source_dir = os.path.join(set_dir, file)
                    dest_dir = os.path.join(total_data_dir, category, dataset + '_set' + _set + '_' + file)
                    os.rename(source_dir, dest_dir)


            



