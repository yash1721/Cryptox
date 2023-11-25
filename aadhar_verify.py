import cv2 
import numpy as np
import pytesseract
import re 
import sys
import base64
# input_data = sys.stdin.read()
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# img = cv2.imread('temp2.png')   
input_data = sys.stdin.buffer.read()
image_bytes = base64.b64decode(input_data)
img = cv2.imdecode(np.frombuffer(image_bytes, dtype=np.uint8), cv2.IMREAD_COLOR)
rgb_planes  = cv2.split ( img )
result_planes = []
result_norm_planes = []
for plane in rgb_planes :
    dilated_img = cv2.dilate(plane, np.ones((10, 10), np.uint8)) 
    bg_img = cv2.medianBlur(dilated_img, 21)
    diff_img = 255 - cv2.absdiff(plane, bg_img)
    norm_img = cv2.normalize(diff_img, None, alpha=0, beta=250, norm_type=cv2.NORM_MINMAX,
                                                 dtype=cv2.CV_8UC1)
    result_planes.append(diff_img)
    result_norm_planes.append(norm_img)

result = cv2.merge(result_planes)
result_norm = cv2.merge(result_norm_planes)
dst = cv2.fastNlMeansDenoisingColored(result_norm, None, 10, 10, 7, 11)      
text = pytesseract.image_to_string(dst).upper().replace(" ", "")
number = str(re.findall(r"[0-9]{11,12}", text)).replace("]", "").replace("[","").replace("'", "")
length = len(number)
final_number = ""
if(length>0):
    for i in range(12):
        final_number+=number[i]
sys.stdout.write(str(final_number));