from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance, ImageFilter

# 自动定位 clipboard 文件，避免中文用户名路径导致的编码问题
root = Path('C:/Users')
refs = [
    'clipboard-1781538987442.png',
    'clipboard-1781539031728.png',
]
output_dir = Path('D:/桌面/matchmate/output')
output_dir.mkdir(parents=True, exist_ok=True)

def cartoonize(im: Image.Image) -> Image.Image:
    # 缩放到统一比例，便于后续拼图使用
    im = ImageOps.fit(im, (1024, 1024), method=Image.Resampling.LANCZOS)

    # 颜色平滑+量化，得到卡通底色
    smooth = im.filter(ImageFilter.SMOOTH_MORE)
    base = smooth.quantize(colors=14, method=2).convert('RGB')

    # 边缘高亮并与底色混合
    edge = im.convert('L').filter(ImageFilter.FIND_EDGES)
    edge = edge.point(lambda v: 255 if v > 45 else 0).convert('RGB')

    out = Image.blend(base, edge, alpha=0.22)
    out = ImageEnhance.Contrast(out).enhance(1.18)
    out = ImageEnhance.Sharpness(out).enhance(1.08)
    return out

# 先在所有用户目录下查找 .aoe-clipboard 下的目标文件
for idx, ref_name in enumerate(refs, start=1):
    found = None
    for u in root.iterdir():
        p = u / '.aoe-clipboard' / ref_name
        if p.exists():
            found = p
            break
    if not found:
        raise FileNotFoundError(f'未找到 {ref_name}')

    img = Image.open(found).convert('RGB')
    result = cartoonize(img)
    out_path = output_dir / f'cartoon-ref-{idx}-matchmate-style.png'
    result.save(out_path)
    print(f'{found} -> {out_path}')
