# BISHOP HEBER COLLEGE (AUTONOMOUS)
## Department of Computer Science (Shift-II)
### M.Sc. Computer Science — Semester III
### Course Title: Digital Image Processing Lab using MATLAB (P25CS3P5)
### End Semester Practical Examination Study Guide (SET-1 to SET-15)

---

## 📌 OVERVIEW & QUESTION SET ARCHITECTURE
The end semester practical examination consists of **two questions carrying 50 marks each (Total: 100 Marks, Duration: 3 Hours)**.
Each student receives a set drawn from **SET-1 to SET-15**.
*(Note: SET-16 to SET-20 in the question bank are for the DevOps Lab course and are excluded here).*

---

# 🌟 SPECIAL SPOTLIGHT: SET-15 FULL BREAKDOWN & CODE

### **Question 1: Histogram Equalization (Histogram Specification, Local Histogram Equalization) [50 Marks]**

#### **Aim:**
To perform Histogram Equalization, Histogram Specification (Matching), and Local Histogram Equalization on a digital image using MATLAB to enhance contrast and adjust gray-level distribution.

#### **Algorithm & Steps:**
1. **Histogram Computation (`imhist`):** Count the frequency of each intensity level $r_k \in [0, 255]$.
2. **Global Histogram Equalization (`histeq`):** Compute Cumulative Distribution Function (CDF) and map input pixel values to uniform distribution:
   $$s_k = T(r_k) = (L-1) \sum_{j=0}^{k} p_r(r_j)$$
3. **Histogram Specification (`imhistmatch`):** Map the histogram of the input image to match the histogram profile of a reference image.
4. **Local Histogram Equalization (`adapthisteq`):** Apply Contrast-Limited Adaptive Histogram Equalization (CLAHE) over localized contextual tiles to enhance local contrast without over-amplifying noise.

#### **MATLAB Code:**
```matlab
% ==============================================================
% SET-15: QUESTION 1 - HISTOGRAM EQUALIZATION, SPECIFICATION & LOCAL
% ==============================================================
clc;
clear;
close all;

% 1. Read input image and reference image
img = imread('lena.png');
ref = imread('penquin.jpg');

% Convert to grayscale if RGB
if size(img, 3) == 3
    img = rgb2gray(img);
end
if size(ref, 3) == 3
    ref = rgb2gray(ref);
end

% 2. Histogram
h = imhist(img);

% 3. Global Histogram Equalization
equal = histeq(img);

% 4. Histogram Specification / Matching
match = imhistmatch(img, ref);

% 5. Local Histogram Equalization (Adaptive / Contextual)
local_equal = adapthisteq(img);

% 6. Display Results
figure('Name', 'SET-15 Q1: Histogram Equalization');

subplot(2, 3, 1), imshow(img), title('1. Original Image');
subplot(2, 3, 2), imhist(img), title('2. Original Histogram');

subplot(2, 3, 3), imshow(equal), title('3. Global Equalized');
subplot(2, 3, 4), imhist(equal), title('4. Global Equalized Hist');

subplot(2, 3, 5), imshow(match), title('5. Histogram Specified (Matched)');
subplot(2, 3, 6), imshow(local_equal), title('6. Local Equalized (CLAHE)');
```

---

### **Question 2: Boundary Extraction (Binarize the image, Perform erosion, dilation, Display the result) [50 Marks]**

#### **Aim:**
To extract the boundary of objects in an image using morphological operations (binarization, erosion, dilation, and set difference) in MATLAB.

#### **Algorithm & Steps:**
1. **Convert to Grayscale & Binarize (`imbinarize`):** Segment the foreground from the background using Otsu's automatic global threshold.
2. **Structuring Element (`strel`):** Create a flat disk or square structuring element $B$ (e.g. radius 1 or 2).
3. **Morphological Erosion (`imerode`):** Shrink the binary object:
   $$A \ominus B = \{z \mid (B)_z \subseteq A\}$$
4. **Morphological Dilation (`imdilate`):** Expand the binary object:
   $$A \oplus B = \{z \mid (\hat{B})_z \cap A \neq \emptyset\}$$
