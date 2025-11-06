import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { AIBadge } from "@/components/ui/ai-badge";
import { useProductStores } from "@/hooks/useProductStores";
import { useProductQA } from "@/hooks/useProductQA";
import { useProductSummary } from "@/hooks/useProductSummary";
import { MessageCircle, Store, ExternalLink, Loader2, Sparkles } from "lucide-react";

function ProductInfoDialog({ product, open, onOpenChange, children }) {
  const [question, setQuestion] = useState("");
  const { stores, loading: storesLoading } = useProductStores(product?.productId);
  const { answer, loading: qaLoading, error: qaError, askQuestion, clearAnswer } = useProductQA();
  const { summary, loading: summaryLoading } = useProductSummary(product);

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (question.trim() && product) {
      askQuestion(product, question);
    }
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
    if (answer) {
      clearAnswer();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col gap-4">
            {/* Product Image */}
            {product?.image && (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-64 object-contain rounded-lg bg-muted"
              />
            )}

            {/* Brand and Title */}
            {product?.brand && (
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {product.brand}
              </p>
            )}
            <DialogTitle className="text-2xl">{product?.title}</DialogTitle>
          </div>
        </DialogHeader>

        {/* AI Summary Section */}
        <div className="py-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold">Produktsammendrag</h3>
            <AIBadge />
          </div>
          {summaryLoading ? (
            <div className="flex items-center gap-2 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Genererer sammendrag...</p>
            </div>
          ) : (
            <DialogDescription className="text-base leading-relaxed">
              {summary || product?.description || "Ingen beskrivelse tilgjengelig"}
            </DialogDescription>
          )}

          {/* Original Description in Accordion */}
          {product?.description && (
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="original-description">
                <AccordionTrigger className="text-sm">
                  Se original beskrivelse
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        {/* AI Q&A Section */}
        <div className="py-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="h-5 w-5" />
            <h3 className="font-semibold">Spør om produktet</h3>
            <AIBadge />
          </div>
          <form onSubmit={handleAskQuestion} className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Spør om produktet..."
                value={question}
                onChange={handleQuestionChange}
                disabled={qaLoading}
                className="flex-1"
              />
              <button
                type="submit"
                disabled={qaLoading || !question.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {qaLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send"
                )}
              </button>
            </div>

            {/* AI Answer */}
            {answer && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm leading-relaxed">{answer}</p>
              </div>
            )}

            {/* Error Message */}
            {qaError && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                <p className="text-sm">{qaError}</p>
              </div>
            )}
          </form>
        </div>

        {/* Price Comparison Section */}
        <div className="py-4 border-t">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Store className="h-5 w-5" />
            Priser hos andre butikker
          </h3>

          {storesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : stores.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              Ingen andre butikker funnet for dette produktet
            </p>
          ) : (
            <div className="space-y-2">
              {stores.map((store, index) => {
                const isCurrentStore = store.store_name === product?.merchant;
                const isCheapest = index === 0;
                const hasDiscount = store.discount_percentage > 0;

                return (
                  <div
                    key={`${store.store_name}-${index}`}
                    className={`p-4 rounded-lg border transition-colors ${
                      isCurrentStore
                        ? "border-primary bg-primary/5"
                        : isCheapest
                        ? "border-green-500 bg-green-500/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{store.store_name}</p>
                          {isCurrentStore && (
                            <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded">
                              Valgt butikk
                            </span>
                          )}
                          {isCheapest && !isCurrentStore && (
                            <span className="text-xs px-2 py-1 bg-green-500 text-white rounded">
                              Billigst
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline gap-2 mt-1">
                          {hasDiscount ? (
                            <>
                              <span className="text-lg font-bold text-foreground">
                                {store.sale_price} kr
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                {store.price} kr
                              </span>
                              <span className="text-xs px-1.5 py-0.5 bg-destructive text-destructive-foreground rounded">
                                -{store.discount_percentage.toFixed(0)}%
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-foreground">
                              {store.effective_price} kr
                            </span>
                          )}
                        </div>

                        {store.availability && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {store.availability}
                          </p>
                        )}
                      </div>

                      {store.link && (
                        <a
                          href={store.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors flex items-center gap-2 text-sm font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Gå til butikk
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductInfoDialog;
