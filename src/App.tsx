import { useEffect, useMemo, useState } from "react";
import { getCars, type CarsData, type CarItem } from "./api";
import { formatDate } from "./utils";

import "./App.css";

export default function App() {
  const [data, setData] = useState<CarsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCars()
      .then((d: CarsData) => setData(d))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e))
      )
      .finally(() => setLoading(false));
  }, []);

  const legendText = useMemo(() => {
    if (!data) return "";
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
        {loading && <p className="note">Loading…</p>}
        {error && <p className="error">{error}</p>}
        {data && (
          <>
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
                  <li className="item" key={c.id}>
                    <div className="item-main">
                      <img
                        className="item-photo"
                        src={c.picture}
                        alt={c.name}
                      />
                      <div>
                        <div className="item-name">{c.name}</div>
                        <div className="item-meta">{c.vendorName}</div>
                      </div>
                    </div>
                    <div className="item-price">
                      <span className="amount">{c.price.toFixed(2)}</span>
                      <span className="currency">{c.currency}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
