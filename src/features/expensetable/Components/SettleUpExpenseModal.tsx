import { useState } from "react";
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
  
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2" >Settle up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            You can add an expense to the group here.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit">Add Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SettleUpExpenseModal;
