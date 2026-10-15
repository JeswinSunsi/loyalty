import QRCode from 'qrcode';

export type QrShape = { size: number; path: string };

// The code is drawn as one vector path: it stays sharp at any card size and has no image to decode on first flip.
export function qrShape(text: string): QrShape {
  const { size, data } = QRCode.create(text, { errorCorrectionLevel: 'M' }).modules;
  let path = '';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!data[y * size + x]) continue;
      const start = x;
      while (x + 1 < size && data[y * size + x + 1]) x++;
      const run = x - start + 1;
      path += `M${start} ${y}h${run}v1h-${run}z`;
    }
  }
  return { size, path };
}
