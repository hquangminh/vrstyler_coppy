export default function isBase64Image(base64String: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (!img || img.height === 0 || img.width === 0) resolve(false);
      else resolve(true);
    };
    img.onerror = () => resolve(false);
    img.src = base64String;
  });
}
