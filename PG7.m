% # 7. IMAGE SUBTRACTION
clc;
clear;
close all;

% Read Images
img1 = imread('lena.jpg');
img2 = imread('LENA.jfif');

% Convert to Gray
if size(img1,3)==3
    img1 = rgb2gray(img1);
end

if size(img2,3)==3
    img2 = rgb2gray(img2);
end

% Resize Images
img2 = imresize(img2, size(img1));

% Image Subtraction
result = imabsdiff(img1, img2);

% Display
figure;
subplot(1,3,1), imshow(img1), title('Image 1');
subplot(1,3,2), imshow(img2), title('Image 2');
subplot(1,3,3), imshow(result), title('Subtracted Image');