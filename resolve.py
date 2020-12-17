# -*- codecs: utf-8 -*-
from __future__ import unicode_literals
import sys
import codecs
import json
import numpy as np
import cv2 
import pytesseract

pathTessetact = 'A:\\Python\\tesseractOCR\\tesseract.exe'
# pathTessetact = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
pathDataset = 'result.txt'

f = codecs.open('data.json', "r", "utf-8")
dataset = json.loads(f.read())
img = np.array(dataset, dtype='uint8')
img_gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
cv2.imshow('f', img_gray)
cv2.waitKey(0)
pytesseract.pytesseract.tesseract_cmd = pathTessetact
f = codecs.open(pathDataset, "r", "utf-8")
dataset = json.loads(f.read())
t = pytesseract.image_to_string(img_gray, lang='rus')
t = t.lstrip()
t = t.rstrip()
t = t.splitlines()
text = ' '.join(t)

# sys.stdout.write(json.dumps(f'Q: {text}')) 
sys.stdout.write(json.dumps(text)) #Тестовая запись, что нашло на фото, выдает ?????
#----Цикл для поиска в датасете, оставлю его в git (result.txt)---#
# for data in dataset:  
#   for key in data:
#     if(key == text.lstrip().rstrip()):
#       print(data[key])
        # sys.stdout.write(data[key]) 

# config = codecs.open('config.txt', 'r', 'utf-8')
# pathTessetact = ''
# pathDataset = ''
# try:
#   pathTessetact, pathDataset  = config.read().splitlines()
# except:
#   pathTessetact = input('Path to tesseract.exe: ')
#   pathDataset = input('Path to dataset: ')
# pytesseract.pytesseract.tesseract_cmd = pathTessetact
# f = codecs.open(pathDataset, "r", "utf-8")
# dataset = json.loads(f.read())