5. **Boundary Extraction:**
   - **Internal Boundary:** $\beta(A) = A - (A \ominus B)$
   - **External Boundary:** $\beta_{ext}(A) = (A \oplus B) - A$
   - **Morphological Gradient:** $\beta_{grad}(A) = (A \oplus B) - (A \ominus B)$
6. **Display Results:** Show original, binary, eroded, dilated, and extracted boundary images.

#### **MATLAB Code:**
```matlab
% ==============================================================
% SET-15: QUESTION 2 - BOUNDARY EXTRACTION USING MORPHOLOGY
% ==============================================================
clc;
clear;
close all;

% 1. Read input image
img = imread('LENA.JFIF');

% Convert to grayscale if RGB
if size(img, 3) == 3
    img = rgb2gray(img);
end

% 2. Binarize the image
bw = imbinarize(img);

% 3. Create Structuring Element
se = strel('disk', 1);

% 4. Perform Morphological Erosion & Dilation
eroded = imerode(bw, se);
dilated = imdilate(bw, se);

% 5. Boundary Extraction (Internal Boundary)
boundary = bw - eroded;

% 6. Morphological Gradient Boundary (External - Internal)
boundary_grad = dilated - eroded;

% 7. Display Results
figure('Name', 'SET-15 Q2: Boundary Extraction');

subplot(2, 3, 1), imshow(img), title('1. Original Image');
subplot(2, 3, 2), imshow(bw), title('2. Binarized Image');
subplot(2, 3, 3), imshow(eroded), title('3. Morphological Erosion');
subplot(2, 3, 4), imshow(dilated), title('4. Morphological Dilation');
subplot(2, 3, 5), imshow(boundary), title('5. Boundary (bw - eroded)');
subplot(2, 3, 6), imshow(boundary_grad), title('6. Morphological Gradient');
```

---

# 📋 MASTER SET-WISE QUESTION MAPPING TABLE (SET-1 to SET-15)

| SET No. | Question 1 (50 Marks) | Question 2 (50 Marks) | Website / Script Mapping |
| :---: | :--- | :--- | :--- |
| **SET-1** | Basic Image Operations (Spatial & Intensity Resolution) | Image Enhancement (Sigmoid, Smoothing, Sharpening, Gamma) | **PG1.m** |
| **SET-2** | Histogram Equalization (Specification, Local Hist Equalization) | Image Restoration (Wiener filtering for restoration) | **PG2.m & PG3.m** |
| **SET-3** | Image Filtering (Low-pass, High-pass, Median, Gaussian) | Edge Detection (Built-in, Without Built-in, Simple Boundary) | **PG4.m & PG5.m** |
| **SET-4** | Image Compression (Block Truncation Coding, Bitplane Coding) | Image Subtraction (Grayscale, Resizing, Difference Image) | **PG6.m & PG7.m** |
| **SET-5** | Boundary Extraction (Binarize, Erosion, Dilation, Display) | Image Segmentation (Thresholding, Canny, K-means, Watershed) | **PG8.m & PG9.m** |
| **SET-6** | Basic Image Operations (Spatial & Intensity Resolution) | Histogram Equalization (Specification, Local Hist Equalization) | **PG1.m & PG2.m** |
| **SET-7** | Image Enhancement (Sigmoid, Smoothing, Sharpening, Gamma) | Image Restoration (Wiener filtering for restoration) | **PG1.m & PG3.m** |
| **SET-8** | Image Filtering (Low-pass, High-pass, Median, Gaussian) | Image Subtraction (Grayscale, Resizing, Difference Image) | **PG4.m & PG7.m** |
| **SET-9** | Edge Detection (Built-in, Without Built-in, Simple Boundary) | Image Compression (Block Truncation Coding, Bitplane Coding) | **PG5.m & PG6.m** |
| **SET-10**| Boundary Extraction (Binarize, Erosion, Dilation, Display) | Image Segmentation (Thresholding, Canny, K-means, Watershed) | **PG8.m & PG9.m** |
| **SET-11**| Basic Image Operations (Spatial & Intensity Resolution) | Image Filtering (Low-pass, High-pass, Median, Gaussian) | **PG1.m & PG4.m** |
| **SET-12**| Image Enhancement (Sigmoid, Smoothing, Sharpening, Gamma) | Edge Detection (Built-in, Without Built-in, Simple Boundary) | **PG1.m & PG5.m** |
| **SET-13**| Image Restoration (Wiener filtering for restoration) | Image Compression (Block Truncation Coding, Bitplane Coding) | **PG3.m & PG6.m** |
| **SET-14**| Image Subtraction (Grayscale, Resizing, Difference Image) | Image Segmentation (Thresholding, Canny, K-means, Watershed) | **PG7.m & PG9.m** |
| **SET-15**| Histogram Equalization (Specification, Local Hist Equalization) | Boundary Extraction (Binarize, Erosion, Dilation, Display) | **PG2.m & PG8.m** |

