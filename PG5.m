% # 5. EDGE DETECTION USING OPERATORS (ROBERTS,PREWITTS AND SOBELS OPERATORS)
clc;
clear;
close all;

% Read Image
img = imread('LENA.JFIF');

% Convert to Gray
if size(img,3)==3
    img = rgb2gray(img);
end

% Edge Detection
sobel = edge(img,'sobel');
prewitt = edge(img,'prewitt');
roberts = edge(img,'roberts');
canny = edge(img,'canny');

% Display
figure;
subplot(2,3,1), imshow(img), title('Original');
subplot(2,3,2), imshow(sobel), title('Sobel');
subplot(2,3,3), imshow(prewitt), title('Prewitt');
subplot(2,3,4), imshow(roberts), title('Roberts');
subplot(2,3,5), imshow(canny), title('Canny');