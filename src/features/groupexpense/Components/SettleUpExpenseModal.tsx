import { Link } from "react-router-dom";
import { selectUser } from "../../authentication/userSlice";
import { useFetchUserGroupsQuery } from "../groupexpenseTableSlice";
import { CheckCircle2, ArrowRight, Users } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router";
import { useFetchExpensesForGroupQuery } from "../groupexpenseTableSlice";
import { useFetchExpensesForBalanceSummaryGroupQuery } from "../../balancesummary/balanceSummarySlice";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { useCalculateBalanceSummary } from "../../balancesummary/hooks/useCalculateBalanceSummary";
import { db } from "../../../firebase/firebaseconfig";
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
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
  DialogClose,
} from "../../../Components/ui/dialog";

function SettleUpExpenseModal() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const user = useAppSelector(selectUser);
  const { data: groups, isLoading: groupsLoading, isError: groupsError } = useFetchUserGroupsQuery(user.email);

  const { groupId } = useAppSelector((state) => state.groupId.groupId);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { refetch: refetchExpensesForGroup } =
    useFetchExpensesForGroupQuery(groupId);
  const { refetch: refetchBalanceSummary } =
    useFetchExpensesForBalanceSummaryGroupQuery(groupId);

  const { balanceArray, balanceError, isLoading } = useCalculateBalanceSummary(groupId);

  const settleUpClick = async () => {
    if (balanceError || isLoading) return;
    const userGroupsRef = collection(db, "userGroups");
    const expensesRef = collection(userGroupsRef, groupId, "expenses");
    // Create the query to find documents with settled_up as false
    const queryExpenses = query(expensesRef, where("settled_up", "==", false));
    try {
      const loadingToast = toast.loading("Settling up expenses");
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
      toast.dismiss(loadingToast);
      toast.success("Expenses settled up");
      setOpen(false);
    } catch (error) {
      console.error("Error updating settled_up:", error);
    }
  };

  const changeOweToPaied = (string: string) => {
    const array = string.split(" ");

    if (array[1] === "owes" || array[1] === "owe") {
      array[1] = "paid";
      return array.join(" ");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="settle-expense-trigger"><CheckCircle2 size={16} aria-hidden="true" /><span>Settle Up</span></Button>
      </DialogTrigger>
      {location.pathname == `/group/${groupId}` ? (
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <span className="modal-icon"><CheckCircle2 size={22} aria-hidden="true" /></span>
            <DialogTitle>Settle Up</DialogTitle>
            <DialogDescription>
              Already paid outside EvenShare? Record the payments below to settle this group’s expenses.
            </DialogDescription>
          </DialogHeader>
          <div className="settlement-payments">
            {balanceError ? <p role="alert">{balanceError}</p> : isLoading ? <p role="status">Loading balances…</p> : balanceArray[0]?.userString !== "All people are settled up" ? (
              balanceArray?.map((statement, i) => (
                <div key={i} className="settlement-payment">
                  <div className="settlement-avatars" aria-hidden="true">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback>
                        {statement?.userString?.split(" ")[0]?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <ArrowRight size={16} />
                    <Avatar className="w-9 h-9">
                      <AvatarFallback>
                        {statement?.userString?.split(" ")[2]?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="settlement-payment-name">
                    {changeOweToPaied(statement.userString)}
                  </span>
                  <strong>${statement.userNumber.toFixed(2)}</strong>
                </div>
              ))
            ) : (
              <div className="settlement-empty">
                <CheckCircle2 size={28} aria-hidden="true" />
                <p>{balanceArray[0]?.userString}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button className="modal-primary" disabled={!!balanceError || isLoading} onClick={settleUpClick}>
              Record settlement
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <span className="modal-icon"><CheckCircle2 size={22} aria-hidden="true" /></span>
            <DialogTitle>Settle Up</DialogTitle>
            <DialogDescription>Choose a group to review its balances before recording a settlement.</DialogDescription>
          </DialogHeader>
          <div className="settlement-group-list">
            {groupsLoading ? <p role="status">Loading your groups…</p> : groupsError ? <p role="alert">Unable to load your groups. Please try again later.</p> : !groups?.length ? <p>Create a group and add shared expenses to get started.</p> : groups.map(group => <Link className="settlement-group-option" key={group.id} to={`/group/${group.id}`}><Users size={20} aria-hidden="true" /><span>{group.user_group_name}<small>{group.user_group_email?.length ?? 0} members</small></span><ArrowRight size={18} aria-hidden="true" /></Link>)}
          </div>
          <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose></DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default SettleUpExpenseModal;