---

# 📚 COMPLETE TOPIC SOLUTIONS & LAB CODES

---

### **TOPIC 1: Basic Image Operations (Spatial & Intensity Resolution)**
*(Found in: SET-1, SET-6, SET-11)*

#### **Concept:**
- **Spatial Resolution:** Refers to the density of pixels in an image (sampling). Decreasing spatial resolution sub-samples or resizes the grid (e.g., $512 \times 512 \to 256 \times 256 \to 128 \times 128 \to 64 \times 64$), creating pixelation or checkerboard effects.
- **Intensity Resolution:** Refers to the number of gray levels per pixel (quantization). In an 8-bit image ($2^8 = 256$ levels), reducing to 4 bits ($2^4 = 16$ levels) or 1 bit ($2^1 = 2$ levels) produces contouring/false contour artifacts.

#### **MATLAB Code:**
```matlab
clc; clear; close all;
img = imread('lena.png');
if size(img,3)==3, img = rgb2gray(img); end

% Spatial Resolution (Downsampling)
res_256 = imresize(img, [256 256]);
res_128 = imresize(img, [128 128]);
res_64  = imresize(img, [64 64]);
res_32  = imresize(img, [32 32]);

% Intensity Resolution (Gray-Level Quantization)
int_6bit = floor(double(img) / 4) * 4;     % 64 levels
int_4bit = floor(double(img) / 16) * 16;   % 16 levels
int_2bit = floor(double(img) / 64) * 64;   % 4 levels
int_1bit = floor(double(img) / 128) * 128; % 2 levels (binary)

figure;
subplot(2,4,1), imshow(img), title('Original (512x512)');
subplot(2,4,2), imshow(res_128), title('Spatial 128x128');
subplot(2,4,3), imshow(res_64), title('Spatial 64x64');
subplot(2,4,4), imshow(res_32), title('Spatial 32x32');

subplot(2,4,5), imshow(uint8(int_6bit)), title('6-Bit (64 levels)');
subplot(2,4,6), imshow(uint8(int_4bit)), title('4-Bit (16 levels)');
subplot(2,4,7), imshow(uint8(int_2bit)), title('2-Bit (4 levels)');
subplot(2,4,8), imshow(uint8(int_1bit)), title('1-Bit (2 levels)');
```

---

### **TOPIC 2: Image Enhancement (Smoothing, Sharpening, Contrast Stretching, Gamma, Sigmoid)**
*(Found in: SET-1, SET-7, SET-12 | Script: PG1.m)*

#### **Concept:**
- **Smoothing:** Replaces pixel with average of its neighbors using average mask `fspecial('average', [3 3])` to suppress high-frequency noise.
- **Sharpening:** Highlights edges and fine details using `imsharpen()` or high-pass Laplacian filter.
- **Contrast Stretching:** Linear normalization $s = (r - r_{min}) \cdot \frac{L-1}{r_{max} - r_{min}}$ via `imadjust(img, stretchlim(img), [])`.
- **Gamma Correction:** Power-law transformation $s = c \cdot r^\gamma$. ($\gamma < 1$ brightens dark regions, $\gamma > 1$ darkens bright regions).
- **Sigmoidal Function:** S-shaped non-linear enhancement $s = \frac{1}{1 + e^{\text{gain} \cdot (\text{cutoff} - r)}}$.

