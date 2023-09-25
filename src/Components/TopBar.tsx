import AddExpenseModal from "../features/expensetable/Components/AddExpenseModal";
import SettleUpExpenseModal from "../features/expensetable/Components/SettleUpExpenseModal";

interface TopBarProps {
  currentPage: string;
}

function TopBar({ currentPage }: TopBarProps) {
  return (
    <div className="h-16 w-full flex justify-around items-center border-b-[.5px] border-slate-300 sm:px-6 xl:w-[32rem] ">
      <h2 className="font-semibold w-16 md:w-32">{currentPage}</h2>
      <div>
        <AddExpenseModal />
        <SettleUpExpenseModal/>
      </div>
    </div>
  );
}

export default TopBar;
