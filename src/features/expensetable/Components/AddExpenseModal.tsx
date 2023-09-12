import { useState } from "react";
import { useFetchUserGroupsQuery } from "../expenseTableSlice";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { useSetAddExpenseToGroupMutation } from "../expenseTableSlice";
import DropDownMenu from "../../../Components/DropDownMenu";
import { Button } from "../../../Components/ui/button";
import { Input } from "../../../Components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
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


function AddExpenseModal() {
  const userInfo = useAppSelector(selectUser);
  const userEmail = userInfo?.email;
  useFetchUserGroupsQuery(userEmail);

  const [groupId, setGroupId] = useState("");
  const [userExpenseAmount, setUserExpenseAmount] = useState("");
  const [userExpenseDescription, setUserExpenseDescription] = useState("");
  const [userExpenseName] = useState(userInfo.displayName);

  const [setAddExpenseToGroup] = useSetAddExpenseToGroupMutation();

  const addExpenseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddExpenseToGroup({
      groupId,
      userExpenseAmount,
      userExpenseDescription,
      userExpenseName,
    });
  };

  const handleGroupChange = (selectedData: { id: string }) => {
    setGroupId(selectedData.id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={addExpenseSubmit}>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              You can add an expense to the group here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Description</Label>
              <Input
                onChange={(e) => setUserExpenseDescription(e.target.value)}
                id="description"
                value={userExpenseDescription}
                placeholder="Enter a Description"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Price</Label>
              <Input
                onChange={(e) => setUserExpenseAmount(e.target.value)}
                id="username"
                value={userExpenseAmount}
                placeholder="$0.00"
                className="col-span-3"
              />
            </div>
            <DropDownMenu groupOnChange={handleGroupChange} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Add Expense</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddExpenseModal;