#### **MATLAB Code:**
```matlab
clc; clear; close all;
img = imread('lena.png');

% Smoothing
smooth = imfilter(img, fspecial('average', [3 3]));

% Sharpening
sharp = imsharpen(img);

% Contrast Stretching
contrast = imadjust(img, stretchlim(img), []);

% Gamma Correction (gamma = 0.7)
gamma = im2double(img) .^ 0.7;

% Sigmoidal Enhancement
x = im2double(img);
sigmoid = 1 ./ (1 + exp(5 * (0.5 - x)));

figure;
subplot(2,3,1), imshow(img), title('Original');
subplot(2,3,2), imshow(smooth), title('Smoothing');
subplot(2,3,3), imshow(sharp), title('Sharpening');
subplot(2,3,4), imshow(contrast), title('Contrast Stretching');
subplot(2,3,5), imshow(gamma), title('Gamma (0.7)');
subplot(2,3,6), imshow(sigmoid), title('Sigmoidal');
```

---

### **TOPIC 3: Image Restoration (Wiener Filtering)**
*(Found in: SET-2, SET-7, SET-13 | Script: PG3.m)*

#### **Concept:**
Degradation model: $g(x,y) = h(x,y) * f(x,y) + \eta(x,y)$.
Wiener deconvolution minimizes mean square error:
$$W(u,v) = \frac{H^*(u,v)}{|H(u,v)|^2 + \text{NSR}}$$
where $\text{NSR} = \frac{\sigma_{noise}^2}{\sigma_{signal}^2}$.

#### **MATLAB Code:**
```matlab
clc; clear; close all;
img = im2double(imread('penquin.jpg'));

% Simulate Motion Blur
psf = fspecial('motion', 20, 45);
blur = imfilter(img, psf, 'conv', 'circular');

% Simulate Additive Gaussian Noise
noise = imnoise(blur, 'gaussian', 0, 0.001);

% Wiener Deconvolution
nsr = 0.001 / var(img(:));
restored = deconvwnr(noise, psf, nsr);

figure;
subplot(1,3,1), imshow(img), title('Original Image');
subplot(1,3,2), imshow(noise), title('Degraded (Motion + Noise)');
subplot(1,3,3), imshow(restored), title('Restored (Wiener Filter)');
```

---

### **TOPIC 4: Image Filtering (Low-pass, High-pass, Median, Gaussian)**
*(Found in: SET-3, SET-8, SET-11 | Script: PG4.m)*

#### **Concept:**
- **Low-pass Filter:** Average/box filter `fspecial('average', [3 3])` smooths noise.
- **High-pass Filter:** Sobel/Laplacian mask enhances high frequencies and boundaries.
- **Median Filter:** Non-linear filter `medfilt2()` that replaces central pixel with median of window; ideal for salt-and-pepper noise while preserving sharp edges.
- **Gaussian Filter:** `imgaussfilt(img, sigma)` weights neighboring pixels by 2D Gaussian bell curve.

#### **MATLAB Code:**
```matlab
clc; clear; close all;
img = imread('lena.png');

low = imfilter(img, fspecial('average', [3 3]));
high = imfilter(img, fspecial('sobel'));

med(:,:,1) = medfilt2(img(:,:,1));
med(:,:,2) = medfilt2(img(:,:,2));
med(:,:,3) = medfilt2(img(:,:,3));

sharp = imsharpen(img);
gauss = imgaussfilt(img, 2);

figure;
subplot(2,3,1), imshow(img), title('Original');
subplot(2,3,2), imshow(low), title('Low-pass (Average)');
subplot(2,3,3), imshow(high, []), title('High-pass (Sobel)');
subplot(2,3,4), imshow(med), title('Median Filter');
subplot(2,3,5), imshow(sharp), title('Sharpen');
subplot(2,3,6), imshow(gauss), title('Gaussian Filter (\sigma=2)');
```

---

### **TOPIC 5: Edge Detection (Built-in, Without Built-in, Boundary Extraction)**
*(Found in: SET-3, SET-9, SET-12 | Script: PG5.m)*

