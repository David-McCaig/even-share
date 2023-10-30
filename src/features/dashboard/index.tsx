import PieChart from "./Components/PieChart";
import { useCreateDataStructureForUserTotals } from "./hooks/useCreateDataStructureForUserTotals";

function DashBoard() {
  const { totalUserExpensesData } = useCreateDataStructureForUserTotals();

  return (
    <main className="w-full flex flex-col items-center ">
      <header className="h-16 w-full flex justify-around items-center border-b-[.5px] border-slate-300 sm:px-6 xl:w-[32rem] ">
        <h3 className="my-4 font-medium text-xl">
          Group Expense Contributions
        </h3>
      </header>
      {totalUserExpensesData?.map((groupData) => (
        <div key={groupData.id}>
          <PieChart
            chartData={{
              labels: groupData?.user_group_totals.map(
                (data) =>
                  `${data?.user_expense_name} - $${data?.user_expense_amount}`
              ),
              datasets: [
                {
                  label: `Users contribution`,
                  data: groupData?.user_group_totals.map(
                    (data) => data?.user_expense_amount
                  ),
                  backgroundColor: ["#bbf7d0", "#fbcfe8", "#a5f3fc"],
                  borderWidth: 0,
                },
              ],
            }}
            groupName={groupData.user_group_name}
          />
        </div>
      ))}
    </main>
  );
}

export default DashBoard;
