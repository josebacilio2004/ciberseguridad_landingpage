import os
from qreader import QReader
import cv2

def deep_decode():
    qreader = QReader()
    files = ["qr.jpeg", "qr2.jpeg", "qr3.jpeg", "qr4.jpeg"]
    base_path = r"C:\Bacilio\ciberseguridad"
    
    results = {}
    
    for filename in files:
        path = os.path.join(base_path, filename)
        if not os.path.exists(path):
            print(f"File {filename} not found.")
            continue
            
        print(f"--- Analyzing {filename} ---")
        # Load image with cv2
        image = cv2.imread(path)
        if image is None:
            print(f"Could not read {filename}")
            continue
            
        # QReader uses BGR/RGB images
        decoded_text = qreader.detect_and_decode(image=image)
        
        if decoded_text:
            print(f"Payload: {decoded_text[0]}")
            results[filename] = decoded_text[0]
        else:
            print(f"No QR detected in {filename}")
            
    return results

if __name__ == "__main__":
    deep_decode()
