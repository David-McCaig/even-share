import { useState } from "react";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase/firebaseconfig";
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
} from "../../../Components/ui/dialog";
import { Button } from "../../../Components/ui/button";
import { Input } from "../../../Components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";

function CreateGroupModal() {
  const userInfo = useAppSelector(selectUser);

  const [groupMemberEmails, setGroupMemberEmails] = useState([""]);
  const [open, setOpen] = useState(false);

  const openModalClick = () => {
    setOpen(true)
    formik.values.groupName = "";
    formik.values.emails = [""];
    setGroupMemberEmails([""]);
  }

  const addGroupMember = () => {
    setGroupMemberEmails([...groupMemberEmails, ""]);
  };

  const removeGroupMember = (index: number) => {
    const updatedEmails = [...groupMemberEmails];
    updatedEmails.splice(index, 1);
    setGroupMemberEmails(updatedEmails);
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
      emails: groupMemberEmails,
      groupName: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const emailArray = values.emails;
      emailArray.push(userInfo.email);
      const groupName = values.groupName;
      addGroup(emailArray, groupName);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const addGroup = async (emailArray: string[], groupName: string) => {
    await addDoc(collection(db, "userGroups"), {
      user_group_email: emailArray,
      user_group_name: groupName,
    });
    setGroupMemberEmails([""]);
    setOpen(false)
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={openModalClick} asChild>
        <div className="cursor-pointer"> Create Group +</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new group</DialogTitle>
            <DialogDescription>
              Add emails down below for people that you would like to share
              expenses with
            </DialogDescription>
          </DialogHeader>

          <div className="flex mt-6  items-center">
            <Label className="text-left mr-3">Group</Label>
            <Input
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
          <div className="grid gap-4 py-4">
            {groupMemberEmails.map((email, index) => (
              <div key={index}>
                <div className="flex items-center gap-4" >
                  <Label className="text-right">Email</Label>
                  <Input
                    name={`emails[${index}]`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.emails[index]}
                    className="col-span-3"
                  />

                  <Button
                    className="bg-slate-800"
                    type="button"
                    onClick={() => removeGroupMember(index)}
                  >
                    Remove
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
          <DialogFooter>
            <Button type="button" onClick={addGroupMember}>
              Add Group Member
            </Button>
            <Button type="submit">Create Group</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateGroupModal;
