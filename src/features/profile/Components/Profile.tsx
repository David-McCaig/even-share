import { useState } from "react";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { getAuth, updateProfile, updateEmail} from "firebase/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Values } from "../../../types";
import { Button } from "../../../Components/ui/button";
import { Input } from "../../../Components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { toast } from "react-hot-toast";
function Profile() {

  const userInfo = useAppSelector(selectUser);
  const [error, setError] = useState<string | null>(null);
  // Define a validation schema using Yup
  const validationSchema = Yup.object({
    userName: Yup.string().required("Description is required"),
    userEmail: Yup.string().email("Invalid email").required("Email is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      userName: userInfo.displayName,
      userEmail: userInfo.email,

    },
    validationSchema: validationSchema,
    onSubmit: async (values: Values) => {
            const loadingToast = toast.loading("Updating profile...")

            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    await updateProfile(currentUser, {
                        displayName: values.userName,
                    });
                    await updateEmail(currentUser, values.userEmail);
                    toast.dismiss(loadingToast)
                    toast.success('Profile updated successfully!')
                } catch (error:any) {
                    console.log(error)
                    setError(error.message);
                }
            }
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center mt-16">
        <div className="text-red-500 text-2xl">
          {<p>"Server Error, Please try again later"</p> || error}
        </div>
      </div>
    );
    }


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
          {formik.touched.userEmail &&
          formik.errors.userEmail ? (
            <div className="text-red-500">
              {formik.errors.userEmail}
            </div>
          ) : null}
        </div>
        <Button style={{ width: "100%" }} type="submit">Save</Button>
      </form>
    </section>
  );
}

export default Profile;
