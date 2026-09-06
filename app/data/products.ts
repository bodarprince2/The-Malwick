export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  sizes?: string[];
  image: string;
  hoverImage?: string;
  badge?: "New" | "Featured" | "Bestseller";
  status?: "coming_soon" | "available";
  keyStrengths?: string[];
  story?: string;
  material?: string;
  fitAndSizing?: string;
  care?: string;
  shippingAndReturns?: string;
}

export const products: Product[] = [
  {
    id: "tee-black",
    name: "Noir Oversized Tee",
    description: "An architectural approach to the classic oversized tee. This piece features bold, asymmetrical front seaming and a distinctive contrasting panel, finished with a structured crew neckline.",
    category: "Oversized T-Shirts",
    price: 1299,
    originalPrice: 1599,
    sizes: ["S", "M", "L", "XL"],
    image: "/tee-black-front.png",
    keyStrengths: [
      "Architectural asymmetrical seaming",
      "Contrasting tonal panel",
      "Structured oversized fit",
      "Dropped shoulder silhouette"
    ],
    story: "Redefining the essential black tee through geometry and structure. The Noir Oversized Tee breaks away from traditional construction with intricate diagonal seaming that sweeps across the body, grounding the look with a subtle contrasting panel on the lower edge. Designed for those who appreciate quiet complexity in their everyday uniform.",
    material: "Heavyweight premium cotton blend.",
    fitAndSizing: "Oversized, boxy fit. We recommend taking your usual size for the intended relaxed look, or sizing down for a more standard fit.",
    care: "Machine wash cold with like colors. Lay flat to dry to maintain the structural integrity of the seams.",
    shippingAndReturns: "Free shipping on orders over ₹5,000. 30-day hassle-free returns."
  },
  {
    id: "tee-cream",
    name: "Ivory Drop Tee",
    description: "A relaxed drop-shoulder tee in soft ivory, distinguished by a curved sweeping seam, subtle gradient shading, and an abstract embroidered logo on the chest.",
    category: "Oversized T-Shirts",
    price: 1299,
    sizes: ["S", "M", "L", "XL"],
    image: "/tee-cream-front.png",
    badge: "Bestseller",
    keyStrengths: [
      "Sweeping double-stitch seam detail",
      "Subtle tonal gradient shading",
      "Abstract circular embroidery",
      "Relaxed drop-shoulder block"
    ],
    story: "Softness meets structure. The Ivory Drop Tee is characterized by its fluid, curved front seam that is highlighted by a delicate airbrushed gradient. The piece is finished with a minimalist, abstract embroidery on the chest, bringing an elevated, artistic touch to everyday comfort.",
    material: "Premium mid-weight cotton.",
    fitAndSizing: "Relaxed drop-shoulder fit. True to size.",
    care: "Gentle machine wash cold. Do not bleach. Iron on low heat if needed."
  },
  {
    id: "tee-sand",
    name: "Sand Classic Tee",
    description: "A refined classic fit tee in a versatile sand hue. Designed with a clean silhouette and minimalist finishing for everyday wear.",
    category: "Oversized T-Shirts",
    price: 1499,
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/tee-sand-front.png",
    keyStrengths: [
      "Clean minimal silhouette",
      "Refined crew neckline",
      "Versatile everyday styling",
      "Carefully considered finishing"
    ],
    story: "The foundation of a modern wardrobe. The Sand Classic Tee strips away the unnecessary to focus on proportion, comfort, and an incredibly versatile earth-toned hue. It is designed to anchor any look with understated elegance.",
    material: "100% Organic Cotton.",
    fitAndSizing: "Classic relaxed fit."
  },
  {
    id: "tee-oat",
    name: "Oat Heritage Tee",
    description: "Heritage-inspired tee in a warm oat shade. Features a relaxed visual proportion and structured short-sleeve profile.",
    category: "Oversized T-Shirts",
    price: 1699,
    sizes: ["S", "M", "L"],
    image: "/products/oat_tee.png",
    keyStrengths: [
      "Structured short-sleeve profile",
      "Warm heritage oat shade",
      "Minimal branding",
      "Relaxed visual proportion"
    ],
    story: "Drawing inspiration from vintage athletic wear, the Oat Heritage Tee combines a structured fit with an incredibly soft hand-feel. It's a testament to the beauty of simplicity and quality materials."
  },
  {
    id: "tee-obsidian",
    name: "Obsidian Core Tee",
    description: "The essential core tee in dark obsidian. A flawless minimalist execution with a premium structured drape.",
    category: "Oversized T-Shirts",
    price: 1899,
    originalPrice: 2499,
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/products/obsidian_tee.png",
    badge: "Featured",
    keyStrengths: [
      "Deep obsidian shade",
      "Flawless minimalist execution",
      "Premium structured drape",
      "Refined crew neckline"
    ],
    story: "The Obsidian Core Tee is our answer to the perfect dark t-shirt. Stripped of all excess, it relies entirely on its carefully engineered cut and premium fabric to make a statement.",
    material: "Heavyweight 300GSM Cotton."
  },
  {
    id: "shirt-1",
    name: "Maison Linen Resort Shirt",
    description: "Breathable, lightweight European linen resort shirt. Featuring a relaxed collar and an effortless drape perfect for warm days.",
    category: "Shirts",
    price: 1899,
    sizes: ["S", "M", "L", "XL"],
    image: "/products/linen_shirt.png",
    badge: "New",
    keyStrengths: [
      "Breathable lightweight linen",
      "Relaxed resort collar",
      "Effortless draped silhouette",
      "Clean minimalist finishing"
    ],
    story: "Designed for the modern traveler, the Maison Linen Resort Shirt offers an unparalleled blend of breathability and elegance. The natural texture of the linen provides character, while the relaxed cut ensures all-day comfort in warmer climates.",
    material: "100% European Linen.",
    care: "Machine wash cold on gentle cycle. Hang dry."
  },
  {
    id: "shirt-2",
    name: "Executive Oxford Shirt",
    description: "A tailored modern classic woven from premium Oxford cloth. Crisp, structured, and versatile.",
    category: "Shirts",
    price: 1699,
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/products/oxford_shirt.png",
    keyStrengths: [
      "Premium Oxford cloth",
      "Tailored modern classic fit",
      "Structured collar",
      "Versatile transitional styling"
    ],
    story: "A cornerstone of the modern wardrobe. The Executive Oxford Shirt reimagines a classic staple with a slightly more contemporary fit, ensuring it looks just as sharp tucked into tailored trousers as it does worn open over a simple tee.",
    material: "100% Cotton Oxford Cloth."
  },
  {
    id: "tee-olive",
    name: "Olive Washed Drop Tee",
    description: "A meticulously garment-dyed tee in a vintage olive tone. Featuring a relaxed drop shoulder and a remarkably soft lived-in feel.",
    category: "Oversized T-Shirts",
    price: 1399,
    sizes: ["S", "M", "L", "XL"],
    image: "/products/olive_washed_tee.png",
    badge: "New",
    keyStrengths: [
      "Artisanal garment-dye process",
      "Vintage lived-in olive hue",
      "Relaxed drop-shoulder silhouette",
      "Incredibly soft hand-feel"
    ],
    story: "Embracing the beauty of imperfection. The Olive Washed Drop Tee undergoes a specialized garment-dyeing process that gives it a distinct, slightly faded patina from day one. It feels like a vintage favorite, cut with modern architectural proportions.",
    material: "100% Peruvian Pima Cotton.",
    fitAndSizing: "Relaxed oversized fit. Take your true size for a drapey look.",
    care: "Machine wash cold inside out. Color may fade naturally over time. Tumble dry low.",
    shippingAndReturns: "Free shipping on orders over ₹5,000. 30-day hassle-free returns."
  },
  {
    id: "tee-knit",
    name: "Textured Knit Tee",
    description: "An elevated approach to the basic tee, crafted from a breathable open-knit weave that offers subtle texture and supreme comfort.",
    category: "Oversized T-Shirts",
    price: 1899,
    originalPrice: 2299,
    sizes: ["S", "M", "L", "XL"],
    image: "/products/textured_knit_tee.png",
    keyStrengths: [
      "Breathable open-knit texture",
      "Refined ribbed collar",
      "Elevated drape and weight",
      "Subtle textural depth"
    ],
    story: "Where knitwear meets everyday ease. The Textured Knit Tee swaps standard jersey for a highly breathable, dimensional knit fabric. It offers the relaxed comfort of your favorite t-shirt with the sophisticated visual weight of a light sweater.",
    material: "Premium Cotton and Modal blend knit.",
    fitAndSizing: "Boxy, slightly cropped fit. Designed to fall right at the waistline.",
    care: "Hand wash cold or machine wash on delicate cycle. Lay flat to dry.",
    shippingAndReturns: "Free shipping on orders over ₹5,000. 30-day hassle-free returns."
  },
  {
    id: "tee-mock",
    name: "Graphite Mock Neck",
    description: "A sophisticated mock neck tee with a structured collar and heavy drape. A modern, minimalist staple for transitional weather.",
    category: "Oversized T-Shirts",
    price: 1599,
    sizes: ["XS", "S", "M", "L"],
    image: "/products/mock_neck_tee.png",
    keyStrengths: [
      "Structured mock neckline",
      "Heavyweight 280GSM drape",
      "Clean minimalist finishing",
      "Deep graphite shade"
    ],
    story: "A masterclass in quiet confidence. The Graphite Mock Neck sits slightly higher on the collarbone, instantly framing the face and elevating any outfit. Crafted from a dense, heavyweight cotton, it holds its shape beautifully throughout the day.",
    material: "Heavyweight 280GSM 100% Cotton.",
    fitAndSizing: "True to size with a slightly relaxed body.",
    care: "Machine wash cold. Do not bleach. Hang dry to preserve collar structure.",
    shippingAndReturns: "Free shipping on orders over ₹5,000. 30-day hassle-free returns."
  },
  {
    id: "tee-navy",
    name: "Midnight Box Tee",
    description: "A sharply tailored boxy tee in a deep midnight navy. Defined by its geometric silhouette and crisp, clean lines.",
    category: "Oversized T-Shirts",
    price: 1499,
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/products/navy_box_tee.png",
    badge: "Bestseller",
    keyStrengths: [
      "Geometric boxy silhouette",
      "Deep midnight navy tone",
      "Crisp structural seams",
      "Effortless wide drape"
    ],
    story: "Redefining proportions. The Midnight Box Tee is cut wide and slightly short, creating a sharp, architectural shape that moves beautifully. The deep navy hue offers a slightly softer, yet equally sophisticated alternative to black.",
    material: "Mid-weight structural cotton.",
    fitAndSizing: "Oversized box fit. Wide through the chest and shoulders.",
    care: "Machine wash cold with like colors. Tumble dry low.",
    shippingAndReturns: "Free shipping on orders over ₹5,000. 30-day hassle-free returns."
  }
];
