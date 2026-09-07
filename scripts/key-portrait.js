// Turns the studio JPEG (flat orange background, wordmark baked in) into the
// transparent hero cut-out.  Run:  node scripts/key-portrait.js
const sharp = require("sharp");
const SRC = "./public/images/herosectionperson.png";
const OUT = "./public/images/hero-portrait.png";

const ss = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// sharp promotes a single-channel raw image to 3 channels on output, so the
// result has to be de-interleaved or every index below reads the wrong pixel.
const blurAlpha = async (buf, w, h, sigma) => {
  const { data, info } = await sharp(Buffer.from(buf), {
    raw: { width: w, height: h, channels: 1 },
  })
    .blur(sigma)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const c = info.channels;
  if (c === 1) return data;
  const out = new Uint8Array(w * h);
  for (let i = 0; i < out.length; i++) out[i] = data[i * c];
  return out;
};

(async () => {
  const src = sharp(SRC);
  const { width: w, height: h } = await src.metadata();
  const n = w * h;

  const sharpRgb = await sharp(SRC).removeAlpha().raw().toBuffer();
  // The source is 4:2:0 JPEG, so its chroma is stored at half resolution and
  // decodes in 8px blocks. Keying off it directly stair-steps every hair edge,
  // so the alpha is derived from a blurred copy and the colour from the sharp one.
  const softRgb = await sharp(SRC).removeAlpha().blur(1.1).raw().toBuffer();

  const raw = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const o = i * 3;
    const r = softRgb[o], g = softRgb[o + 1], b = softRgb[o + 2];
    const rr = Math.max(r, 1);
    const a = Math.max(ss(0.44, 0.62, g / rr), ss(0.22, 0.42, b / rr), ss(150, 95, r));
    raw[i] = Math.round(a * 255);
  }

  // Soften, then re-sharpen: the blur removes block noise, the contrast curve
  // gives the edge back its bite without giving the blocks back with it.
  const soft = await blurAlpha(raw, w, h, 0.9);
  const alpha = new Float32Array(n);
  for (let i = 0; i < n; i++) alpha[i] = ss(0.12, 0.55, soft[i] / 255);

  // Flood the background inward from the border so interior soft spots (the lit
  // ear, jaw and neck) are unreachable and can never be keyed out.
  const bg = new Uint8Array(n);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const i = stack.pop();
    if (bg[i] || alpha[i] > 0.5) continue;
    bg[i] = 1;
    const x = i % w, y = (i / w) | 0;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - w);
    if (y < h - 1) stack.push(i + w);
  }

  // The flood also reached the wordmark ghosted into the original photo. Level
  // and frequency both fail to separate that residue from a fine hair strand,
  // but attachment does: every real strand is connected to the subject, and the
  // residue is not. Take the largest connected component of the solid core and
  // keep only what sits on or near it.
  const CORE = 0.28;
  const core = new Uint8Array(n);
  for (let i = 0; i < n; i++) core[i] = alpha[i] > CORE ? 1 : 0;

  const label = new Int32Array(n).fill(-1);
  let best = -1, bestSize = 0;
  for (let seed = 0; seed < n; seed++) {
    if (!core[seed] || label[seed] !== -1) continue;
    const id = seed;
    let size = 0;
    const st = [seed];
    label[seed] = id;
    while (st.length) {
      const i = st.pop();
      size++;
      const x = i % w, y = (i / w) | 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const j = ny * w + nx;
          if (core[j] && label[j] === -1) { label[j] = id; st.push(j); }
        }
      }
    }
    if (size > bestSize) { bestSize = size; best = id; }
  }

  const keepCore = new Uint8Array(n);
  for (let i = 0; i < n; i++) keepCore[i] = label[i] === best ? 255 : 0;

  // A bright rim lit to the same orange as the background — the top of the ear —
  // punches a hole clean through the subject. Anything enclosed by the core and
  // unreachable from the border is such a hole, and is solid by definition.
  const outside = new Uint8Array(n);
  const ost = [];
  for (let x = 0; x < w; x++) ost.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) ost.push(y * w, y * w + w - 1);
  while (ost.length) {
    const i = ost.pop();
    if (outside[i] || keepCore[i]) continue;
    outside[i] = 1;
    const x = i % w, y = (i / w) | 0;
    if (x > 0) ost.push(i - 1);
    if (x < w - 1) ost.push(i + 1);
    if (y > 0) ost.push(i - w);
    if (y < h - 1) ost.push(i + w);
  }
  const hole = new Uint8Array(n);
  for (let i = 0; i < n; i++) if (!keepCore[i] && !outside[i]) { hole[i] = 1; keepCore[i] = 255; }

  // Dilate the kept core so the soft edge around every strand comes with it.
  const grown = await blurAlpha(keepCore, w, h, 3);

  const cleaned = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    if (hole[i]) { cleaned[i] = 255; continue; }
    const near = grown[i] > 12;
    cleaned[i] = near ? Math.round(alpha[i] * 255) : 0;
  }

  // One last light blur so the crush does not leave its own hard step.
  const finalA = await blurAlpha(cleaned, w, h, 0.5);

  const BG = [228, 70, 24];
  const out = Buffer.alloc(n * 4);
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let i = 0; i < n; i++) {
    const o = i * 4, s = i * 3;
    let a = finalA[i] / 255;
    if (a < 0.02) a = 0;
    let r = sharpRgb[s], g = sharpRgb[s + 1], b = sharpRgb[s + 2];
    // Unpremultiply the orange the background contributed, which is what leaves
    // a dark fringe on semi-transparent hair if you skip it.
    if (a > 0.06 && a < 0.995) {
      const k = 1 - a;
      r = (r - BG[0] * k) / a;
      g = (g - BG[1] * k) / a;
      b = (b - BG[2] * k) / a;
    }
    out[o] = Math.min(255, Math.max(0, Math.round(r)));
    out[o + 1] = Math.min(255, Math.max(0, Math.round(g)));
    out[o + 2] = Math.min(255, Math.max(0, Math.round(b)));
    out[o + 3] = Math.round(a * 255);
    if (a > 0.03) {
      const x = i % w, y = (i / w) | 0;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }

  console.log("bbox", x0, y0, x1, y1, "of", w, h);
  const cw = x1 - x0 + 1, chh = y1 - y0 + 1;
  const r = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: x0, top: y0, width: cw, height: chh })
    .resize({ width: cw * 2, kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toFile(OUT);
  console.log("wrote", r.width + "x" + r.height);
})();
