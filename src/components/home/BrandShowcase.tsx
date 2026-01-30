import { brands } from "@/data/mockProducts";

const BrandShowcase = () => {
  return (
    <section className="py-16 border-t border-b">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Top Brands</h2>
          <p className="text-muted-foreground">
            Shop authentic products from leading brands
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {brands.map((brand, index) => (
            <div
              key={brand.name}
              className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-8 md:h-10 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
