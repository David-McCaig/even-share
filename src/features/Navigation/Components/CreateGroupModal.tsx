import { useState } from "react";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../utils/firebaseconfig";
import { useFormik } from "formik";
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

  const addGroupMember = () => {
    setGroupMemberEmails([...groupMemberEmails, ""]); 
  };

  const removeGroupMember = (index:number) => {
    const updatedEmails = [...groupMemberEmails];
    updatedEmails.splice(index, 1); 
    setGroupMemberEmails(updatedEmails);
  };

  const formik = useFormik({
    initialValues: {
      emails: groupMemberEmails,
      groupName: "",
    },
    onSubmit: (values) => {
      const emailArray = values.emails;
      emailArray.push(userInfo.email);
      const groupName = values.groupName;
      console.log("Form submitted with emails:", {
        user_group_email: emailArray,
        user_group_name: values.groupName,
      });
      addGroup(emailArray,groupName);
    },
  });

  const addGroup = async(emailArray:string[],groupName:string) => { 
    
    await addDoc(collection(db, "userGroups"), {
        user_group_email: emailArray,
        user_group_name: groupName,
      });
      setGroupMemberEmails([""]);
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
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
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.groupName}
              className="col-span-3"
              />
            </div>
          <div className="grid gap-4 py-4">
            {groupMemberEmails.map((email, index) => (
              <div className="flex items-center gap-4" key={index}>
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
