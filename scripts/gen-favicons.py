"""
Generate all favicon/app icon sizes from the brand avatar mascot image.
Outputs to public/ and src/app/ for Next.js App Router icon convention.
"""
from PIL import Image
import os

SRC = r"C:\Users\Admin\.gemini\antigravity\brain\5a91676e-ebbd-4c53-8af6-9a04e1fb79f4\.user_uploaded\media_1794322351490_0a33cb67.jpg"
PUBLIC = r"d:\Nguyen wb\public"
APP    = r"d:\Nguyen wb\src\app"

img = Image.open(SRC).convert("RGBA")
W, H = img.size

# --- Crop to tight circle content (remove black corners) ---
# Source is already a circular image on black BG → just use full square

# Generate PNG sizes
sizes = {
    "favicon-16x16.png":    16,
    "favicon-32x32.png":    32,
    "favicon-96x96.png":    96,
    "favicon-192x192.png":  192,
    "favicon-512x512.png":  512,
    "apple-touch-icon.png": 180,
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
    "mstile-150x150.png":   150,
    "icon.png":             512,  # Next.js App Router
    "apple-icon.png":       180,  # Next.js App Router
}

for fname, size in sizes.items():
    resized = img.resize((size, size), Image.LANCZOS)
    dest_dir = APP if fname in ("icon.png", "apple-icon.png") else PUBLIC
    out_path = os.path.join(dest_dir, fname)
    resized.save(out_path, "PNG", optimize=True)
    print(f"  ✓ {out_path}  ({size}x{size})")

# Generate favicon.ico (multi-size)
ico_sizes = [(16,16),(32,32),(48,48),(64,64)]
ico_frames = [img.resize(s, Image.LANCZOS).convert("RGBA") for s in ico_sizes]
ico_path = os.path.join(PUBLIC, "favicon.ico")
ico_frames[0].save(ico_path, format="ICO", sizes=ico_sizes, append_images=ico_frames[1:])
print(f"  ✓ {ico_path}  (multi-size ICO)")

print("\n✅ All favicons generated successfully!")

