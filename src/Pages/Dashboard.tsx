import TopBar from "../Components/TopBar";

function Dashboard() {

  const AddExpenseClick = () => {

  }

  const AddSettleUpClick = () => {

  }
  
  return (
    <div className="w-full" >
      <TopBar currentPage={"Dashboard"} AddExpenseClick={AddExpenseClick} AddSettleUpClick={AddSettleUpClick}/>
    </div>
  );
}

export default Dashboard;
