// الصور القديمة (موجودة في public/products على GitHub). الصور الجديدة بتتضاف من الـ dashboard وبتتخزن على Cloudinary.
const n = (i) => String(i).padStart(2, "0");

export const products = Array.from({ length: 32 }, (_, i) => ({
  id: `p${i + 1}`,
  src: `/products/product-${n(i + 1)}.webp`,
  alt: `Women scarf design ${i + 1}`,
}));
