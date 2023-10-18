import { useState } from "react";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";
import { useGoogleGetSignInResult } from "../hooks/useGoogleGetSignInResult.js";
import { useSignUpEmailPassword } from "../hooks/useSignUpEmailAndPassword.js";
import { useSignedinDispatchUserInfo } from "../hooks/useSignedinDispatchUserInfo.js";
import { Link } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { AuthValues } from "../../../types.tsx";
import LoadingDots from "../../../Components/LoadingDots";
import { Button } from "../../../Components/ui/button.tsx";

function LoginPage() {
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const googleSignInClick = () => {
    if (errorMessage !== "") setErrorMessage("");
    googleSignIn();
  };

  //custom hooks for authentication
  const { googleSignIn } = useGoogleSignIn(setAuthenticating, setErrorMessage);
  useGoogleGetSignInResult(setAuthenticating);
  const { passwordErrorMessage, signUpEmailPassword } =
    useSignUpEmailPassword(setAuthenticating);
  useSignedinDispatchUserInfo();

  if (authenticating) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingDots />
      </div>
    );
  }

  return (
    <section className="antialiased h-screen w-full flex justify-center items-center ">
      <div className="sm:mx-px sm:w-full w-11/12  max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300 ">
        <h1 className="text-4xl font-medium text-center">Sign Up</h1>

        <div className="my-5">
          <button
            className="w-full text-center py-3 my-3 border flex space-x-2 items-center justify-center border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
            disabled={authenticating}
            onClick={googleSignInClick}
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              className="w-6 h-6"
              alt=""
            />{" "}
            <span>Sign Up with Google</span>
          </button>
        </div>

        <Formik
          initialValues={{
            password: "",
            email: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values: AuthValues) => {
            signUpEmailPassword(values);
            setErrorMessage(passwordErrorMessage);
          }}
        >
          {({ errors, touched }) => (
            <Form className="my-10">
              <div className="flex flex-col space-y-5">
                <label>
                  <p className="font-medium text-slate-700 pb-2">
                    Email address
                  </p>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className={`w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none ${
                      errors.email && touched.email ? "border-red-500" : ""
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500">{errors.email}</p>
                  )}
                </label>
                <label>
                  <p className="font-medium text-slate-700 pb-2">Password</p>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    className={`w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Enter your password"
                  />
                  {errors.password && touched.password && (
                    <p className="text-red-500">{errors.password}</p>
                  )}
                </label>
                <div className="flex flex-row justify-between">
                  <div>
                    <label className="">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 mr-1 border-slate-200 focus:bg-indigo-600"
                      />
                      Remember me
                    </label>
                  </div>
                  <div>
                    <button className="font-medium text-primary-button-color">
                      Forgot Password?
                    </button>
                  </div>
                </div>
                <Button>
                  <span>Sign Up</span>
                </Button>
                <p className="text-center">
                  Already registered{" "}
                  <Link
                    to="/login"
                    className="text-primary-button-color font-medium inline-flex space-x-1 items-center"
                  >
                    <span>Log In </span>
                  </Link>
                </p>
              </div>
              {errorMessage && (
                <div className="w-full mt-6 rounded border border-red-400">
                  <p className=" text-red-500 text-center py-2 font-medium">
                    {errorMessage}
                  </p>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}

export default LoginPage;
