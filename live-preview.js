// live-preview.js - Interactive MATLAB Simulation for Programs 5, 6, 7, 8
document.addEventListener('DOMContentLoaded', () => {
    // Inject Modal HTML if not present
    let modal = document.getElementById('live-modal');
    if (!modal) {
        const modalHTML = `
            <div id="live-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(10, 14, 23, 0.88); backdrop-filter:blur(6px); z-index:9999; justify-content:center; align-items:center; opacity:0; transition:opacity 0.25s ease;">
                <div style="background:#1e2433; padding:2rem; border-radius:12px; width:92%; max-width:960px; max-height:90vh; overflow-y:auto; border:1px solid #333d52; box-shadow:0 25px 60px rgba(0,0,0,0.65);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid #333d52; padding-bottom:1rem;">
                        <div style="display:flex; align-items:center; gap:0.75rem;">
                            <span style="background:#d9531e; color:#fff; font-size:0.75rem; font-weight:700; padding:3px 8px; border-radius:4px; letter-spacing:0.5px;">MATLAB FIGURE</span>
                            <h2 id="modal-title" style="color:#f1f5f9; font-size:1.35rem; margin:0; font-family:'Inter', sans-serif;">Figure 1: Simulation Output</h2>
                        </div>
                        <button id="close-modal" style="background:#2a3245; border:1px solid #3b465e; color:#cbd5e1; width:34px; height:34px; border-radius:6px; font-size:1.25rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:0.2s;" title="Close Window">&times;</button>
                    </div>
                    <div id="modal-content" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1.25rem; align-items:start;">
                        <!-- Canvas outputs injected here -->
                    </div>
                    <div id="modal-footer" style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid #333d52; font-family:'Fira Code', monospace; font-size:0.85rem; color:#94a3b8;">
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('live-modal');
    }

    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalFooter = document.getElementById('modal-footer');
    const closeModal = document.getElementById('close-modal');

    closeModal.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => { modal.style.display = 'none'; }, 250);
    });

    // Helper to load image safely
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Failed to load image: ' + src));
            img.src = src;
        });
    };

    // Helper to convert imageData to grayscale array
    const toGrayArray = (imgData) => {
        const gray = new Float32Array(imgData.width * imgData.height);
        for (let i = 0, j = 0; i < imgData.data.length; i += 4, j++) {
            // standard luminance rgb2gray weights
            gray[j] = 0.2989 * imgData.data[i] + 0.5870 * imgData.data[i + 1] + 0.1140 * imgData.data[i + 2];
        }
        return gray;
    };

    // Helper to write grayscale array into canvas
    const writeGrayToCanvas = (ctx, gray, width, height) => {
        const out = ctx.createImageData(width, height);
        for (let i = 0, j = 0; j < gray.length; i += 4, j++) {
            const v = Math.min(255, Math.max(0, Math.round(gray[j])));
            out.data[i] = v;
            out.data[i + 1] = v;
            out.data[i + 2] = v;
            out.data[i + 3] = 255;
        }
        ctx.putImageData(out, 0, 0);
    };

    // Helper to add canvas card to modal
    const addCanvasCard = (title, width, height, renderFn) => {
        const card = document.createElement('div');
        card.style.background = '#151924';
        card.style.border = '1px solid #2e374a';
        card.style.borderRadius = '8px';
        card.style.padding = '0.85rem';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'center';

        const titleEl = document.createElement('div');
        titleEl.innerText = title;
        titleEl.style.fontSize = '0.88rem';
        titleEl.style.fontWeight = '600';
        titleEl.style.color = '#38bdf8';
        titleEl.style.marginBottom = '0.65rem';
        titleEl.style.fontFamily = "'Fira Code', monospace";
        card.appendChild(titleEl);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        canvas.style.borderRadius = '4px';
        canvas.style.border = '1px solid #222938';
        canvas.style.boxShadow = '0 4px 10px rgba(0,0,0,0.4)';
        card.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (renderFn) {
            renderFn(ctx, canvas);
        }
        modalContent.appendChild(card);
        return { card, canvas, ctx };
    };

    // Master Live Run Handler
    const runLive = async (programId) => {
        modalContent.innerHTML = '<div style="color:#cbd5e1; text-align:center; grid-column:1 / -1; padding:2rem; font-family:\'Fira Code\', monospace;">Executing in MATLAB virtual engine...</div>';
        modalFooter.innerHTML = '';
        modal.style.display = 'flex';
        setTimeout(() => modal.style.opacity = '1', 10);

        // Standard high-reliability Lena test image
        const lenaSrc = 'https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png';
        const img2Src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=80'; // art pattern for subtraction

        const SIZE = 240;

        try {
            const img = await loadImage(lenaSrc);

            // Offscreen canvas for raw data
            const off = document.createElement('canvas');
            off.width = SIZE;
            off.height = SIZE;
            const offCtx = off.getContext('2d');
            offCtx.drawImage(img, 0, 0, SIZE, SIZE);
            const rawData = offCtx.getImageData(0, 0, SIZE, SIZE);
            const gray = toGrayArray(rawData);

            modalContent.innerHTML = '';

            // ================= PROGRAM 5: EDGE DETECTION =================
            if (programId === '5') {
                modalTitle.innerText = "Figure 1: Program 5 – Edge Detection (Sobel, Prewitt, Roberts, Canny)";
                modalFooter.innerHTML = `<span style="color:#4ade80;">&gt;&gt;</span> edge(img, 'sobel'); edge(img, 'prewitt'); edge(img, 'roberts'); edge(img, 'canny');<br><span style="color:#94a3b8;">Output: 5 Subplots rendered successfully.</span>`;

                // 1. Original
                addCanvasCard("subplot(2,3,1): Original", SIZE, SIZE, (ctx) => {
                    writeGrayToCanvas(ctx, gray, SIZE, SIZE);
                });

                // 2. Sobel Edge
                addCanvasCard("subplot(2,3,2): Sobel", SIZE, SIZE, (ctx) => {
                    const out = new Float32Array(SIZE * SIZE);
                    for (let y = 1; y < SIZE - 1; y++) {
                        for (let x = 1; x < SIZE - 1; x++) {
                            const gx = -gray[(y - 1) * SIZE + (x - 1)] + gray[(y - 1) * SIZE + (x + 1)]
                                     - 2 * gray[y * SIZE + (x - 1)]     + 2 * gray[y * SIZE + (x + 1)]
                                     - gray[(y + 1) * SIZE + (x - 1)] + gray[(y + 1) * SIZE + (x + 1)];
                            const gy = -gray[(y - 1) * SIZE + (x - 1)] - 2 * gray[(y - 1) * SIZE + x] - gray[(y - 1) * SIZE + (x + 1)]
                                     + gray[(y + 1) * SIZE + (x - 1)] + 2 * gray[(y + 1) * SIZE + x] + gray[(y + 1) * SIZE + (x + 1)];
                            const mag = Math.sqrt(gx * gx + gy * gy);
                            out[y * SIZE + x] = mag > 65 ? 255 : 0; // binary edge
                        }
                    }
                    writeGrayToCanvas(ctx, out, SIZE, SIZE);
                });

                // 3. Prewitt Edge
                addCanvasCard("subplot(2,3,3): Prewitt", SIZE, SIZE, (ctx) => {
                    const out = new Float32Array(SIZE * SIZE);
                    for (let y = 1; y < SIZE - 1; y++) {
                        for (let x = 1; x < SIZE - 1; x++) {
                            const gx = -gray[(y - 1) * SIZE + (x - 1)] + gray[(y - 1) * SIZE + (x + 1)]
                                     - gray[y * SIZE + (x - 1)]       + gray[y * SIZE + (x + 1)]
                                     - gray[(y + 1) * SIZE + (x - 1)] + gray[(y + 1) * SIZE + (x + 1)];
                            const gy = -gray[(y - 1) * SIZE + (x - 1)] - gray[(y - 1) * SIZE + x] - gray[(y - 1) * SIZE + (x + 1)]
                                     + gray[(y + 1) * SIZE + (x - 1)] + gray[(y + 1) * SIZE + x] + gray[(y + 1) * SIZE + (x + 1)];
                            const mag = Math.sqrt(gx * gx + gy * gy);
                            out[y * SIZE + x] = mag > 55 ? 255 : 0;
                        }
                    }
                    writeGrayToCanvas(ctx, out, SIZE, SIZE);
                });

                // 4. Roberts Edge
                addCanvasCard("subplot(2,3,4): Roberts", SIZE, SIZE, (ctx) => {
                    const out = new Float32Array(SIZE * SIZE);
                    for (let y = 0; y < SIZE - 1; y++) {
                        for (let x = 0; x < SIZE - 1; x++) {
                            const gx = gray[y * SIZE + x] - gray[(y + 1) * SIZE + (x + 1)];
                            const gy = gray[y * SIZE + (x + 1)] - gray[(y + 1) * SIZE + x];
                            const mag = Math.sqrt(gx * gx + gy * gy);
                            out[y * SIZE + x] = mag > 30 ? 255 : 0;
                        }
                    }
                    writeGrayToCanvas(ctx, out, SIZE, SIZE);
                });

                // 5. Canny Edge
                addCanvasCard("subplot(2,3,5): Canny", SIZE, SIZE, (ctx) => {
                    // Smooth with 3x3 gaussian then sobel threshold
                    const smoothed = new Float32Array(SIZE * SIZE);
                    for (let y = 1; y < SIZE - 1; y++) {
                        for (let x = 1; x < SIZE - 1; x++) {
                            smoothed[y * SIZE + x] = (
                                gray[(y - 1) * SIZE + (x - 1)] + 2 * gray[(y - 1) * SIZE + x] + gray[(y - 1) * SIZE + (x + 1)] +
                                2 * gray[y * SIZE + (x - 1)] + 4 * gray[y * SIZE + x] + 2 * gray[y * SIZE + (x + 1)] +
                                gray[(y + 1) * SIZE + (x - 1)] + 2 * gray[(y + 1) * SIZE + x] + gray[(y + 1) * SIZE + (x + 1)]
                            ) / 16;
                        }
                    }
                    const out = new Float32Array(SIZE * SIZE);
                    for (let y = 1; y < SIZE - 1; y++) {
                        for (let x = 1; x < SIZE - 1; x++) {
                            const gx = -smoothed[(y - 1) * SIZE + (x - 1)] + smoothed[(y - 1) * SIZE + (x + 1)]
                                     - 2 * smoothed[y * SIZE + (x - 1)]     + 2 * smoothed[y * SIZE + (x + 1)]
                                     - smoothed[(y + 1) * SIZE + (x - 1)] + smoothed[(y + 1) * SIZE + (x + 1)];
                            const gy = -smoothed[(y - 1) * SIZE + (x - 1)] - 2 * smoothed[(y - 1) * SIZE + x] - smoothed[(y - 1) * SIZE + (x + 1)]
                                     + smoothed[(y + 1) * SIZE + (x - 1)] + 2 * smoothed[(y + 1) * SIZE + x] + smoothed[(y + 1) * SIZE + (x + 1)];
                            const mag = Math.sqrt(gx * gx + gy * gy);
                            out[y * SIZE + x] = mag > 45 ? 255 : 0;
                        }
                    }
                    writeGrayToCanvas(ctx, out, SIZE, SIZE);
                });
            }

            // ================= PROGRAM 6: IMAGE COMPRESSION =================
            else if (programId === '6') {
                modalTitle.innerText = "Figure 1: Program 6 – Image Compression (Quality: 30)";

                // Original Grayscale Canvas
                const origCanvas = document.createElement('canvas');
                origCanvas.width = SIZE;
                origCanvas.height = SIZE;
                const oCtx = origCanvas.getContext('2d');
                writeGrayToCanvas(oCtx, gray, SIZE, SIZE);

                // Compressed data via JPEG quality = 0.30
                const compDataUrl = origCanvas.toDataURL('image/jpeg', 0.30);
                const compImg = await loadImage(compDataUrl);

                // Approximate sizes
                const origBytes = Math.round(SIZE * SIZE); // Raw 8-bit grayscale bytes
                // Base64 to byte approximation
                const head = 'data:image/jpeg;base64,';
                const compBytes = Math.round((compDataUrl.length - head.length) * 3 / 4);
                const ratio = (origBytes / compBytes).toFixed(2);

                addCanvasCard("subplot(1,2,1): Original (Raw)", SIZE, SIZE, (ctx) => {
                    ctx.drawImage(origCanvas, 0, 0);
                });

                addCanvasCard(`subplot(1,2,2): Compressed (Q=30)`, SIZE, SIZE, (ctx) => {
                    ctx.drawImage(compImg, 0, 0);
                });

                modalFooter.innerHTML = `
                    <div style="background:#131722; padding:1rem; border-radius:6px; border-left:3px solid #38bdf8;">
                        <span style="color:#4ade80;">&gt;&gt;</span> o = dir('lena.png'); c = dir('compressed.jpg');<br>
                        <span style="color:#4ade80;">&gt;&gt;</span> ratio = o.bytes / c.bytes;<br>
                        <span style="color:#f1f5f9; font-weight:700;">Compression Ratio = ${ratio}</span><br>
                        <span style="color:#94a3b8; font-size:0.8rem;">(Original File: ${(origBytes/1024).toFixed(1)} KB | Compressed File: ${(compBytes/1024).toFixed(1)} KB)</span>
                    </div>
                `;
            }

            // ================= PROGRAM 7: IMAGE SUBTRACTION =================
            else if (programId === '7') {
                modalTitle.innerText = "Figure 1: Program 7 – Image Subtraction (imabsdiff)";

                // Generate synthetic Image 2 (shifted/contrasted pattern) to simulate image.JFIF
                const gray2 = new Float32Array(SIZE * SIZE);
                for (let y = 0; y < SIZE; y++) {
                    for (let x = 0; x < SIZE; x++) {
                        // Blend radial vignette + inverted center to represent a distinct test pattern
                        const dx = x - SIZE / 2;
                        const dy = y - SIZE / 2;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const mask = Math.max(0, 1 - dist / (SIZE / 1.4));
                        gray2[y * SIZE + x] = Math.min(255, Math.abs(255 - gray[y * SIZE + x]) * 0.7 + mask * 80);
                    }
                }

                // Subtracted Image: imabsdiff(img1, img2)
                const diff = new Float32Array(SIZE * SIZE);
                for (let i = 0; i < diff.length; i++) {
                    diff[i] = Math.abs(gray[i] - gray2[i]);
                }

                addCanvasCard("subplot(1,3,1): Image 1 (LENA)", SIZE, SIZE, (ctx) => {
                    writeGrayToCanvas(ctx, gray, SIZE, SIZE);
                });

                addCanvasCard("subplot(1,3,2): Image 2 (image.JFIF)", SIZE, SIZE, (ctx) => {
                    writeGrayToCanvas(ctx, gray2, SIZE, SIZE);
                });

                addCanvasCard("subplot(1,3,3): Subtracted Image", SIZE, SIZE, (ctx) => {
                    writeGrayToCanvas(ctx, diff, SIZE, SIZE);
                });

                modalFooter.innerHTML = `<span style="color:#4ade80;">&gt;&gt;</span> result = imabsdiff(img1, img2);<br><span style="color:#94a3b8;">Output: Pixel-by-pixel absolute difference successfully computed.</span>`;
            }

            // ================= PROGRAM 8: BOUNDARY EXTRACTION =================
            else if (programId === '8') {
                modalTitle.innerText = "Figure 1: Program 8 – Morphological Boundary Extraction (bw - eroded)";

                // 1. Binary Conversion: imbinarize(img) with threshold 128
                const bw = new Uint8Array(SIZE * SIZE);
                for (let i = 0; i < gray.length; i++) {
                    bw[i] = gray[i] > 115 ? 255 : 0;
                }

                // 2. Erosion with disk(1) structuring element (3x3 cross / disk)
                const eroded = new Uint8Array(SIZE * SIZE);
                for (let y = 1; y < SIZE - 1; y++) {
                    for (let x = 1; x < SIZE - 1; x++) {
                        // disk(1) checks center and 4-neighbors
                        if (
                            bw[y * SIZE + x] === 255 &&
                            bw[(y - 1) * SIZE + x] === 255 &&
                            bw[(y + 1) * SIZE + x] === 255 &&
                            bw[y * SIZE + (x - 1)] === 255 &&
                            bw[y * SIZE + (x + 1)] === 255
                        ) {
                            eroded[y * SIZE + x] = 255;
                        } else {
                            eroded[y * SIZE + x] = 0;
                        }
                    }
                }

                // 3. Boundary: bw - eroded
                const boundary = new Float32Array(SIZE * SIZE);
                for (let i = 0; i < bw.length; i++) {
                    boundary[i] = bw[i] - eroded[i];
                }

                addCanvasCard("subplot(1,3,1): Original", SIZE, SIZE, (ctx) => {
                    writeGrayToCanvas(ctx, gray, SIZE, SIZE);
                });

                addCanvasCard("subplot(1,3,2): Binary (imbinarize)", SIZE, SIZE, (ctx) => {
                    writeGrayToCanvas(ctx, bw, SIZE, SIZE);
                });

                addCanvasCard("subplot(1,3,3): Boundary (bw - eroded)", SIZE, SIZE, (ctx) => {
                    writeGrayToCanvas(ctx, boundary, SIZE, SIZE);
                });

                modalFooter.innerHTML = `<span style="color:#4ade80;">&gt;&gt;</span> se = strel('disk', 1); eroded = imerode(bw, se); boundary = bw - eroded;<br><span style="color:#94a3b8;">Output: 1-pixel outer morphological boundary extracted cleanly.</span>`;
            }

        } catch (e) {
            console.error(e);
            modalContent.innerHTML = `<div style="color:#ef4444; grid-column:1 / -1; text-align:center; padding:2rem; font-family:'Fira Code', monospace;">Execution error: ${e.message}. Please check internet connection for test image.</div>`;
        }
    };

    // Attach to all live preview buttons
    document.querySelectorAll('.run-live-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const pId = btn.getAttribute('data-program');
            runLive(pId);
        });
    });
});
