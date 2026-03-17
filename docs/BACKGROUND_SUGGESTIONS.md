# Background ideas for the portfolio

The current desktop uses a **wallpaper-style** background: soft dark gradient (slate/blue‑gray), subtle dot texture, and a very gentle animated glow. Here are other directions you could try.

---

## 1. **Blurred abstract image** (Jackie Zhang–style)
- Use a large photo or abstract art as a full-bleed layer.
- Apply strong blur (e.g. `filter: blur(60px)`) and low opacity (e.g. 15–25%).
- Keeps the look soft and non-distracting while adding depth.

## 2. **Mesh / conic gradient**
- Use CSS `conic-gradient` or multiple overlapping `radial-gradient` layers with different hues (e.g. blue, purple, dark gray).
- Optionally animate hue or position slowly for a premium “mesh” feel.

## 3. **Geometric pattern**
- SVG or CSS repeating pattern: thin lines, triangles, or hexagons.
- Keep contrast low (e.g. white at 3–5% opacity) so it stays in the background.

## 4. **Static photo wallpaper**
- One full-bleed image (e.g. desk, code, or abstract) with `object-fit: cover` and dark overlay for readability.
- Ensures text and windows stay legible.

## 5. **Noise / film grain**
- Add a subtle noise texture (e.g. small PNG or SVG filter) over the gradient for a tactile, non-flat look.

---

To change the background, edit `frontend/src/components/InteractableBackground.tsx` (and optionally add new assets in `frontend/public/`).
