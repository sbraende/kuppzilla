import { Sparkles, Calendar, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

function DealCard({ deal, onSave, isSaved }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSave(deal);
  };

  return (
    <a
      href={deal.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-lg bg-linear-to-br from-yellow-500/10 to-orange-500/10 shadow-md transition-all hover:shadow-xl border-2 border-yellow-500/20 hover:border-yellow-500/40"
    >
      {/* Deal Image */}
      <div className="relative">
        {deal.image && (
          <img
            src={deal.image}
            alt={deal.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        )}
        {!deal.image && (
          <div className="flex h-48 w-full items-center justify-center bg-linear-to-br from-yellow-100 to-orange-100 text-yellow-800">
            <Sparkles className="h-12 w-12" />
          </div>
        )}

        {/* Discount Badge - Top Left */}
        {deal.discount && (
          <div className="absolute left-2 top-2 rounded-md bg-yellow-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
            {deal.discount}
          </div>
        )}

        {/* Save Button - Top Right */}
        <button
          onClick={handleSaveClick}
          className={cn(
            "absolute right-2 top-2 rounded-full p-2 shadow-lg transition-all",
            "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            isSaved
              ? "bg-primary text-primary-foreground"
              : "bg-background/90 text-foreground hover:bg-background"
          )}
          aria-label={
            isSaved ? "Fjern fra favoritter" : "Legg til i favoritter"
          }
        >
          <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
        </button>

        {/* KUPP Badge - Bottom Left */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-linear-to-r from-yellow-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
          <Sparkles className="h-3 w-3" />
          <span>KUPP</span>
        </div>
      </div>

      {/* Deal Info */}
      <div className="p-4">
        {/* Merchant */}
        <p className="text-xs font-medium uppercase tracking-wide text-yellow-600">
          {deal.merchant}
        </p>

        {/* Title */}
        <h3 className="mt-1 font-bold text-foreground text-lg line-clamp-2">
          {deal.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
          {deal.description}
        </p>

        {/* Valid Until */}
        {deal.validUntil && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Gyldig til {formatDate(deal.validUntil)}</span>
          </div>
        )}

        {/* Categories */}
        {deal.categories && deal.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {deal.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

export default DealCard;
