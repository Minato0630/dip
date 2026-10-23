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
if exist('imbinarize', 'file')
    binaryImage = imbinarize(grayImage, level);
else
    binaryImage = im2bw(grayImage, level);
end
subplot(2,2,2);
imshow(binaryImage);
title('Thresholding');

% Edge Detection using Canny
edges = edge(grayImage, 'canny');
subplot(2,2,3);
imshow(edges);
title('Edge Detection');

% K-means Clustering (Compatible with MATLAB 2018 and all versions)
numClusters = 3;
if exist('imsegkmeans', 'file')
    clusterIdx = imsegkmeans(grayImage, numClusters);
elseif exist('kmeans', 'file')
    data = double(grayImage(:));
    [idx, ~] = kmeans(data, numClusters, 'MaxIter', 100);
    clusterIdx = reshape(idx, size(grayImage));
else
    data = double(grayImage(:));
    centers = linspace(min(data), max(data), numClusters)';
    for iter = 1:15
        [~, idx] = min(abs(data - centers'), [], 2);
        for c = 1:numClusters
            if any(idx == c), centers(c) = mean(data(idx == c)); end
        end
    end
    clusterIdx = reshape(idx, size(grayImage));
end
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
