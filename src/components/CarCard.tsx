import type { CarItem } from "../api";
import personIcon from "../assets/Icons/person.svg";
import bagIcon from "../assets/Icons/bag.svg";
import doorIcon from "../assets/Icons/door.svg";
import transmissionIcon from "../assets/Icons/transmission.svg";
import fuelIcon from "../assets/Icons/fuel.svg";
import acIcon from "../assets/Icons/snowflake.svg";

import alamoLogo from "../assets/Vendors/alamo.svg";
import avisLogo from "../assets/Vendors/avis.svg";
import hertzLogo from "../assets/Vendors/hertz.svg";
import partnerLogo from "../assets/Partner Logo/partner.svg";

type Props = {
  car: CarItem;
};

const vendorLogoByName: Record<string, string> = {
  alamo: alamoLogo,
  avis: avisLogo,
  hertz: hertzLogo,
};

function getVendorLogo(vendorName: string | undefined): string | null {
  if (!vendorName) return null;
  const key = vendorName.trim().toLowerCase();
  return vendorLogoByName[key] ?? null;
}

function hasAC(value: string | undefined): boolean {
  if (!value) return false;
  const v = String(value).trim().toLowerCase();
  return v === "true" || v === "y" || v === "yes" || v === "1";
}

export default function CarCard({ car }: Props) {
  const logo = getVendorLogo(car.vendorName) || partnerLogo;
  const ac = hasAC(car.airConditioning);

  return (
    <li className="item item--card" key={car.id}>
      <div className="item-main">
        <img className="item-photo" src={car.picture} alt={car.name} />
        <div className="item-details">
          <div className="item-name">{car.name}</div>
          <div className="item-vendor">
            <img className="vendor-logo" src={logo} alt={car.vendorName} />
            <span className="vendor-name">{car.vendorName}</span>
          </div>
          <ul className="item-specs">
            <li className="spec">
              <img className="spec-icon" src={personIcon} alt="Passengers" />
              <span className="spec-text">{car.passengers}</span>
            </li>
            <li className="spec">
              <img className="spec-icon" src={bagIcon} alt="Baggage" />
              <span className="spec-text">{car.baggage}</span>
            </li>
            {car.doors && (
              <li className="spec">
                <img className="spec-icon" src={doorIcon} alt="Doors" />
                <span className="spec-text">{car.doors}</span>
              </li>
            )}
            {car.transmission && (
              <li className="spec">
                <img
                  className="spec-icon"
                  src={transmissionIcon}
                  alt="Transmission"
                />
                <span className="spec-text">{car.transmission}</span>
              </li>
            )}
            {car.fuel && (
              <li className="spec">
                <img className="spec-icon" src={fuelIcon} alt="Fuel" />
                <span className="spec-text">{car.fuel}</span>
              </li>
            )}
            <li className="spec">
              <img className="spec-icon" src={acIcon} alt="Air conditioning" />
              <span className="spec-text">{ac ? "A/C" : "No A/C"}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="item-price">
        <div>
          <span className="amount">{car.price.toFixed(2)}</span>
          <span className="currency">{car.currency}</span>
        </div>
        <div className="item-subprice">
          {car.pricePerDay.toFixed(2)} {car.currency} / day
        </div>
      </div>
    </li>
  );
}

