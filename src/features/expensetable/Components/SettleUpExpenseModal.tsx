import { useState, useEffect } from "react";
import { db } from "../../../utils/firebaseconfig";
import { collection, query, where, doc, updateDoc, getDocs } from "firebase/firestore";
import {
  calculateOwes,
  createUserObject,
  generateBalanceSettleUpStatement,
} from "../../../utils/utils";
import { useFetchUserGroupQuery } from "../expenseTableSlice";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import {ArrowRightOutlined } from "@ant-design/icons";
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

interface BalanceSummary {
  userString: string;
  userNumber: number;
}

function SettleUpExpenseModal() {
  const [open, setOpen] = useState(false);

  const [balanceSettleUpStatement, setBalanceSettleUpStatement] = useState<
    BalanceSummary[]
  >([]);

  const { groupId } = useAppSelector((state) => state.groupId.groupId);
  const user = useAppSelector(selectUser);
  const { data } = useFetchUserGroupQuery(groupId);
  console.log(groupId);

  useEffect(() => {
    if (data) {
      const userObject = createUserObject(data, user.displayName);
      const result = calculateOwes(userObject, user.displayName);
      const balanceSettleUpStatementResult =
        generateBalanceSettleUpStatement(result);
      setBalanceSettleUpStatement(
        balanceSettleUpStatementResult as BalanceSummary[]
      );
      console.log(balanceSettleUpStatement);
    }
  }, [data]);

  const settleUpClick = async () => {
    const userGroupsRef = collection(db, 'userGroups');
    const expensesRef = collection(userGroupsRef, groupId, 'expenses');
  
    // Create the query to find documents with settled_up as false
    const queryExpenses = query(expensesRef, where('settled_up', '==', false));
  
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
      setOpen(false);
    } catch (error) {
      console.error('Error updating settled_up:', error);
    }
  };
  return (
    
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2">Settle up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settle Up</DialogTitle>
          <DialogDescription>
            If you have settled up outside of EvenSahre, you can record it here
            {balanceSettleUpStatement?.map((statement) => (
              <div className="flex flex-col items-center mt-4">
                <div className="flex justify-center items-center gap-3  ">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback>{statement?.userString?.split(" ")[0]}</AvatarFallback>
                  </Avatar>
                  <ArrowRightOutlined />
                  <Avatar className="w-20 h-20">
                    <AvatarFallback  >{statement?.userString?.split(" ")[2]}</AvatarFallback>
                  </Avatar>
                 
                </div>
                <h2 className="text-xl mt-4">{statement.userString}</h2>
                <h2 className="text-xl mt-1">{"$" + statement.userNumber}</h2>
              </div>
            ))}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter style={{justifyContent:'center', width:'100%'}}>
        {/* <Button type="submit">Cancel</Button> */}
          <Button style={{ width:'100%'}} onClick={settleUpClick} >Settle up expenses</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
  );
}

export default SettleUpExpenseModal;
