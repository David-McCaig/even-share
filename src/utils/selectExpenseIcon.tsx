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
    return <img className="w-7" src={powerIcon} />;
  } else if (billTypeString.toLowerCase().includes("internet")) {
    return <img className="w-7" src={wifiIcon} />;
  } else if (billTypeString.toLowerCase().includes("car")) {
    return <img className="w-7" src={carIcon} />;
  } else if (billTypeString.toLowerCase().includes("phone")) {
    return <img className="w-7" src={phoneIcon} />;
  } else if (billTypeString.toLowerCase().includes("parking")) {
    return <img className="w-7" src={fileIcon} />;
  } else if (billTypeString.toLowerCase().includes("boat")) {
    return <img className="w-7" src={boatIcon} />;
  } else if (billTypeString.toLowerCase().includes("hotel")) {
    return <img className="w-7" src={hotelIcon} />;
  } else if (billTypeString.toLowerCase().includes("groceries" || "food")) {
    return <img className="w-7" src={foodIcon} />;
  } else if (billTypeString.toLowerCase().includes("house" || "rent")) {
    return <img className="w-7" src={houseIcon} />;
  } else {
    return <img className="w-7" src={fileIcon} />;
  }
};
