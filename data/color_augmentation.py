import numpy as np
import cv2
from matplotlib.image import imread
from os import listdir
from os.path import isfile, join

def generate_new_data(data_path):
    data_folder = [direc for direc in listdir(data_path) if direc[0] is not '.']
    for f in data_folder:
        sub_path = join(data_path, f)
        contents = [sub for sub in listdir(sub_path) if sub[0] is not '.']
        for char in contents:
            char_path = join(sub_path, char)
            print(char_path)
            imgs = [img for img in listdir(char_path) if img[0] is not '.'] 
            for signing in imgs:
                curr_path = join(char_path, signing)
                new_img = skin_change(curr_path)
                new_path = curr_path[0:len(curr_path)-4] + "_mod.jpg"
                cv2.imwrite(signing, new_img)

def skin_change(path):
    # read image and convert to HSV pixels
    frame = imread(path)[:,:,::-1] 
    converted = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # cv2.imshow("images", converted)
    # cv2.waitKey(0)

    # create skin mask using rough lower and upper bound on HSV scale for skin color
    lower = np.array([0, 48, 20], dtype = 'uint8')
    upper = np.array([15, 200, 200], dtype = 'uint8')
    skinMask = cv2.inRange(converted, lower, upper) # 200x200

    # add HSV values by constants to try to darken skin
    h_const = 0#10
    s_const = 40
    v_const = -50
    for i in range(len(converted)):
        for j in range(len(converted[i])):
            if skinMask[i][j] != 0:
                curr_pixel = converted[i][j]
                curr_pixel[0] = max(0, min(20, curr_pixel[0] + h_const))
                curr_pixel[1] = max(0, min(255, curr_pixel[1] + s_const))
                curr_pixel[2] = max(0, min(200, curr_pixel[2] + v_const))

    converted = cv2.cvtColor(converted, cv2.COLOR_HSV2BGR)

    # show the skin in the image along with the mask
    # cv2.imshow("images", np.hstack([frame, converted]))
    # cv2.waitKey(0)

    return(converted)

data_path = '../../data'
generate_new_data(data_path)

# curr_path = '../../data/train/A/185.jpg'
# test = skin_change(curr_path)
# cv2.imwrite('../../data/train/A/185_mod.jpg', test)