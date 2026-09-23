clc;
clear;
close all;

% Read Image
img = imread('LENA.JFIF');

% Convert to Gray
if size(img,3)==3
    img = rgb2gray(img);
end

% Compress and Save
imwrite(img,'compressed.jpg','Quality',30);

% Read Compressed Image
comp = imread('compressed.jpg');

% Display
figure;
subplot(1,2,1), imshow(img), title('Original');
subplot(1,2,2), imshow(comp), title('Compressed');

% Compression Ratio
o = dir('lena.png');
c = dir('compressed.jpg');
ratio = o.bytes / c.bytes;

fprintf('Compression Ratio = %.2f\n', ratio);