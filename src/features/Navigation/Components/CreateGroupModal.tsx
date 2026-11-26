import { useState } from "react";
import { Users, Plus, X } from "lucide-react";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { useSetAddGroupMutation } from "../../groupexpense/groupexpenseTableSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import { Button } from "../../../Components/ui/button";
import { Input } from "../../../Components/ui/input";
import { Label } from "../../../Components/ui/label";

function CreateGroupModal() {
  const userInfo = useAppSelector(selectUser);

  const [open, setOpen] = useState(false);

  const [setAddGroup] = useSetAddGroupMutation();

  const openModalClick = () => {
    setOpen(true);
    formik.resetForm();
  };

  const addGroupMember = () => {
    formik.setFieldValue("emails", [...formik.values.emails, ""]);
  };

  const removeGroupMember = (index: number) => {
    formik.setFieldValue("emails", formik.values.emails.filter((_, memberIndex) => memberIndex !== index));
  };

  const validationSchema = Yup.object().shape({
    emails: Yup.array()
      .of(Yup.string().email("Invalid email format"))
      .min(1, "At least one email is required")
      .required("Emails are required"),
    groupName: Yup.string().required("Group name is required"),
  });

  const formik = useFormik({
    initialValues: {
      emails: [""],
      groupName: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const emailArray = [...values.emails, userInfo.email];
      const groupName = values.groupName;
      addGroup(emailArray, groupName);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const addGroup = async (emailArray: string[], groupName: string) => {
    setAddGroup({
      user_group_email: emailArray,
      user_group_name: groupName,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={openModalClick} asChild>
        <button type="button" className="create-group-trigger">+ <span>New Group</span></button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <span className="modal-icon"><Users size={22} aria-hidden="true" /></span>
            <DialogTitle>Create a new group</DialogTitle>
            <DialogDescription>
              A shared space for trips, home, and everyday expenses.
            </DialogDescription>
          </DialogHeader>

          <div className="modal-fields">
          <div className="modal-field">
            <Label htmlFor="groupName">Group name</Label>
            <Input
              id="groupName"
              placeholder="e.g. Summer in Italy"
              name={`groupName`}
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.groupName}
              className="col-span-3"
            />
          </div>
          {formik.touched.groupName && formik.errors.groupName ? (
            <div className="text-red-500">{formik.errors.groupName}</div>
          ) : null}
          <div className="modal-member-list">
            <p className="modal-field-heading">Invite members</p>
            <p className="modal-hint">You’re automatically included in this group.</p>
            {formik.values.emails.map((email, index) => (
              <div key={index}>
                <div className="modal-member-row">
                  <Label className="sr-only" htmlFor={`member-email-${index}`}>Member {index + 1} email</Label>
                  <Input
                    id={`member-email-${index}`}
                    type="email"
                    placeholder="name@example.com"
                    name={`emails[${index}]`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={email}
                    className="col-span-3"
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove member ${index + 1}`}
                    type="button"
                    onClick={() => removeGroupMember(index)}
                  >
                    <X size={16} aria-hidden="true" />
                  </Button>
                </div>
                {formik.touched.emails &&
                formik.touched.emails &&
                formik.errors.emails &&
                formik.errors.emails[index] ? (
                  <div className="text-red-500">
                    {formik.errors.emails[index]}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <Button type="button" variant="ghost" className="modal-add-member" onClick={addGroupMember}><Plus size={16} aria-hidden="true" />Add another member</Button>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button className="modal-primary" type="submit">Create Group</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateGroupModal;
