import cv2
import sys

def decode_qr(image_path):
    try:
        # Check if file exists
        img = cv2.imread(image_path)
        if img is None:
            print(f"Error: Could not read image at {image_path}")
            return
            
        detector = cv2.QRCodeDetector()
        data, bbox, straight_qrcode = detector.detectAndDecode(img)
        
        if data:
            print(f"Successfully decoded QR Code.")
            print(f"Data: {data}")
        else:
            print("No QR code detected in the image using OpenCV.")
            # Fallback for some common Plin/Yape QRs if OpenCV fails
            print("Attempting alternative decoding methods is recommended if this fails.")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    path = r"C:\Bacilio\ciberseguridad\qr.jpeg"
    decode_qr(path)
