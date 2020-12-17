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
HOST = input('HOST: ')
# HOST = '127.0.0.1'
PORT = input('PORT: ')
# PORT = '33333'
BYTES_READ = 65536

def getAnswer():
  sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  server_address = (HOST, int(PORT))
  sock.connect(server_address)  
  y1 = BBOX.pop()
  x1 = BBOX.pop()
  y0 = BBOX.pop()
  x0 = BBOX.pop()
  screen = np.array(ImageGrab.grab(bbox = (x0, y0, x1, y1)))
  scr = json.dumps(screen.tolist())
  scr_bytes = scr.encode('utf-8')
  size = size_of_screen(scr_bytes)
  sock.send(data_size_str(size))
  sock.send(scr_bytes)

  data = sock.recv(BYTES_READ).decode('utf-8')
  d = json.loads(data)
  print(d)
  sock.close()
def mousePosition():
  x, y = pyautogui.position()
  BBOX.append(x)
  BBOX.append(y)

print('Started...')

def size_of_screen(bytes):
  return len(bytes)


def data_size_str(size):
  return ('size:' + str(size) + ':').encode('utf-8')


keyboard.add_hotkey('X', mousePosition)
keyboard.add_hotkey('Q', getAnswer)
keyboard.wait('Ctrl + Q')