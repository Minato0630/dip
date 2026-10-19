% # 4. IMPLEMENT IMAGE FILTERING
clc;
clear;
close all;

% Read RGB image
img = imread('lena.png');

% Low-pass
low = imfilter(img,fspecial('average',[3 3]));

% High-pass
high = imfilter(img,fspecial('sobel'));

% Median filter
med(:,:,1) = medfilt2(img(:,:,1));
med(:,:,2) = medfilt2(img(:,:,2));
med(:,:,3) = medfilt2(img(:,:,3));

% Sharpen
sharp = imsharpen(img);

% Gaussian
gauss = imgaussfilt(img,2);

% Display
subplot(2,3,1), imshow(img), title('Original');
subplot(2,3,2), imshow(low), title('Low-pass');
subplot(2,3,3), imshow(high,[]), title('High-pass');
subplot(2,3,4), imshow(med), title('Median');
subplot(2,3,5), imshow(sharp), title('Sharpen');
subplot(2,3,6), imshow(gauss), title('Gaussian');
