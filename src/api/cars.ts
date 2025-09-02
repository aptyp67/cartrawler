import { asArray, getFieldValue } from "../utils";

const FEED_URL = "https://ajaxgeo.cartrawler.com/ctabe/cars.json";

export type Legend = {
  pickupName: string;
  pickupAt: string;
  returnName: string;
  returnAt: string;
};

export type CarItem = {
  id: string;
  vendorCode: string;
  vendorName: string;
  code: string;
  codeContext: string;
  name: string;
  picture: string;
  passengers: string;
  baggage: string;
  transmission: string;
  fuel: string;
  drive: string;
  doors: string;
  price: number;
  currency: string;
};

export type CarsData = {
  legend: Legend;
  cars: CarItem[];
};

export async function getCars(source: string = FEED_URL): Promise<CarsData> {
  const res = await fetch(source);
  if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
  const json = await res.json();
  const root = Array.isArray(json) ? json[0] : json;
  return toCars(root);
}

function toCars(raw: unknown): CarsData {
  const core = getFieldValue(raw, "VehAvailRSCore");
  const rental = getFieldValue(core, "VehRentalCore");
  const legend: Legend = {
    pickupName: String(
      getFieldValue(getFieldValue(rental, "PickUpLocation"), "@Name") ?? ""
    ),
    pickupAt: String(getFieldValue(rental, "@PickUpDateTime") ?? ""),
    returnName: String(
      getFieldValue(getFieldValue(rental, "ReturnLocation"), "@Name") ?? ""
    ),
    returnAt: String(getFieldValue(rental, "@ReturnDateTime") ?? ""),
  };

  const vendors = asArray(getFieldValue(core, "VehVendorAvails"));
  const cars: CarItem[] = vendors.flatMap((va) => {
    const vendor = getFieldValue(va, "Vendor");
    const vendorCode = String(getFieldValue(vendor, "@Code") ?? "");
    const vendorName = String(getFieldValue(vendor, "@Name") ?? "");
    const items = asArray(getFieldValue(va, "VehAvails"));
    const available = items.filter(
      (it) => String(getFieldValue(it, "@Status") ?? "") === "Available"
    );
    return available.map((it, idx): CarItem => {
      const vehicle = getFieldValue(it, "Vehicle");
      const priceInfo = getFieldValue(it, "TotalCharge");
      const id = `${vendorCode}-${String(
        getFieldValue(vehicle, "@Code") ?? "car"
      )}-${idx}`;
      const amount = getFieldValue(priceInfo, "@RateTotalAmount");
      const price = typeof amount === "number" ? amount : Number(amount ?? 0);
      return {
        id,
        vendorCode,
        vendorName,
        code: String(getFieldValue(vehicle, "@Code") ?? ""),
        codeContext: String(getFieldValue(vehicle, "@CodeContext") ?? ""),
        name: String(
          getFieldValue(getFieldValue(vehicle, "VehMakeModel"), "@Name") ?? ""
        ),
        picture: String(getFieldValue(vehicle, "PictureURL") ?? ""),
        passengers: String(getFieldValue(vehicle, "@PassengerQuantity") ?? ""),
        baggage: String(getFieldValue(vehicle, "@BaggageQuantity") ?? ""),
        transmission: String(getFieldValue(vehicle, "@TransmissionType") ?? ""),
        fuel: String(getFieldValue(vehicle, "@FuelType") ?? ""),
        drive: String(getFieldValue(vehicle, "@DriveType") ?? ""),
        doors: String(getFieldValue(vehicle, "@DoorCount") ?? ""),
        price,
        currency: String(getFieldValue(priceInfo, "@CurrencyCode") ?? ""),
      };
    });
  });

  cars.sort((a, b) => a.price - b.price);

  return { legend, cars };
}
