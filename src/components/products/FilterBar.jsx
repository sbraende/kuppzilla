import { useRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

// Special filters that are not category-based
const specialFilters = [
  { id: "best-deals", label: "Beste tilbud", type: "special" },
  { id: "for-me", label: "For meg", type: "special" },
  { id: "most-popular", label: "Mest populære", type: "special" },
  { id: "newest", label: "Nyeste", type: "special" },
];

function FilterBar({ activeFilter = "best-deals", onFilterChange, availableCategories = [] }) {
  // Combine special filters with dynamic category filters
  const filters = useMemo(() => {
    const categoryFilters = availableCategories.map(category => ({
      id: `category-${category}`,
      label: category,
      type: "category",
      categoryName: category,
    }));

    return [...specialFilters, ...categoryFilters];
  }, [availableCategories]);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="sticky top-[73px] z-40 w-full bg-background">
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="container mx-auto">
          <div className="flex gap-2 px-4 py-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
