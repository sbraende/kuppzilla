function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-bold tracking-wider">KUPPZILLA</h2>
          <p className="text-sm text-muted-foreground">
            Utviklet av Sebastian Brænde
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mb-6 rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            De eksterne lenkene på denne siden fører til nettbutikker der Kuppzilla kan motta en provisjon av eventuelle salg. Dette hjelper oss med å drifte og videreutvikle tjenesten.
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} Kuppzilla · Sebastian Brænde
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
