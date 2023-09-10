import ExpenseTableRow from "./Components/ExpenseTableRow"
import AddExpenseModal from "./Components/AddExpenseModal"
function Index() {
  return (
    <>
    <ExpenseTableRow billDescription={"Power Bill"} billDate={"March 28th 2023"} billAmount={"$200"}/>
    <AddExpenseModal/>
    </>
  )
}

export default Index