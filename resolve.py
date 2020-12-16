# -*- codecs: utf-8 -*-
import sys
import codecs
import json
import numpy as np
import cv2 
import pytesseract

pathTessetact = 'A:\\Python\\tesseractOCR\\tesseract.exe'
pathDataset = 'result.txt'

f = codecs.open('data.json', "r", "utf-8")
dataset = json.loads(f.read())
img = np.array(dataset, dtype='uint8')
img_gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
pytesseract.pytesseract.tesseract_cmd = pathTessetact
f = codecs.open(pathDataset, "r", "utf-8")
dataset = json.loads(f.read())
t = pytesseract.image_to_string(img_gray, lang='rus')
t = t.lstrip()
t = t.rstrip()
t = t.splitlines()
text = ' '.join(t)
print(f'Q: {text}')
sys.stdout.write(text) #Тестовая запись, что нашло на фото, выдает ?????
#----Цикл для поиска в датасете, оставлю его в git (result.txt)---#
# for data in dataset:  
#   for key in data:
#     if(key == text.lstrip().rstrip()):
#       print(data[key])
        # sys.stdout.write(data[key]) 