% # 3. IMAGE RESTORATION
clc;
clear;
close all;

% Read image
img = im2double(imread('penquin.jpg'));

% Motion blur
psf = fspecial('motion',20,45);
blur = imfilter(img,psf,'conv','circular');

% Add Gaussian noise
noise = imnoise(blur,'gaussian',0,0.001);

% Wiener restoration
nsr = 0.001/var(img(:));
restored = deconvwnr(noise,psf,nsr);

% Display
subplot(1,3,1), imshow(img), title('Original');
subplot(1,3,2), imshow(noise), title('Degraded + Noise');
subplot(1,3,3), imshow(restored), title('Restored');
