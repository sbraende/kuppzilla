import { ScrollText } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function Header() {
  return (
    <header className="w-full border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Left spacer for centering */}
        <div className="w-10"></div>

        {/* Centered title */}
        <h1 className="text-2xl font-bold tracking-wider">KUPPZILLA</h1>

        {/* Right side with sheet trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Open menu"
            >
              <ScrollText className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Your content goes here.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Header;
