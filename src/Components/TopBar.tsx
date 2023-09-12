import AddExpenseModal from "../features/expensetable/Components/AddExpenseModal";
import { Button } from "./ui/button";

interface TopBarProps {
  currentPage: string;
  AddExpenseClick: () => void;
  AddSettleUpClick: () => void;
}

function TopBar({ currentPage, AddSettleUpClick }: TopBarProps) {
  return (
    <div className="h-16 w-full flex justify-around items-center border-b-[.5px] border-slate-300 sm:px-6 xl:w-[32rem] ">
      <h2 className="font-semibold w-16 md:w-32">{currentPage}</h2>
      <div>
        <AddExpenseModal />
        <Button className="ml-2 sm:ml-4 " onClick={AddSettleUpClick}>
          Settle up
        </Button>
      </div>
    </div>
  );
}

export default TopBar;
