% # 2. HISTOGRAM EQUALIZATION
clc;
clear;
close all;

img = imread('lena.png');
ref = imread('penquin.jpg');

% Convert to grayscale
if size(img,3)==3
    img = rgb2gray(img);
end
if size(ref,3)==3
    ref = rgb2gray(ref);
end

% 2.1 Histogram
h = imhist(img);

% 2.2 Histogram Equalization
equal = histeq(img);

% 2.3 Histogram Specification
match = imhistmatch(img,ref);

figure;

subplot(2,3,1), imshow(img), title('Original');
subplot(2,3,2), imhist(img), title('Histogram');
subplot(2,3,3), imshow(equal), title('Equalized');
subplot(2,3,4), imhist(equal), title('Equalized Histogram');
subplot(2,3,5), imshow(match), title('Matched');
subplot(2,3,6), imhist(match), title('Matched Histogram');
