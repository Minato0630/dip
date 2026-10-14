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

% Structuring Element
se = strel('disk',2);

% Morphological Operations
eroded = imerode(bw,se);
dilated = imdilate(bw,se);
opened = imopen(bw,se);
closed = imclose(bw,se);

% Display
figure;
subplot(2,3,1), imshow(img), title('Original');
subplot(2,3,2), imshow(bw), title('Binary');
subplot(2,3,3), imshow(eroded), title('Erosion');
subplot(2,3,4), imshow(dilated), title('Dilation');
subplot(2,3,5), imshow(opened), title('Opening');
subplot(2,3,6), imshow(closed), title('Closing');
