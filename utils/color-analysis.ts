export type RGB = { r: number; g: number; b: number };
export type LAB = { l: number; a: number; b: number };

// Convert RGB to LAB Color Space
// LAB is perceptually uniform, meaning a small change in value corresponds to a small change in visual perception.
// Perfect for detecting subtle color shifts like pink/purple indicators.
export function rgbToLab(rgb: RGB): LAB {
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

  return {
    l: (116 * y) - 16,
    a: 500 * (x - y),
    b: 200 * (y - z)
  };
}

// Calculate CIEDE2000 Delta E (or simple Euclidean distance for MVP)
// Using simple Euclidean in LAB space for efficiency in this MVP.
// Delta E > 2.3 is generally considered a "Just Noticeable Difference" (JND).
export function calculateDeltaE(lab1: LAB, lab2: LAB): number {
  return Math.sqrt(
    Math.pow(lab1.l - lab2.l, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  );
}

// Calculate Risk Score (0-100) based on Delta E from Baseline (Safe Blue)
// Baseline (Safe): Pure Blue (approx)
// Danger: Pink/Red
export function calculateRiskScore(currentLab: LAB): { score: number; risk: "safe" | "warning" | "danger" } {
  // Define Target Colors in LAB (Approximated)
  // These should be calibrated with the Reference Card in the future
  
  // Safe Blue (Reference)
  // RGB: 0, 243, 255
  const safeBlue: LAB = { l: 87, a: -47, b: -13 }; 
  
  // Warning Purple
  // RGB: 189, 0, 255
  const warningPurple: LAB = { l: 56, a: 82, b: -68 };
  
  // Danger Pink
  // RGB: 255, 0, 85
  const dangerPink: LAB = { l: 54, a: 81, b: 35 };

  const distToSafe = calculateDeltaE(currentLab, safeBlue);
  const distToWarning = calculateDeltaE(currentLab, warningPurple);
  const distToDanger = calculateDeltaE(currentLab, dangerPink);

  // Simple classification logic
  // If closer to Safe -> Low Score
  // If closer to Warning -> Medium Score
  // If closer to Danger -> High Score

  let score = 0;
  let risk: "safe" | "warning" | "danger" = "safe";

  if (distToDanger < distToWarning && distToDanger < distToSafe) {
    risk = "danger";
    score = 80 + Math.random() * 20; // 80-100
  } else if (distToWarning < distToSafe) {
    risk = "warning";
    score = 40 + Math.random() * 30; // 40-70
  } else {
    risk = "safe";
    score = Math.random() * 20; // 0-20
  }

  // Refine score based on actual distance (Mocked for now due to lack of calibration)
  // In a real app, we would linearly interpolate between the reference points.
  
  return { score: Math.round(score), risk };
}

// Simulate getting average color from an image (or ROI)
// In a real app, this would process the canvas pixel data
export function getAverageColor(imageData: ImageData): RGB {
  let r = 0, g = 0, b = 0;
  const count = imageData.data.length / 4;

  for (let i = 0; i < imageData.data.length; i += 4) {
    r += imageData.data[i];
    g += imageData.data[i + 1];
    b += imageData.data[i + 2];
  }

  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count)
  };
}
