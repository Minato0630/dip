% # 8. BOUNDARY EXTRACTION USING MORPHOLOGY
clc;
clear;
close all;

% Read Image
img = imread('lena.jpg');

% Convert to Gray
if size(img,3)==3
    img = rgb2gray(img);
end

% Binarize the image (Compatible with MATLAB 2018 and all versions)
if exist('imbinarize', 'file')
    bw = imbinarize(img);
else
    bw = im2bw(img, graythresh(img));
end

% Create Structuring Element
se = strel('disk',1);

% Perform erosion and dilation
eroded = imerode(bw,se);
dilated = imdilate(bw,se);

% Boundary Extraction
boundary = bw - eroded;

% Display the result
figure;
subplot(2,3,1), imshow(img), title('Original');
subplot(2,3,2), imshow(bw), title('Binary');
subplot(2,3,3), imshow(eroded), title('Erosion');
subplot(2,3,4), imshow(dilated), title('Dilation');
subplot(2,3,5), imshow(boundary), title('Boundary Extracted');
