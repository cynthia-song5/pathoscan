import cv2
import numpy as np
import base64
import json
import os
import sys

# Add the parent directory to sys.path to import the script
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from scripts.analyze_strip import analyze_strip

def test_perspective():
    # Create a 500x500 black image
    img = np.zeros((500, 500, 3), dtype=np.uint8)
    
    # Draw a "distorted" PathoStrip (a quad)
    # Let's say it's tilted
    pts = np.array([[100, 100], [200, 150], [150, 400], [50, 350]], np.int32)
    cv2.fillPoly(img, [pts], (255, 0, 0)) # Blue (Safe)
    
    # Add some "Danger" (Pink) inside the quad
    cv2.circle(img, (120, 250), 20, (200, 100, 255), -1) # Pinkish
    
    # Encode to base64
    _, buffer = cv2.imencode('.jpg', img)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    
    # Define corners in percentages
    corners = {
        'tl': {'x': 20.0, 'y': 20.0}, # (100, 100)
        'tr': {'x': 40.0, 'y': 30.0}, # (200, 150)
        'bl': {'x': 10.0, 'y': 70.0}, # (50, 350)
        'br': {'x': 30.0, 'y': 80.0}  # (150, 400)
    }
    
    print("Testing perspective transform with corners...")
    result = analyze_strip(img_base64, corners)
    print(json.dumps(result, indent=2))
    
    if "error" in result:
        print("FAILED: Error in analysis")
        return False
    
    print("SUCCESS: Result received")
    return True

if __name__ == "__main__":
    test_perspective()
