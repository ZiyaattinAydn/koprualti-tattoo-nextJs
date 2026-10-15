"use client";
export async function prepareImage(file: File) {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 20 * 1024 * 1024
  )
    throw new Error("JPG, PNG veya WebP seç. En fazla 20 MB.");
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > 50000000)
      throw new Error("Daha küçük bir görsel seç.");
    const ratio = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height)),
      canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Görsel hazırlanamadı.");
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Görsel hazırlanamadı."))),
        "image/webp",
        0.86,
      ),
    );
    if (blob.size > 3 * 1024 * 1024)
      throw new Error(
        "Daha küçük bir görsel seç. Hazırlanan dosya en fazla 3 MB olabilir.",
      );
    return blob;
  } finally {
    bitmap.close();
  }
}
