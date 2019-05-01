import numpy as np
import cv2
from matplotlib.image import imread

#frame = cv2.imread('~/Downloads/data/train/A/185.jpg')
frame = imread('../../../../../../Downloads/data/train/A/185.jpg')[:,:,::-1]
#cv2.imshow("images", frame)
#cv2.waitKey(0)
print("original frame shape", frame.shape)

lower = np.array([0, 48, 20], dtype = 'uint8')
#upper = np.array([20, 255, 255], dtype = 'uint8')
upper = np.array([15, 200, 200], dtype = 'uint8')

converted = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
print("old converted size:", converted.size)
converted = converted.reshape((200,200,3))
print("new converted size:", converted.size)
skinMask = cv2.inRange(converted, lower, upper)
print(skinMask.size)

for axis in range(3):
    subset = frame[:,:,axis]
    print(subset.shape)


kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
skinMask = cv2.erode(skinMask, kernel, iterations = 2)
skinMask = cv2.dilate(skinMask, kernel, iterations = 2)

# blur the mask to help remove noise, then apply the
# mask to the frame
skinMask = cv2.GaussianBlur(skinMask, (3, 3), 0)
skin = cv2.bitwise_and(frame, frame, mask = skinMask)

# show the skin in the image along with the mask
#cv2.imshow("images", np.hstack([frame, skin]))
#cv2.waitKey(0)