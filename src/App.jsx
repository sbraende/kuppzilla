import { useState } from "react";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";

// Mock product data with varying image heights for masonry effect
const mockProducts = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    description: "High-quality audio with noise cancellation. Perfect for music lovers and professionals.",
    price: "$299",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop",
  },
  {
    id: 2,
    title: "Smart Watch Series 8",
    description: "Track your fitness goals with advanced health monitoring features.",
    price: "$399",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Minimalist Backpack",
    description: "Sleek design with multiple compartments for everyday carry.",
    price: "$89",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=450&fit=crop",
  },
  {
    id: 4,
    title: "Vintage Camera",
    description: "Classic film camera in excellent condition. Perfect for photography enthusiasts.",
    price: "$450",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=550&fit=crop",
  },
  {
    id: 5,
    title: "Designer Sunglasses",
    description: "UV protection with timeless style. Includes premium case.",
    price: "$199",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Leather Journal",
    description: "Handcrafted leather journal with premium paper. Perfect for daily notes.",
    price: "$45",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=520&fit=crop",
  },
  {
    id: 7,
    title: "Mechanical Keyboard",
    description: "RGB backlit with custom switches. Built for gaming and productivity.",
    price: "$159",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=480&fit=crop",
  },
  {
    id: 8,
    title: "Ceramic Plant Pot Set",
    description: "Modern design ceramic pots. Set of 3 with drainage holes.",
    price: "$35",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=600&fit=crop",
  },
];

function App() {
  const [wishlist, setWishlist] = useState([]);

  const handleSaveProduct = (product) => {
    setWishlist((prev) => {
      const isAlreadySaved = prev.some((item) => item.id === product.id);
      if (isAlreadySaved) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const savedProductIds = wishlist.map((product) => product.id);

  return (
    <>
      <Header wishlist={wishlist} onRemoveFromWishlist={handleSaveProduct} />
      <main className="container mx-auto px-4 py-8">
        <ProductGrid
          products={mockProducts}
          onSaveProduct={handleSaveProduct}
          savedProductIds={savedProductIds}
        />
      </main>
    </>
  );
}

export default App;
