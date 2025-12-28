import cv2
import numpy as np
import sys
import json
import base64

def adaptive_white_balance(img):
    """
    Apply Gray World algorithm for adaptive white balance.
    """
    result = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(result)
    
    # Calculate scale factor for each channel
    avg_a = np.average(a)
    avg_b = np.average(b)
    
    a = cv2.add(a, 128 - avg_a)
    b = cv2.add(b, 128 - avg_b)
    
    result = cv2.merge((l, a, b))
    result = cv2.cvtColor(result, cv2.COLOR_LAB2BGR)
    return result

def apply_clahe(img):
    """
    Apply Contrast Limited Adaptive Histogram Equalization.
    """
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # Apply CLAHE to L-channel
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    cl = clahe.apply(l)
    
    limg = cv2.merge((cl, a, b))
    result = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
    return result

def analyze_strip(image_data, corners=None):
    # Decode base64 image
    encoded_data = image_data.split(',')[-1]
    nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        return {"error": "Could not decode image"}

    h, w = img.shape[:2]
    
    # Pre-processing
    # 1. Adaptive White Balance (Gray World)
    result = img.astype(np.float32)
    avg_r = np.mean(result[:, :, 2])
    avg_g = np.mean(result[:, :, 1])
    avg_b = np.mean(result[:, :, 0])
    avg_gray = (avg_r + avg_g + avg_b) / 3
    result[:, :, 2] *= (avg_gray / avg_r)
    result[:, :, 1] *= (avg_gray / avg_g)
    result[:, :, 0] *= (avg_gray / avg_b)
    result = np.clip(result, 0, 255).astype(np.uint8)
    
    # 2. CLAHE for contrast
    lab = cv2.cvtColor(result, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    cl = clahe.apply(l)
    enhanced_lab = cv2.merge((cl, a, b))
    enhanced = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
    
    # 3. Perspective Transform or Center Crop
    if corners:
        # corners = {tl: {x, y}, tr: {x, y}, bl: {x, y}, br: {x, y}} in percentages
        pts1 = np.float32([
            [corners['tl']['x'] * w / 100, corners['tl']['y'] * h / 100],
            [corners['tr']['x'] * w / 100, corners['tr']['y'] * h / 100],
            [corners['bl']['x'] * w / 100, corners['bl']['y'] * h / 100],
            [corners['br']['x'] * w / 100, corners['br']['y'] * h / 100]
        ])
        
        # Output rect size
        max_w = 200
        max_h = 500 # PathoStrip is usually long
        pts2 = np.float32([[0, 0], [max_w, 0], [0, max_h], [max_w, max_h]])
        
        matrix = cv2.getPerspectiveTransform(pts1, pts2)
        strip_roi = cv2.warpPerspective(enhanced, matrix, (max_w, max_h))
    else:
        # Fallback to center ROI
        crop_w, crop_h = int(w * 0.3), int(h * 0.15)
        start_x, start_y = (w - crop_w) // 2, (h - crop_h) // 2
        strip_roi = enhanced[start_y:start_y+crop_h, start_x:start_x+crop_w]

    # Analysis: Color Quantification
    # Convert ROI to LAB for better color distance calculation
    strip_lab = cv2.cvtColor(strip_roi, cv2.COLOR_BGR2LAB)
    
    # Reference Colors in LAB (Center points for Safe, Warning, Danger)
    # Safe (Blue): [L, a, b] roughly [50, 0, -30]
    # Warning (Purple): [L, a, b] roughly [40, 30, -30]
    # Danger (Pink): [L, a, b] roughly [60, 50, -10]
    refs = {
        'safe': np.array([50, 0, -30]),
        'warning': np.array([40, 30, -30]),
        'danger': np.array([60, 50, -10])
    }
    
    # Flatten pixels for comparison
    pixels = strip_lab.reshape(-1, 3)
    
    # Calculate distances to each reference color for all pixels
    dist_safe = np.linalg.norm(pixels - refs['safe'], axis=1)
    dist_warning = np.linalg.norm(pixels - refs['warning'], axis=1)
    dist_danger = np.linalg.norm(pixels - refs['danger'], axis=1)
    
    # Assign each pixel to the nearest reference color
    combined_dists = np.vstack([dist_safe, dist_warning, dist_danger])
    nearest = np.argmin(combined_dists, axis=0)
    
    percentages = {
        'safe': float(np.sum(nearest == 0) / len(nearest) * 100),
        'warning': float(np.sum(nearest == 1) / len(nearest) * 100),
        'danger': float(np.sum(nearest == 2) / len(nearest) * 100)
    }
    
    # Determine overall risk
    if percentages['danger'] > 5:
        risk = "danger"
        score = min(100, 80 + percentages['danger'] * 2)
    elif percentages['warning'] > 15:
        risk = "warning"
        score = min(79, 40 + percentages['warning'] * 1.5)
    else:
        risk = "safe"
        score = min(39, percentages['warning'] * 2 + percentages['danger'] * 5)
    
    return {
        "risk": risk,
        "score": int(max(0, min(100, score))),
        "percentages": percentages
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image data provided"}))
        sys.exit(1)
    
    try:
        image_data = sys.argv[1]
        roi = None
        if len(sys.argv) > 2:
            try:
                roi = json.loads(sys.argv[2])
            except:
                pass
                
        result = analyze_strip(image_data, roi)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