#### **Concept:**
- **Built-in Functions:** Sobel, Prewitt, Roberts, Canny (multi-stage: Gaussian smoothing, gradient computation, non-maximum suppression, hysteresis thresholding), and LoG (`fspecial('log')`).
- **Without Built-in Functions:** Convolve image matrix with horizontal mask $G_x = \begin{bmatrix}-1&0&1\\-2&0&2\\-1&0&1\end{bmatrix}$ and vertical mask $G_y = \begin{bmatrix}-1&-2&-1\\0&0&0\\1&2&1\end{bmatrix}$, then compute magnitude $\nabla f = \sqrt{G_x^2 + G_y^2}$.
- **Simple Boundary Extraction:** Subtract eroded image from original image: $A - (A \ominus B)$.

#### **MATLAB Code:**
```matlab
clc; clear; close all;
img = imread('LENA.JFIF');
if size(img,3)==3, img = rgb2gray(img); end

% 1. Built-in Functions
sobel = edge(img, 'sobel');
canny = edge(img, 'canny');
prewitt = edge(img, 'prewitt');

% 2. Without Built-in Functions (Manual Sobel Gradient)
C = double(img);
Gx = conv2(C, [-1 0 1; -2 0 2; -1 0 1], 'same');
Gy = conv2(C, [-1 -2 -1; 0 0 0; 1 2 1], 'same');
sobel_manual = uint8(sqrt(Gx.^2 + Gy.^2));

% 3. Simple Boundary Extraction
se = strel('disk', 2);
boundary_simple = img - imerode(img, se);

figure;
subplot(2,3,1), imshow(img), title('Original');
subplot(2,3,2), imshow(sobel), title('Sobel (Built-in)');
subplot(2,3,3), imshow(canny), title('Canny (Built-in)');
subplot(2,3,4), imshow(prewitt), title('Prewitt (Built-in)');
subplot(2,3,5), imshow(sobel_manual), title('Sobel (Without Built-in)');
subplot(2,3,6), imshow(boundary_simple), title('Simple Boundary Extracted');
```

---

### **TOPIC 6: Image Compression (Block Truncation Coding & Bitplane Coding)**
*(Found in: SET-4, SET-9, SET-13 | Script: PG6.m)*

#### **Concept:**
- **Block Truncation Coding (BTC):** Lossy spatial compression technique. Divides image into $k \times k$ blocks (e.g. $4 \times 4$). Calculates block mean $\bar{x}$. Pixels $\ge \bar{x}$ are encoded as bit `1`, and pixels $< \bar{x}$ as bit `0`. The block is reconstructed using the two cluster means $a$ and $b$, preserving sample mean and standard deviation.
- **Bitplane Coding:** Decomposes an 8-bit image into 8 binary matrices using `bitget(img, k)`. Higher bitplanes (8th, 7th) preserve major structural contours, while lower bitplanes (1st, 2nd) store subtle textures or noise.
- **Compression Ratio (CR):** $\text{CR} = \frac{\text{Uncompressed Bytes}}{\text{Compressed Bytes}}$.

#### **MATLAB Code:**
```matlab
clc; clear; close all;
img = imread('LENA.JFIF');
if size(img,3)==3, img = rgb2gray(img); end

% 1. Block Truncation Coding (BTC)
k = 4;
x1 = double(img);
[n, m] = size(x1);
out_btc = zeros(n, m);
for i = 1:k:n
    for j = 1:k:m
        blk = x1(i:min(i+k-1,n), j:min(j+k-1,m));
        mn = mean(blk(:));
        bm = blk >= mn;
        hi = mean(blk(bm)); if isnan(hi), hi = mn; end
        lo = mean(blk(~bm)); if isnan(lo), lo = mn; end
        out_btc(i:min(i+k-1,n), j:min(j+k-1,m)) = bm*hi + (~bm)*lo;
    end
end

% 2. Bitplane Coding (8 Planes)
s = zeros(size(img,1), size(img,2), 8);
for b = 1:8
    s(:,:,b) = bitget(img, b);
end
% Reconstruction
rec_bitplane = s(:,:,1) + s(:,:,2)*2 + s(:,:,3)*4 + s(:,:,4)*8 + ...
               s(:,:,5)*16 + s(:,:,6)*32 + s(:,:,7)*64 + s(:,:,8)*128;

% 3. Compression Ratio Calculation
imwrite(img, 'compressed.jpg', 'Quality', 30);
o = dir('lena.png'); c = dir('compressed.jpg');
cr = o.bytes / c.bytes;
fprintf('Compression Ratio = %.2f\n', cr);

figure;
subplot(2,2,1), imshow(img), title('Original');
subplot(2,2,2), imshow(uint8(out_btc)), title('BTC Decoded');
subplot(2,2,3), imshow(uint8(rec_bitplane)), title('Bitplane Recovered');
subplot(2,2,4), imshow(imread('compressed.jpg')), title(sprintf('JPEG (CR = %.2f)', cr));
```

