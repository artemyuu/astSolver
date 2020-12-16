import sys
# -*- codecs: utf-8 -*-
import codecs
import json
import numpy as np
import cv2 

f = codecs.open('data.json', "r", "utf-8")
dataset = json.loads(f.read())
img = np.array(dataset, dtype='uint8')
img = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
cv2.imshow('img', img)
cv2.waitKey(0)
# sys.stdout.write('fromReolvepy')