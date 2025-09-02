import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { type CarsData, type CarItem } from "../api";
import { formatDate } from "../utils";
import CarCard from "../components/CarCard";
import Button from "../components/ui/Button";
import angleLeft from "../assets/Icons/angle-left.svg";

type Props = { data: CarsData };

export default function CarDetailPage({ data }: Props) {
  const { id } = useParams();

  const car: CarItem | undefined = useMemo(() => {
    return data.cars.find((c) => c.id === id);
  }, [data, id]);

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
        <div className="legend">
          <div className="legend-title">Pickup and return</div>
          <div className="legend-text">{legendText}</div>
        </div>

        <section className="list">
          <div className="list-head">
            <div className="list-title">Selected car</div>
            <div className="list-sub">
              <Button to="/" variant="secondary" leftIcon={angleLeft}>
                Back to all cars
              </Button>
            </div>
          </div>
          {!car && <p className="error">Car not found</p>}
          {car && (
			<div className="detail">
              <ul className="items">
                <CarCard car={car} clickable={false} />
              </ul>
            </div>
          )}
        </section>

        {car && (
          <section className="extras-wrap">
            <div className="list-head">
              <div className="list-title">Additional information</div>
            </div>
            <div className="extras">
              <div className="extra-note">Additional information will be shown here.</div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
