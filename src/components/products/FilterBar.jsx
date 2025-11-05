import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const filters = [
  { id: "best-deals", label: "Beste tilbud" },
  { id: "for-me", label: "For meg" },
  { id: "most-popular", label: "Mest populære" },
  { id: "newest", label: "Nyeste" },
  { id: "electronics", label: "Elektronikk" },
  { id: "home", label: "Hjem & interiør" },
  { id: "fashion", label: "Mote & klær" },
  { id: "sports", label: "Sport & fritid" },
  { id: "beauty", label: "Skjønnhet & helse" },
  { id: "books", label: "Bøker & medier" },
  { id: "toys", label: "Leker & barn" },
  { id: "food", label: "Mat & drikke" },
  { id: "garden", label: "Hage & utendørs" },
  { id: "tools", label: "Verktøy & bygg" },
  { id: "automotive", label: "Bil & motor" },
  { id: "pets", label: "Kjæledyr" },
  { id: "office", label: "Kontor & skole" },
  { id: "music", label: "Musikk & instrumenter" },
  { id: "gaming", label: "Gaming & konsoll" },
  { id: "travel", label: "Reise & bagasje" },
  { id: "art", label: "Kunst & håndverk" },
];

function FilterBar({ activeFilter = "best-deals", onFilterChange }) {
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
