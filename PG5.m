% # 5. EDGE DETECTION USING OPERATORS (ROBERTS,PREWITTS AND SOBELS OPERATORS)
clc;
clear;
close all;

% Read Image
img = imread('lena.jpg');

% Convert to Gray
if size(img,3)==3
    img = rgb2gray(img);
end

% 5.1 Using Built-in Functions
sobel = edge(img,'sobel');
prewitt = edge(img,'prewitt');
roberts = edge(img,'roberts');
canny = edge(img,'canny');

% 5.2 Without using Built-in Functions (Sobel Gradient)
C = double(img);
Gx = conv2(C, [-1 0 1; -2 0 2; -1 0 1], 'same');
Gy = conv2(C, [-1 -2 -1; 0 0 0; 1 2 1], 'same');
sobel_manual = uint8(sqrt(Gx.^2 + Gy.^2));

% 5.3 Simple Boundary Extraction
se = strel('disk',2);
boundary_simple = img - imerode(img,se);

% Display
figure;
subplot(2,3,1), imshow(img), title('Original');
subplot(2,3,2), imshow(sobel), title('Sobel Built-in');
subplot(2,3,3), imshow(canny), title('Canny Built-in');
subplot(2,3,4), imshow(prewitt), title('Prewitt Built-in');
subplot(2,3,5), imshow(sobel_manual), title('Sobel Without Built-in');
subplot(2,3,6), imshow(boundary_simple), title('Boundary Extracted');
