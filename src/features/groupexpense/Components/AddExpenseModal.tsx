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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../Components/ui/select";
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
  const {data:userExpenseGroups} = useFetchUserGroupsQuery(userEmail);
 


  const [setAddExpenseToGroup] = useSetAddExpenseToGroupMutation();
  const [open, setOpen] = useState(false);

  const OpenModalClick = () => {
    setOpen(true);
    formik.resetForm();
  };

  // Define a validation schema using Yup
  const validationSchema = Yup.object({
    userExpenseDescription: Yup.string().required("Description is required"),
    userExpenseAmount: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be greater than zero")
      .required("Price is required"),
    groupId: Yup.string().required("Group is required"),
    paidBy: Yup.string().email().required("Select who paid"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      userExpenseDescription: "",
      userExpenseAmount: "",
      groupId: "",
      paidBy: String(userEmail || ""),
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const expenseGroupsArray = userExpenseGroups?.find(group => group.id === values.groupId)?.user_group_email;
      if (!expenseGroupsArray?.includes(values.paidBy)) {
        formik.setFieldError("paidBy", "Choose a member of this group");
        return;
      }
      const localName = values.paidBy.split("@")[0];
      const userExpenseName = values.paidBy === userEmail
        ? userInfo.displayName || userEmail
        : localName.charAt(0).toUpperCase() + localName.slice(1);
      try {
        await setAddExpenseToGroup({
          groupId: values.groupId,
          userExpenseAmountNumber: Number(values.userExpenseAmount),
          userExpenseDescription: values.userExpenseDescription,
          userExpenseName,
          userExpenseEmail: values.paidBy,
          settledUp: false,
          createdAt: Timestamp.now(),
          expenseGroupsArray,
          recentActivityId: uuid(),
        }).unwrap();
        setOpen(false);
      } catch {
        formik.setStatus("Unable to save this expense. Please try again.");
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
  });
  
  // Handler for selecting a group from the dropdown menu
  const handleGroupChange = (selectedData: { id: string }) => {
    formik.setFieldValue("groupId", selectedData.id);
    formik.setFieldValue("paidBy", userEmail);
  };

  const selectedGroup = userExpenseGroups?.find(group => group.id === formik.values.groupId);

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
            <div className="modal-field">
              <Label htmlFor="paidBy">Paid by</Label>
              <Select value={formik.values.paidBy} onValueChange={value => formik.setFieldValue("paidBy", value)} disabled={!selectedGroup || formik.isSubmitting}>
                <SelectTrigger id="paidBy" aria-invalid={!!formik.errors.paidBy} aria-describedby={formik.errors.paidBy ? "paidBy-error" : undefined}>
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {[...new Set(selectedGroup?.user_group_email || [])].map(email => (
                    <SelectItem key={email} value={email}>{email === userEmail ? `You (${email})` : email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.paidBy && formik.errors.paidBy && <p id="paidBy-error" role="alert" className="text-red-500">{formik.errors.paidBy}</p>}
            </div>
          </div>
          {formik.touched.groupId && formik.errors.groupId ? (
            <div className="text-red-500 w-full">{formik.errors.groupId}</div>
          ) : null}

          {formik.status && <p role="alert" className="text-red-500">{formik.status}</p>}
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button className="modal-primary" type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting ? "Saving…" : "Add Expense"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddExpenseModal;
