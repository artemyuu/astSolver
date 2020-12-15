# -*- codecs: utf-8 -*-
import codecs
import time
import numpy as np
from PIL import ImageGrab
import cv2
import os
import re
import pytesseract
import pyautogui
import json
import keyboard
import requests
import socket
import sys

BBOX = []
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_address = ('localhost', 3000)
sock.connect(server_address)

def getAnswer():
  y1 = BBOX.pop()
  x1 = BBOX.pop()
  y0 = BBOX.pop()
  x0 = BBOX.pop()
  # print(x0, y0, x1 ,y1)
  screen = np.array(ImageGrab.grab(bbox = (x0, y0, x1, y1)))
  # print(screen)
  msg = [1,2,3]
  sock.send(bytes(screen))
  # screen_gray = cv2.cvtColor(screen, cv2.COLOR_RGB2GRAY)
  # t = pytesseract.image_to_string(screen_gray, lang='rus')
  # t = t.lstrip()
  # t = t.rstrip()
  # t = t.splitlines()
  # text = ' '.join(t)
  # print(f'Q: {text}')
  # for data in dataset:
  #   for key in data:
  #     if(key == text.lstrip().rstrip()):
  #       print(f'A: {data[key]}')
  #       os.system("echo %s | clip" % data[key])

def mousePosition():
  x, y = pyautogui.position()
  BBOX.append(x)
  BBOX.append(y)

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
print('Started...')
keyboard.add_hotkey('X', mousePosition)
keyboard.add_hotkey('Q', getAnswer)
keyboard.wait('Ctrl + Q')