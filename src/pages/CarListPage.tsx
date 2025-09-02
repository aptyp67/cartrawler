import { useMemo, useState } from "react";
import { type CarsData, type CarItem } from "../api";
import CarCard from "../components/CarCard";
import { formatDate } from "../utils";

type Props = { data: CarsData };

export default function CarListPage({ data }: Props) {
  const [sort, setSort] = useState<"price-asc" | "price-desc">("price-asc");

  const legendText = useMemo(() => {
    const a = `${data.legend.pickupName} • ${formatDate(data.legend.pickupAt)}`;
    const b = `${data.legend.returnName} • ${formatDate(data.legend.returnAt)}`;
    return `${a} → ${b}`;
  }, [data]);

  const sortedCars = useMemo(() => {
    const items = [...data.cars];
    switch (sort) {
      case "price-desc":
        return items.sort((a, b) => b.price - a.price);
      case "price-asc":
      default:
        return items.sort((a, b) => a.price - b.price);
    }
  }, [data.cars, sort]);

  return (
    <div className="page">
      <header className="topbar">
        <h1 className="brand">Car availability</h1>
      </header>

      <main className="content">
        <section className="legend">
          <div className="legend-title">Pickup and return</div>
          <div className="legend-text">{legendText}</div>
        </section>
        <section className="list">
          <div className="list-head">
            <div className="list-title">Cars</div>
            <div className="list-controls">
              <div className="list-sub">{data.cars.length} options</div>
              <div className="sort">
                <label htmlFor="sort" className="sort-label">Sort by</label>
                <select
                  id="sort"
                  className="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  aria-label="Sort by"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
          <ul className="items">
            {sortedCars.map((c: CarItem) => (
              <CarCard key={c.id} car={c} />
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
