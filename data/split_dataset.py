# splits raw dataset into train/val/test directories

import os
import random
import string
import math

output_data_dir = '/Users/swetharevanur/Documents/spring/cs194w/pytorch-asl/data'
raw_data_dir = '/Users/swetharevanur/Documents/spring/cs194w/pytorch-asl/raw'

split_names = ['train', 'val', 'test']
SPLIT_RATIO = [0.6, 0.2, 0.2] # proportion in train, val, and test

alpha_categories = list(string.ascii_lowercase.upper())
alpha_categories.remove('J')
alpha_categories.remove('Z')
numeric_categories = list(range(10))
categories = alpha_categories + numeric_categories

# create split directories
for split in split_names:
    for category in categories:
        dir_name = os.path.join(output_data_dir, split, str(category))
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)

# compute dataset statistics
total_num_images = 0
all_image_fnames = set()
for category in categories:
    image_counter = 0
    category_dir = os.path.join(raw_data_dir, str(category))
    for file in os.listdir(category_dir):
        if file.endswith('.jpg') or file.endswith('.jpg'): 
            image_counter += 1
            all_image_fnames.add(os.path.join(category_dir, file))
    print('Category: %s; Count: %d' % (str(category), image_counter))
    total_num_images += image_counter
print('##### Total: %d #####' % total_num_images)

# split data
num_train = math.ceil(total_num_images * SPLIT_RATIO[0])
num_val = math.ceil(total_num_images * SPLIT_RATIO[1])
num_test = total_num_images - num_train - num_val
print('##### Train: %d #####' % num_train)
print('##### Validation: %d #####' % num_val)
print('##### Test: %d #####' % num_test)

# train
train_fnames = random.sample(all_image_fnames, num_train)
for fname_index in range(len(train_fnames)):
    fname = train_fnames[fname_index]
    category = fname.split('/')[-2]
    dest_fname = os.path.join(output_data_dir, 'train', category, str(fname_index) + '.jpg')
    os.rename(fname, dest_fname)
    all_image_fnames.remove(fname)

# val
val_fnames = random.sample(all_image_fnames, num_val)
for fname_index in range(len(val_fnames)):
    fname = val_fnames[fname_index]
    category = fname.split('/')[-2]
    dest_fname = os.path.join(output_data_dir, 'val', category, str(fname_index) + '.jpg')
    os.rename(fname, dest_fname)
    all_image_fnames.remove(fname)

# test
test_fnames = random.sample(all_image_fnames, num_test)
for fname_index in range(len(test_fnames)):
    fname = test_fnames[fname_index]
    category = fname.split('/')[-2]
    dest_fname = os.path.join(output_data_dir, 'test', category, str(fname_index) + '.jpg')
    os.rename(fname, dest_fname)
    all_image_fnames.remove(fname)