---

### **TOPIC 7: Image Subtraction**
*(Found in: SET-4, SET-8, SET-14 | Script: PG7.m)*

#### **Concept:**
Image subtraction computes absolute difference between corresponding pixels of two registered images:
$$g(x,y) = |f_1(x,y) - f_2(x,y)|$$
Used extensively in change detection, medical digital subtraction angiography (DSA), background subtraction in surveillance, and mask subtraction.

#### **MATLAB Code:**
```matlab
clc; clear; close all;
img1 = imread('LENA.JFIF');
img2 = imread('image.JFIF');

if size(img1,3)==3, img1 = rgb2gray(img1); end
if size(img2,3)==3, img2 = rgb2gray(img2); end

% Ensure identical dimensions
img2 = imresize(img2, size(img1));

% Compute Absolute Difference
result = imabsdiff(img1, img2);

figure;
subplot(1,3,1), imshow(img1), title('Image 1');
subplot(1,3,2), imshow(img2), title('Image 2');
subplot(1,3,3), imshow(result), title('Subtracted Image (imabsdiff)');
```

---

### **TOPIC 8: Image Segmentation (Thresholding, Canny, K-means, Watershed)**
*(Found in: SET-5, SET-10, SET-14 | Script: PG9.m)*

#### **Concept:**
- **Otsu Global Thresholding:** `graythresh()` maximizes inter-class variance between object and background.
- **Canny Edge Detection:** Multi-stage optimal detector finds sharp local gradient maxima.
- **K-means Clustering:** `imsegkmeans()` clusters pixels into $K$ feature centroids (e.g. $K=3$) based on color/intensity proximity.
- **Watershed Segmentation:** Treats gradient image as topographical surface; immersion simulates catchment basins separated by watershed boundary ridge lines.

#### **MATLAB Code:**
```matlab
clc; clear; close all;
img = imread('lena.png');
if size(img,3)==3, grayImage = rgb2gray(img); else, grayImage = img; end

% 1. Thresholding (Otsu)
level = graythresh(grayImage);
binaryImage = imbinarize(grayImage, level);

% 2. Edge Detection (Canny)
edges = edge(grayImage, 'canny');

% 3. K-means Clustering (K=3)
numClusters = 3;
[clusterIdx, ~] = imsegkmeans(grayImage, numClusters);
clusteredImage = label2rgb(clusterIdx);

% 4. Watershed Segmentation
gradientImage = imgradient(grayImage);
markerImage = imextendedmin(gradientImage, 0.1);
watershedImage = watershed(gradientImage);
watershedImage(gradientImage == 0) = 0;
watershedRGB = label2rgb(watershedImage, 'jet', 'k', 'shuffle');

figure;
subplot(2,2,1), imshow(img), title('Original Image');
subplot(2,2,2), imshow(binaryImage), title('Otsu Thresholding');
subplot(2,2,3), imshow(edges), title('Canny Edge Detection');
subplot(2,2,4), imshow(clusteredImage), title('K-means Clustering (K=3)');

figure;
imshow(watershedRGB), title('Watershed Segmentation');
```

---

# 🧠 ESSENTIAL VIVA VOCE QUESTIONS & ANSWERS (TOP 15)

1. **What is the difference between Spatial Resolution and Intensity Resolution?**
   - *Spatial Resolution* is the smallest discernible detail in an image, measured in dots/pixels per unit distance (e.g., DPI, $512 \times 512$).
   - *Intensity Resolution* (radiometric/bit resolution) is the smallest discernible change in gray level, determined by bit depth (e.g., 8-bit = 256 gray levels).

