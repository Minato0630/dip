% # 1. IMPLEMENT IMAGE ENHANCEMENT TECHNIQUE
clc;
clear;
close all;

img = imread('lena.jpg');

figure;

% 1.1 Smoothing
smooth = imfilter(img,fspecial('average',[3 3]));

% 1.2 Sharpening
sharp = imsharpen(img);

% 1.3.1 Contrast Stretching
contrast = imadjust(img,stretchlim(img),[]);

% 1.3.2 Gamma Correction
gamma = im2double(img).^0.7;

% 1.3.3 Sigmoidal Function
x = im2double(img);
sigmoid = 1./(1+exp(5*(0.5-x)));

% 1.4 Basic Image Operations (Spatial & Intensity Resolution)
res_128 = imresize(img, [128 128]);
int_4bit = floor(double(img)/16)*16;

subplot(2,3,1), imshow(img), title('Original');
subplot(2,3,2), imshow(smooth), title('Smoothing');
subplot(2,3,3), imshow(sharp), title('Sharpening');
subplot(2,3,4), imshow(contrast), title('Contrast');
subplot(2,3,5), imshow(gamma), title('Gamma');
subplot(2,3,6), imshow(sigmoid), title('Sigmoid');
