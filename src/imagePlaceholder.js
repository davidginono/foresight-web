export function imagePlaceholder(width = 800, height = 600, failed = false) {
  const w = Number.isFinite(Number(width)) && Number(width) > 0 ? Number(width) : 800;
  const h = Number.isFinite(Number(height)) && Number(height) > 0 ? Number(height) : 600;
  const scale = Math.min(w, h) / 400;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="100%" height="100%" fill="#eef3f8"/>
    <g transform="translate(${w / 2} ${h / 2}) scale(${scale})">
      <rect x="-105" y="-100" width="210" height="190" rx="22" fill="#ffffff" stroke="#dfe5ee"/>
      <g fill="none" stroke="#768297" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <rect x="-51" y="-65" width="102" height="78" rx="10"/>
        <circle cx="-24" cy="-40" r="8"/>
        <path d="m-49 0 29-28 23 23 17-16 29 27"/>
      </g>
      <path d="M-20 34h40" stroke="#ff6900" stroke-width="3" stroke-linecap="round"/>
      <text x="0" y="64" text-anchor="middle" fill="#465166" font-family="Arial,sans-serif" font-size="17">${failed ? 'Image unavailable' : 'Loading image'}</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
