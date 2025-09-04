import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { type CarsData, type CarItem } from "../../api";
import { CarCard } from "../../components";
import { formatDate } from "../../utils";
import "./CarListPage.css";

type Props = { data: CarsData };

export default function CarListPage({ data }: Props) {
  const [sort, setSort] = useState<"price-asc" | "price-desc">("price-asc");
  const { t } = useTranslation();

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
    <>
      <section className="legend">
        <div className="legend-title">{t("legend.pickup_and_return")}</div>
        <div className="legend-text">{legendText}</div>
      </section>
      <section className="list">
        <div className="list-head">
          <div className="list-title">{t("list.cars")}</div>
          <div className="list-controls">
            <div className="list-sub">{t("list.options", { count: data.cars.length })}</div>
            <div className="sort">
              <label htmlFor="sort" className="sort-label">{t("list.sort_by")}</label>
              <select
                id="sort"
                className="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                aria-label={t("list.sort_by")}
              >
                <option value="price-asc">{t("list.price_low_high")}</option>
                <option value="price-desc">{t("list.price_high_low")}</option>
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
    </>
  );
}