2. **Why is Histogram Equalization used?**
   - It redistributes pixel intensity levels uniformly across the full dynamic range $[0, 255]$, maximizing contrast in images that are washed out, over-exposed, or under-exposed.

3. **What is the difference between Global Histogram Equalization and Local Histogram Equalization (CLAHE)?**
   - *Global Equalization (`histeq`)* uses one global transfer function for the whole image; it can over-amplify background noise and wash out local details.
   - *Local Equalization (`adapthisteq`)* computes histograms over local contextual tiles (e.g. $8 \times 8$), clips the histogram at a predefined limit to avoid noise amplification, and interpolates across tile boundaries.

4. **What is Histogram Specification (Matching)?**
   - It transforms an image so that its histogram matches a designated target histogram (such as a reference image) rather than a flat, uniform distribution.

5. **How does the Wiener Filter work in image restoration?**
   - It performs minimum mean square error (MMSE) deconvolution in the frequency domain, balancing inverse filtering with noise attenuation using the Noise-to-Signal Ratio ($\text{NSR} = \sigma_{noise}^2 / \sigma_{signal}^2$).

6. **Why is the Median Filter preferred over Average Filter for Salt-and-Pepper noise?**
   - The average filter blurs sharp edges and incorporates outlier impulse noise values into the average. The median filter selects the median ranking value, completely eliminating extreme impulse values ($0$ and $255$) without blurring step edges.

7. **How does the Canny edge detector work?**
   - 1. Gaussian smoothing to reduce noise.
   - 2. Gradient magnitude & direction calculation.
   - 3. Non-maximum suppression to thin thick edges to 1-pixel width.
   - 4. Hysteresis thresholding with high and low thresholds to retain weak edges connected to strong edges.

8. **What are the Sobel operators $G_x$ and $G_y$?**
   - $G_x = \begin{bmatrix}-1&0&1\\-2&0&2\\-1&0&1\end{bmatrix}$ detects vertical edges (horizontal gradient).
   - $G_y = \begin{bmatrix}-1&-2&-1\\0&0&0\\1&2&1\end{bmatrix}$ detects horizontal edges (vertical gradient).

9. **What is Block Truncation Coding (BTC)?**
   - A lossy spatial domain image compression technique that divides the image into blocks (e.g., $4 \times 4$), computes block mean, stores a 1-bit bitmap per pixel, and stores two reconstruction levels to preserve the first two sample moments.

10. **What are the mathematical formulas for Morphological Boundary Extraction?**
    - Internal Boundary: $\beta(A) = A - (A \ominus B)$ (Original minus Eroded)
    - External Boundary: $\beta_{ext}(A) = (A \oplus B) - A$ (Dilated minus Original)
    - Morphological Gradient: $\beta_{grad}(A) = (A \oplus B) - (A \ominus B)$ (Dilated minus Eroded)

11. **What is a Structuring Element in mathematical morphology?**
    - A small matrix/mask (e.g. disk, square, cross, line) with an origin that probes the shape and geometric structure of foreground objects during erosion and dilation. Created in MATLAB with `strel('disk', r)` or `strel('square', w)`.

12. **What is Image Subtraction used for in practice?**
    - Digital Subtraction Angiography (DSA) in cardiology to visualize blood vessels by subtracting mask images, background subtraction in video tracking, and defect detection in manufacturing.

13. **How does Otsu's thresholding method find the optimal threshold?**
    - It iterates over all possible thresholds $t \in [0, 255]$ and selects the threshold that maximizes between-class variance $\sigma_B^2(t)$ (equivalent to minimizing within-class variance). In MATLAB: `level = graythresh(img);`.

14. **How does K-means clustering segment an image?**
    - It assigns each pixel to the nearest of $K$ cluster centroids, recalculates centroids as the mean of assigned pixels, and repeats until convergence. In MATLAB: `[clusterIdx, centers] = imsegkmeans(img, K);`.

15. **What is the Watershed Segmentation algorithm?**
    - It views the gradient magnitude image as a 3D topographic relief map where pixel values are altitudes. Water rising from local minima fills catchment basins. Dams built where basins meet form watershed division lines.
