import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Scroll to Top button that appears after scrolling down
 */
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "p-3 rounded-full bg-primary text-primary-foreground",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300",
        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16 pointer-events-none"
      )}
      aria-label="Scroll til toppen"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

export { ScrollToTop };
