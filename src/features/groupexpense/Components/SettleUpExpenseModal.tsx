import { useState } from "react";
import { useLocation } from "react-router";
import { db } from "../../../firebase/firebaseconfig";
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { useCalculateBalanceSummary } from "../../balancesummary/hooks/useCalculateBalanceSummary";
import { useFetchExpensesForGroupQuery } from "../groupexpenseTableSlice";
import { useFetchExpensesForBalanceSummaryGroupQuery } from "../../balancesummary/balanceSummarySlice";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Avatar, AvatarFallback } from "../../../Components/ui/avatar";
import { Button } from "../../../Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../Components/ui/dialog";

function SettleUpExpenseModal() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const { groupId } = useAppSelector((state) => state.groupId.groupId);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { refetch: refetchExpensesForGroup } =
    useFetchExpensesForGroupQuery(groupId);
  const { refetch: refetchBalanceSummary } =
    useFetchExpensesForBalanceSummaryGroupQuery(groupId);

  const { balanceArray } = useCalculateBalanceSummary(groupId);

  const settleUpClick = async () => {
    const userGroupsRef = collection(db, "userGroups");
    const expensesRef = collection(userGroupsRef, groupId, "expenses");
    // Create the query to find documents with settled_up as false
    const queryExpenses = query(expensesRef, where("settled_up", "==", false));
    try {
      // Get the documents that match the query
      const querySnapshot = await getDocs(queryExpenses);
      // Iterate over the documents in the query snapshot and update settled_up to true
      querySnapshot.forEach(async (docSnapshot) => {
        const docRef = doc(expensesRef, docSnapshot.id);
        await updateDoc(docRef, {
          settled_up: true,
        });
      });
      refetchExpensesForGroup();
      refetchBalanceSummary();
      setOpen(false);
    } catch (error) {
      console.error("Error updating settled_up:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2">Settle up</Button>
      </DialogTrigger>
      {location.pathname == `/group/${groupId}` ? (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settle Up</DialogTitle>
            <DialogDescription>
              If you have settled up outside of EvenShare, you can record it
              here
            </DialogDescription>
            {balanceArray[0]?.userString !== "All people are settled up" ? (
              balanceArray?.map((statement, i) => (
                <div key={i} className="flex flex-col items-center mt-4">
                  <div className="flex justify-center items-center gap-3 mt-4">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback>
                        {statement?.userString?.split(" ")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <ArrowRightOutlined />
                    <Avatar className="w-20 h-20">
                      <AvatarFallback>
                        {statement?.userString?.split(" ")[2]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h2 className="text-xl mt-4">
                    {statement.userString.split("owes").join("paid")}
                  </h2>
                  <h2 className="text-xl mt-1">{"$" + statement.userNumber}</h2>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center mt-4">
                <h2 className="text-xl my-8 ">{balanceArray[0]?.userString}</h2>
              </div>
            )}
          </DialogHeader>

          <DialogFooter style={{ justifyContent: "center", width: "100%" }}>
            <Button style={{ width: "100%" }} onClick={settleUpClick}>
              Settle up expenses
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="mx-3">
              <DialogDescription className="text-lg">
                Please navigate to the group you would like to settle up with.
              </DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default SettleUpExpenseModal;
