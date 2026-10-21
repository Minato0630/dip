% # 6. IMPLEMENT IMAGE COMPRESSION
clc;
clear;
close all;

% Read Image
img = imread('lena.jpg');

% Convert to Gray
if size(img,3)==3
    img = rgb2gray(img);
end

% 6.1 Block Truncation Coding (BTC)
k = 4;
x1 = double(img);
[n, m] = size(x1);
out_btc = zeros(n, m);
for i = 1:k:n
    for j = 1:k:m
        blk = x1(i:min(i+k-1,n), j:min(j+k-1,m));
        mn = mean(blk(:));
        bm = blk >= mn;
        hi = mean(blk(bm)); if isnan(hi), hi = mn; end
        lo = mean(blk(~bm)); if isnan(lo), lo = mn; end
        out_btc(i:min(i+k-1,n), j:min(j+k-1,m)) = bm*hi + (~bm)*lo;
    end
end

% 6.2 Bitplane Coding
s = zeros(size(img,1), size(img,2), 8);
for b = 1:8
    s(:,:,b) = bitget(img, b);
end
rec_bitplane = s(:,:,1) + s(:,:,2)*2 + s(:,:,3)*4 + s(:,:,4)*8 + s(:,:,5)*16 + s(:,:,6)*32 + s(:,:,7)*64 + s(:,:,8)*128;

% 6.3 JPEG Quality Compression & Ratio
imwrite(img,'compressed.jpg','Quality',30);
comp = imread('compressed.jpg');
o = dir('lena.jpg');
c = dir('compressed.jpg');
ratio = o.bytes / c.bytes;
fprintf('Compression Ratio = %.2f\n', ratio);

% Display
figure;
subplot(2,2,1), imshow(img), title('Original');
subplot(2,2,2), imshow(uint8(out_btc)), title('BTC Decoded');
subplot(2,2,3), imshow(uint8(rec_bitplane)), title('Bitplane Recovered');
subplot(2,2,4), imshow(comp), title('JPEG Compressed (Q=30)');
