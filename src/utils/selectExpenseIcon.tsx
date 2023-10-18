import powerIcon from "../assets/icons/expenseicons/power-outline.svg";
import wifiIcon from "../assets/icons/expenseicons/wifi-outline.svg";
import carIcon from "../assets/icons/expenseicons/car-outline.svg";
import phoneIcon from "../assets/icons/expenseicons/call-outline.svg";
import fileIcon from "../assets/icons/expenseicons/document-outline.svg";
import boatIcon from "../assets/icons/expenseicons/boat-outline.svg";
import hotelIcon from "../assets/icons/expenseicons/bed-outline.svg";
import foodIcon from "../assets/icons/expenseicons/fast-food-outline.svg";
import houseIcon from "../assets/icons/expenseicons/home-outline.svg";


export const selectExpenseIcon = (billType: JSX.Element | string) => {
  const billTypeString =
    typeof billType === "string" ? billType : billType?.toString();

  if (billTypeString.toLowerCase().includes("power")) {
    return <img className="w-7" src={powerIcon} alt="Power Icon" />;
  } else if (billTypeString.toLowerCase().includes("internet")) {
    return <img className="w-7" src={wifiIcon} alt="Wifi icon" />;
  } else if (billTypeString.toLowerCase().includes("car")) {
    return <img className="w-7" src={carIcon} alt="Car icon" />;
  } else if (billTypeString.toLowerCase().includes("phone")) {
    return <img className="w-7" src={phoneIcon} alt="Phone icon" />;
  } else if (billTypeString.toLowerCase().includes("parking")) {
    return <img className="w-7" src={fileIcon} alt="parking icon" />;
  } else if (billTypeString.toLowerCase().includes("boat")) {
    return <img className="w-7" src={boatIcon} alt="boat icon" />;
  } else if (billTypeString.toLowerCase().includes("hotel")) {
    return <img className="w-7" src={hotelIcon} alt="hotel icon" />;
  } else if (billTypeString.toLowerCase().includes("groceries" || "food")) {
    return <img className="w-7" src={foodIcon} alt="food icon" />;
  } else if (billTypeString.toLowerCase().includes("house" || "rent")) {
    return <img className="w-7" src={houseIcon} alt="house icon" />;
  } else {
    return <img className="w-7" src={fileIcon} />;
  }
};
