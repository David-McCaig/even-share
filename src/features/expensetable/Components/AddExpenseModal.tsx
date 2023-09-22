import { useState } from "react";
import { useFetchUserGroupsQuery } from "../expenseTableSlice";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { useSetAddExpenseToGroupMutation } from "../expenseTableSlice";
import { Timestamp } from "firebase/firestore";
import { useFormik } from "formik";
import * as Yup from "yup";
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
} from "../../../Components/ui/dialog";


function AddExpenseModal() {
  const createdAt = {
    seconds: Timestamp.now().seconds,
    nanoseconds: Timestamp.now().nanoseconds,
  };
  const userInfo = useAppSelector(selectUser);
  const userEmail = userInfo?.email;
  useFetchUserGroupsQuery(userEmail);

  
  const [userExpenseName] = useState(userInfo.displayName);

  const [setAddExpenseToGroup] = useSetAddExpenseToGroupMutation();

  const [open, setOpen] = useState(false);

  const OpenModalClick = () => {
    setOpen(true);
    formik.values.groupId = "";
    formik.values.userExpenseDescription = "";  
    formik.values.userExpenseAmount = "";
  }

  // Define a validation schema using Yup
  const validationSchema = Yup.object({
    
    userExpenseDescription: Yup.string().required("Description is required"),
    userExpenseAmount: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be greater than zero")
      .required("Price is required"),
      groupId: Yup.string().required("Group is required"),
  });
console.log(validationSchema)
  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      userExpenseDescription: "",
      userExpenseAmount: "",
      groupId: "",
    },
    validationSchema: validationSchema, 
    onSubmit: async (values) => {
      const userExpenseAmountNumber = parseFloat(values.userExpenseAmount);
      setAddExpenseToGroup({
        groupId: values.groupId,
        userExpenseAmountNumber,
        userExpenseDescription: values.userExpenseDescription,
        userExpenseName,
        createdAt,
      });
      setOpen(false);
    },
    validateOnChange: false, 
    validateOnBlur: false, 
  });

  const handleGroupChange = (selectedData: { id: string }) => {
    formik.setFieldValue("groupId", selectedData.id);
  };


  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={OpenModalClick} >Add Expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>You can add an expense to the group here.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Description</Label>
              <Input
                id="userExpenseDescription"
                name="userExpenseDescription"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.userExpenseDescription}
                placeholder="Enter a Description"
                className="col-span-3"
              />
            </div>
            {formik.touched.userExpenseDescription && formik.errors.userExpenseDescription ? (
                <div className="text-red-500">{formik.errors.userExpenseDescription}</div>
              ) : null}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Price</Label>
              <Input
                id="userExpenseAmount"
                name="userExpenseAmount"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.userExpenseAmount}
                placeholder="$0.00"
                className="col-span-3"
              />
            </div>
            {formik.touched.userExpenseAmount && formik.errors.userExpenseAmount ? (
                <div className="text-red-500 w-full">{formik.errors.userExpenseAmount}</div>
              ) : null}
            <DropDownMenu groupOnChange={handleGroupChange} />
          </div>
          {formik.touched.groupId && formik.errors.groupId ? (
                <div className="text-red-500 w-full">{formik.errors.groupId}</div>
              ) : null}
          
          <DialogFooter>
              <Button  type="submit">Add Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddExpenseModal;
