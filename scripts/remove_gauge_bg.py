"""Remove dark navy background from Grafana gauge images, making it transparent."""

from PIL import Image
from collections import deque
import os

GAUGES_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'gauges')
TOLERANCE = 70

def colour_dist(c1, c2):
    return sum(abs(int(a) - int(b)) for a, b in zip(c1[:3], c2[:3]))

def remove_bg(img):
    w, h = img.size
    pixels = img.load()
    visited = [[False] * h for _ in range(w)]

    # Collect seed candidates from all 4 edges (every 5px)
    edge_seeds = []
    for x in range(0, w, 5):
        edge_seeds += [(x, 0), (x, h - 1)]
    for y in range(0, h, 5):
        edge_seeds += [(0, y), (w - 1, y)]

    # Find a reference background colour (most common dark pixel on edges)
    dark_pixels = []
    for x, y in edge_seeds:
        px = pixels[x, y]
        if px[3] > 0 and (px[0] + px[1] + px[2]) < 240:
            dark_pixels.append(px[:3])
    if not dark_pixels:
        return
    ref = tuple(sum(c[i] for c in dark_pixels) // len(dark_pixels) for i in range(3))

    queue = deque()
    for x, y in edge_seeds:
        if not visited[x][y]:
            px = pixels[x, y]
            if px[3] > 0 and colour_dist(px[:3], ref) <= TOLERANCE:
                visited[x][y] = True
                queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        pixels[x, y] = (0, 0, 0, 0)
        for nx, ny in [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]:
            if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
                npx = pixels[nx, ny]
                if npx[3] > 0 and colour_dist(npx[:3], ref) <= TOLERANCE:
                    visited[nx][ny] = True
                    queue.append((nx, ny))

for fname in sorted(os.listdir(GAUGES_DIR)):
    if not fname.endswith('.png'):
        continue
    path = os.path.join(GAUGES_DIR, fname)
    img = Image.open(path).convert('RGBA')
    remove_bg(img)
    img.save(path)
    print(f'processed {fname}')

print('done')
