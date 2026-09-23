clc;
clear;
close all;

% Read Image
img = imread('LENA.JFIF');

% Convert to Gray
if size(img,3)==3
    img = rgb2gray(img);
end

% Convert to Binary
bw = imbinarize(img);

% Morphological Boundary Extraction
se = strel('disk',1);
eroded = imerode(bw,se);
boundary = bw - eroded;

% Display
figure;
subplot(1,3,1), imshow(img), title('Original');
subplot(1,3,2), imshow(bw), title('Binary');
subplot(1,3,3), imshow(boundary), title('Boundary');