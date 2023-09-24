import { useState } from "react";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { useSetAddExpenseToGroupMutation } from "../../expensetable/expenseTableSlice";
import { Timestamp } from "firebase/firestore";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../../../Components/ui/button";
import { Input } from "../../../Components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";

function Profile() {
  const createdAt = {
    seconds: Timestamp.now().seconds,
    nanoseconds: Timestamp.now().nanoseconds,
  };
  const userInfo = useAppSelector(selectUser);
  
  const [userExpenseName] = useState(userInfo.displayName);

  const [setAddExpenseToGroup] = useSetAddExpenseToGroupMutation();

  // Define a validation schema using Yup
  const validationSchema = Yup.object({
    userName: Yup.string().required("Description is required"),
    userEmail: Yup.string().required("Price is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      userName: userInfo.displayName,
      userEmail: userInfo.email,

    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const userExpenseAmountNumber = parseFloat(values.userEmail);
      setAddExpenseToGroup({
        userExpenseAmountNumber,
        userExpenseDescription: values.userName,
        userExpenseName,
        settledUp: false,
        createdAt,
      });
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

    const handleGroupChange = (selectedData: { id: string }) => {
      formik.setFieldValue("groupId", selectedData.id);
    };
  return (
    <section className="">
        <h1 className="text-2xl flex justify-center items-center mt-12">Profile</h1>
        
      <form className="px-16 " onSubmit={formik.handleSubmit}>
      <p className="mt-4 font-medium">You can update your profile info here</p>
        <div className="">
          <div className="mt-6">
            <Label className="text-left text-lg">Username</Label>
            <Input
              id="userName"
              name="userName"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.userName}
              placeholder={userInfo.displayName}
              className="col-span-3 mt-1"
            />
          </div>
          {formik.touched.userName &&
          formik.errors.userName ? (
            <div className="text-red-500">
              {formik.errors.userName}
            </div>
          ) : null}
          <div className="mt-4">
            <Label className="text-left text-lg">Email</Label>
            <Input
              id="userEmail"
              name="userEmail"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.userEmail}
              placeholder={userInfo.email}
              className="col-span-3 mt-1 mb-8"
            />
          </div>
        </div>
        <Button style={{ width: "100%" }} type="submit">Save</Button>
      </form>
    </section>
  );
}

export default Profile;
