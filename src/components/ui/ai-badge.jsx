import { cn } from "@/lib/utils";

/**
 * AI Badge with gradient - indicates AI-generated content
 * Size: 20x20px with diagonal gradient (cyan -> purple -> blue -> pink)
 */
function AIBadge({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded",
        "w-5 h-5 text-[10px] font-bold text-white leading-none",
        "bg-linear-to-br from-cyan-400 via-purple-500 to-pink-500",
        "shadow-sm",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(135deg, #06b6d4 0%, #a855f7 50%, #ec4899 100%)",
      }}
      aria-label="AI-generert innhold"
      {...props}
    >
      AI
    </div>
  );
}

export { AIBadge };
