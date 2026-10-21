% # 9. IMAGE SEGMENTATION
clc;
clear;
close all;

% Read sample image
img = imread('lena.jpg');

% Convert to grayscale
if size(img,3) == 3
    grayImage = rgb2gray(img);
else
    grayImage = img;
end

% Display original image
figure;
subplot(2,2,1);
imshow(img);
title('Original Image');

% Thresholding
level = graythresh(grayImage);
binaryImage = imbinarize(grayImage, level);
subplot(2,2,2);
imshow(binaryImage);
title('Thresholding');

% Edge Detection using Canny
edges = edge(grayImage, 'canny');
subplot(2,2,3);
imshow(edges);
title('Edge Detection');

% K-means Clustering
numClusters = 3;
[clusterIdx, ~] = imsegkmeans(grayImage, numClusters);
clusteredImage = label2rgb(clusterIdx);
subplot(2,2,4);
imshow(clusteredImage);
title('K-means Clustering');

% Watershed Segmentation
gradientImage = imgradient(grayImage);
markerImage = imextendedmin(gradientImage, 0.1);
watershedImage = watershed(gradientImage);
watershedImage(gradientImage == 0) = 0;
watershedRGB = label2rgb(watershedImage, 'jet', 'k', 'shuffle');

figure;
imshow(watershedRGB);
title('Watershed Segmentation');
