import { Plus } from "lucide-react";
import { useState } from "react";
import { useFetchUserGroupsQuery } from "../groupexpenseTableSlice";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { useSetAddExpenseToGroupMutation } from "../groupexpenseTableSlice";
import { Timestamp } from "firebase/firestore";
import { useFormik } from "formik";
import * as Yup from "yup";
import { v4 as uuid } from "uuid"
import DropDownMenu from "../../../Components/DropDownMenu";
import { Button } from "../../../Components/ui/button";
import { Input } from "../../../Components/ui/input";
import { Label } from "../../../Components/ui/label";
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
  const recentActivityId = uuid()
  // Create a timestamp for the current date and time
  const createdAt = {
    seconds: Timestamp.now().seconds,
    nanoseconds: Timestamp.now().nanoseconds,
  };

  const userInfo = useAppSelector(selectUser);
  const userEmail = userInfo?.email;
  const {data:userExpenseGroups} = useFetchUserGroupsQuery(userEmail);
 

  const [userExpenseName] = useState(userInfo.displayName);

  const [setAddExpenseToGroup] = useSetAddExpenseToGroupMutation();
  const [open, setOpen] = useState(false);

  const OpenModalClick = () => {
    setOpen(true);
    formik.values.groupId = "";
    formik.values.userExpenseDescription = "";
    formik.values.userExpenseAmount = "";
  };

  // Define a validation schema using Yup
  const validationSchema = Yup.object({
    userExpenseDescription: Yup.string().required("Description is required"),
    userExpenseAmount: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be greater than zero")
      .required("Price is required"),
    groupId: Yup.string().required("Group is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      userExpenseDescription: "",
      userExpenseAmount: "",
      groupId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const expenseGroupsArray = userExpenseGroups?.find((group) => group.id === values.groupId)?.user_group_email
      
      const userExpenseAmountNumber = parseFloat(values.userExpenseAmount);
      setAddExpenseToGroup({
        groupId: values.groupId,
        userExpenseAmountNumber,
        userExpenseDescription: values.userExpenseDescription,
        userExpenseName,
        settledUp: false,
        createdAt,
        expenseGroupsArray,
        recentActivityId
      });
      setOpen(false); // Close the modal after submission
    },
    validateOnChange: false,
    validateOnBlur: false,
  });
  
  // Handler for selecting a group from the dropdown menu
  const handleGroupChange = (selectedData: { id: string }) => {
    formik.setFieldValue("groupId", selectedData.id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="add-expense-trigger" onClick={OpenModalClick}><Plus size={16} aria-hidden="true" /><span>Add Expense</span></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <span className="modal-icon"><Plus size={22} aria-hidden="true" /></span>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              Add a shared expense. We’ll work out who owes what.
            </DialogDescription>
          </DialogHeader>
          <div className="modal-fields">
            <div className="modal-field">
              <Label htmlFor="userExpenseDescription">Description</Label>
              <Input
                id="userExpenseDescription"
                name="userExpenseDescription"
                autoComplete="off"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.userExpenseDescription}
                placeholder="e.g. Dinner, groceries, or a taxi"
                className="col-span-3"
              />
            </div>
            {formik.touched.userExpenseDescription &&
            formik.errors.userExpenseDescription ? (
              <div className="text-red-500">
                {formik.errors.userExpenseDescription}
              </div>
            ) : null}
            <div className="modal-field">
              <Label htmlFor="userExpenseAmount">Amount</Label>
              <Input
                id="userExpenseAmount"
                name="userExpenseAmount"
                type="number"
                inputMode="decimal"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.userExpenseAmount}
                placeholder="$0.00"
                className="col-span-3"
              />
            </div>
            {formik.touched.userExpenseAmount &&
            formik.errors.userExpenseAmount ? (
              <div className="text-red-500 w-full">
                {formik.errors.userExpenseAmount}
              </div>
            ) : null}
            <DropDownMenu groupOnChange={handleGroupChange} />
          </div>
          {formik.touched.groupId && formik.errors.groupId ? (
            <div className="text-red-500 w-full">{formik.errors.groupId}</div>
          ) : null}

          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button className="modal-primary" type="submit">Add Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddExpenseModal;
