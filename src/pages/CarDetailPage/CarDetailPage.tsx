import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { type CarsData, type CarItem } from "../../api";
import { formatDate } from "../../utils";
import { CarCard, Button } from "../../components";
import { angleLeft } from "../../assets";
import { useTranslation } from "react-i18next";
import "./CarDetailPage.css";

type Props = { data: CarsData };

export default function CarDetailPage({ data }: Props) {
  const { id } = useParams();
  const { t } = useTranslation();

  const car: CarItem | undefined = useMemo(() => {
    return data.cars.find((c) => c.id === id);
  }, [data, id]);

  const legendText = useMemo(() => {
    const a = `${data.legend.pickupName} • ${formatDate(data.legend.pickupAt)}`;
    const b = `${data.legend.returnName} • ${formatDate(data.legend.returnAt)}`;
    return `${a} → ${b}`;
  }, [data]);

  return (
    <>
      <div className="legend">
        <div className="legend-title">{t("legend.pickup_and_return")}</div>
        <div className="legend-text">{legendText}</div>
      </div>

      <section className="list">
        <div className="list-head">
          <div className="list-title">{t("detail.selected_car")}</div>
          <div className="list-sub">
            <Button to="/" variant="secondary" leftIcon={angleLeft}>
              {t("detail.back_to_all")}
            </Button>
          </div>
        </div>
        {!car && <p className="error">{t("detail.not_found")}</p>}
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
            <div className="list-title">{t("detail.additional_info")}</div>
          </div>
          <div className="extras">
            <div className="extra-note">{t("detail.additional_info_note")}</div>
          </div>
        </section>
      )}
    </>
  );
}
