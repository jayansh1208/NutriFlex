export default function Footer() {
  return (
    <footer className="bg-forest text-cream py-6 mt-12">
      <div className="container mx-auto text-center text-sm">
        © {new Date().getFullYear()} NutriFlex – All rights reserved.
      </div>
    </footer>
  );
}
