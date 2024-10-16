import atexit
import re
import signal
import sys
import time
from PIL import Image
from rpi_ws281x import PixelStrip, Color, ws

def info(string):
  print(f'\033[94m{string}\033[0m')

def warn(string):
  print(f'\033[93m{string}\033[0m')

if len(sys.argv) < 1:
  warn('Need a filename as argument')
  sys.exit(1)

# SEE https://github.com/rpi-ws281x/rpi-ws281x-python/blob/master/examples/SK6812_strandtest.py
LED_COUNT = 300
LED_PIN = 18          # GPIO pin connected to the pixels (must support PWM!).
LED_FREQ_HZ = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA = 10          # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 10  # Set to 0 for darkest and 255 for brightest
LED_INVERT = False    # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL = 0
LED_STRIP = ws.SK6812_STRIP_RGBW
strip = PixelStrip(
  LED_COUNT,
  LED_PIN,
  LED_FREQ_HZ,
  LED_DMA,
  LED_INVERT,
  LED_BRIGHTNESS,
  LED_CHANNEL,
  ws.SK6812_STRIP_RGBW
)

def clear():
  for i in range(strip.numPixels()):
    strip.setPixelColor(i, Color(0, 0, 0))
  strip.show()

def clean_exit(_signo, _stack_frame):
  clear()
  sys.exit(0)

# Turn off the strip when quitting
atexit.register(clear)
signal.signal(signal.SIGTERM, clean_exit)

if __name__ == '__main__':
  strip.begin()

  filename = sys.argv[1]
  image = Image.open(filename)
  pixels = image.load()
  frameRateSearch = re.search(r'@([\d\.]+)fps', image.text.get('Comment'), re.IGNORECASE)
  if frameRateSearch:
    frameRate = float(frameRateSearch.group(1))
  else:
    warn('No frameRate instruction found, running at 30fps')
    frameRate = 30


  print('\n\033[4m' + image.text.get('Title').strip() + '\033[0m,', image.text.get('Author'))
  print('«', image.text.get('Description').strip(), '»')
  print(f'{frameRate}fps\n')

  for x in range(0, image.width):
    start = time.time()
    for y in range(0, image.height):
      r, g, b, a = pixels[x, y]
      if (r == g == b):
        strip.setPixelColor(y, Color(0, 0, 0, r))
      else:
        strip.setPixelColor(y, Color(g, r, b, 0))
    strip.show()
    print(str(x + 1).rjust(len(str(image.width)), '0'), '/', image.width, '→', '%sms' % int((time.time() - start) * 1000), end='\r')
    time.sleep(1 / frameRate)

  print('\ndone.\n')
