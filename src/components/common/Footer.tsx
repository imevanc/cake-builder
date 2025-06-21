export const Footer = () => (
  <footer className="bg-secondary text-secondary-foreground py-8 mt-auto">
    <div className="container mx-auto px-4 text-center">
      <p>
        &copy; {new Date().getFullYear()} Cake Creation Station. All rights
        reserved.
      </p>
      <p className="text-sm mt-1">
        Delicious cakes, designed by you, baked with love.
      </p>
    </div>
  </footer>
);
