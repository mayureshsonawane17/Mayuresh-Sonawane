#!/usr/bin/env python3
"""
scripts/generate-split-cutouts.py
High-precision alpha matting for Mayuresh Sonawane & Spider-Man Mask
for the Dual Editorial Pathways ("Build" vs "Explore") section.
"""

import os
import numpy as np
from PIL import Image, ImageFilter, ImageOps, ImageEnhance

DEST_DIR = "public/assets/split"
DOCS_DIR = "docs/hero-verification"
os.makedirs(DEST_DIR, exist_ok=True)
os.makedirs(DOCS_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. SPIDER-MAN MASK PROFILE (Left figure, facing right)
# -------------------------------------------------------------
print("[1/3] Processing Spider-Man Mask Profile Cutout...")
p_mask = "images-for-reference/WhatsApp Image 2026-11-02 at 12.51.40 (1).jpeg"
im_mask = Image.open(p_mask).convert("RGB")
w_m, h_m = im_mask.size
arr_mask = np.array(im_mask, dtype=np.float32)

lum_m = 0.299 * arr_mask[:, :, 0] + 0.587 * arr_mask[:, :, 1] + 0.114 * arr_mask[:, :, 2]
wall_left = arr_mask[:200, :200].mean(axis=(0, 1))

# Mask segment definition:
# Red cowl:
is_red = (arr_mask[:, :, 0] > 105) & (arr_mask[:, :, 0] > arr_mask[:, :, 1] + 16) & (arr_mask[:, :, 0] > arr_mask[:, :, 2] + 16)
# Black eye bezel & shaded areas:
is_bezel = (lum_m < 55) & (np.arange(w_m)[None, :] > 750) & (np.arange(w_m)[None, :] < 1030) & (np.arange(h_m)[:, None] > 260) & (np.arange(h_m)[:, None] < 620)
# White eye mesh:
is_mesh = (lum_m > 80) & (lum_m < 165) & (np.abs(arr_mask[:, :, 0] - arr_mask[:, :, 1]) < 18) & (np.arange(w_m)[None, :] > 820) & (np.arange(w_m)[None, :] < 1010) & (np.arange(h_m)[:, None] > 280) & (np.arange(h_m)[:, None] < 600)

mask_core = (is_red | is_bezel | is_mesh) & (np.arange(h_m)[:, None] >= 125) & (np.arange(h_m)[:, None] <= 812) & (np.arange(w_m)[None, :] >= 645) & (np.arange(w_m)[None, :] <= 1042)

# Fill interior gaps inside the mask boundary
mask_filled = np.zeros_like(mask_core)
for y in range(125, 813):
    idxs = np.where(mask_core[y, :])[0]
    if len(idxs) > 0:
        mask_filled[y, idxs.min():idxs.max()+1] = True

# Soft Gaussian edge for sub-pixel anti-aliasing
alpha_m_pil = Image.fromarray((mask_filled * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=1.3))
alpha_m = np.array(alpha_m_pil, dtype=np.float32) / 255.0

# Crop bounding box with margin
ys_m, xs_m = np.where(alpha_m > 0.05)
crop_m_box = (xs_m.min() - 8, ys_m.min() - 8, xs_m.max() + 8, ys_m.max() + 8)

rgba_m = Image.new("RGBA", (crop_m_box[2] - crop_m_box[0], crop_m_box[3] - crop_m_box[1]))
rgba_m.paste(im_mask.crop(crop_m_box), (0, 0))
rgba_m.putalpha(alpha_m_pil.crop(crop_m_box))

# Save PNG and WebP
rgba_m.save(os.path.join(DEST_DIR, "split-mask-profile.png"), "PNG")
rgba_m.save(os.path.join(DEST_DIR, "split-mask-profile.webp"), "WEBP", quality=95)
print(f"Saved split-mask-profile.png ({rgba_m.size[0]}x{rgba_m.size[1]})")

# -------------------------------------------------------------
# 2. MAYURESH PROFILE (Right figure, facing left)
# -------------------------------------------------------------
print("[2/3] Processing Mayuresh Profile Cutout...")
p_user = "images-for-reference/WhatsApp Image 2026-11-02 at 12.51.41.jpeg"
im_user = Image.open(p_user).convert("RGB")
w_u, h_u = im_user.size
arr_u = np.array(im_user, dtype=np.float32)

lum_u = 0.299 * arr_u[:, :, 0] + 0.587 * arr_u[:, :, 1] + 0.114 * arr_u[:, :, 2]
wall_lum_u = arr_u[:150, :200].mean(axis=(0, 1))

# Subject segmentation criteria:
# Dark hair and hoodie:
is_dark_u = lum_u < 92
# Skin tone:
is_skin_u = (arr_u[:, :, 0] > arr_u[:, :, 1] + 12) & (arr_u[:, :, 0] > arr_u[:, :, 2] + 16) & (lum_u < 178)

# Construct natural horizontal profile contour
person_map_u = np.zeros((h_u, w_u), dtype=bool)
for y in range(h_u):
    # Scan from 260 to 1050
    row_pixels = (is_dark_u[y, :] | is_skin_u[y, :]) & (np.arange(w_u) >= 260) & (np.arange(w_u) <= 1030)
    idxs = np.where(row_pixels)[0]
    if len(idxs) > 0:
        x_start = idxs.min()
        x_end = idxs.max()
        # Enforce right-side facial silhouette boundary:
        # Avoid wall shadow bleed past facial profile
        if y < 220:
            # Top curls: naturally curve up to 1005
            x_end = min(x_end, 1005)
        elif y <= 270:
            # Forehead: ~945
            x_end = min(x_end, 950)
        elif y <= 315:
            # Brow: ~975
            x_end = min(x_end, 978)
        elif y <= 350:
            # Nose: ~992
            x_end = min(x_end, 992)
        elif y <= 390:
            # Philtrum: ~976
            x_end = min(x_end, 978)
        elif y <= 450:
            # Lips: ~976
            x_end = min(x_end, 978)
        elif y <= 515:
            # Chin: ~970
            x_end = min(x_end, 972)
        elif y <= 630:
            # Jawline / throat: ~885
            x_end = min(x_end, 890)
        else:
            # Hoodie chest: natural extension
            x_end = min(x_end, 1030)

        if x_end >= x_start:
            person_map_u[y, x_start:x_end+1] = True

# Soft Gaussian edge for anti-aliasing
alpha_u_pil = Image.fromarray((person_map_u * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=1.3))
alpha_u = np.array(alpha_u_pil, dtype=np.float32) / 255.0

# Crop bounding box with margin
ys_u, xs_u = np.where(alpha_u > 0.05)
crop_u_box = (xs_u.min() - 8, ys_u.min() - 8, xs_u.max() + 8, ys_u.max())

rgba_u = Image.new("RGBA", (crop_u_box[2] - crop_u_box[0], crop_u_box[3] - crop_u_box[1]))
rgba_u.paste(im_user.crop(crop_u_box), (0, 0))
rgba_u.putalpha(alpha_u_pil.crop(crop_u_box))

# Mirror horizontally: Mayuresh faces to the LEFT (inward toward the center and mask!)
flipped_u = ImageOps.mirror(rgba_u)

# Save PNG and WebP
flipped_u.save(os.path.join(DEST_DIR, "split-mayuresh-profile.png"), "PNG")
flipped_u.save(os.path.join(DEST_DIR, "split-mayuresh-profile.webp"), "WEBP", quality=95)
print(f"Saved split-mayuresh-profile.png ({flipped_u.size[0]}x{flipped_u.size[1]})")

# -------------------------------------------------------------
# 3. VERIFICATION COMPOSITE (Over Lando Norris style paper #FAF9F5)
# -------------------------------------------------------------
print("[3/3] Generating Verification Composite on #FAF9F5 paper background...")
canvas_w, canvas_h = 1600, 900
comp = Image.new("RGB", (canvas_w, canvas_h), (250, 249, 245))

# Paste mask on left edge:
h_m_disp = 740
w_m_disp = int(rgba_m.width * (h_m_disp / rgba_m.height))
scaled_m = rgba_m.resize((w_m_disp, h_m_disp), Image.Resampling.LANCZOS)
comp.paste(scaled_m, (-30, canvas_h - h_m_disp - 20), scaled_m)

# Paste Mayuresh on right edge:
h_u_disp = 780
w_u_disp = int(flipped_u.width * (h_u_disp / flipped_u.height))
scaled_u = flipped_u.resize((w_u_disp, h_u_disp), Image.Resampling.LANCZOS)
comp.paste(scaled_u, (canvas_w - w_u_disp + 35, canvas_h - h_u_disp), scaled_u)

comp.save(os.path.join(DOCS_DIR, "split_dual_perfect_preview.jpg"), quality=94)
print("Saved docs/hero-verification/split_dual_perfect_preview.jpg")
print("Done!")
