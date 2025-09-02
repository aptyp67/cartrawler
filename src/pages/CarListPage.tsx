import { useMemo } from "react";
import { type CarsData, type CarItem } from "../api";
import CarCard from "../components/CarCard";
import { formatDate } from "../utils";

type Props = { data: CarsData };

export default function CarListPage({ data }: Props) {

  const legendText = useMemo(() => {
    const a = `${data.legend.pickupName} • ${formatDate(data.legend.pickupAt)}`;
    const b = `${data.legend.returnName} • ${formatDate(data.legend.returnAt)}`;
    return `${a} → ${b}`;
  }, [data]);

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
            <div className="list-sub">
              {data.cars.length} options • sorted by price
            </div>
          </div>
          <ul className="items">
            {data.cars.map((c: CarItem) => (
              <CarCard key={c.id} car={c} />
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
