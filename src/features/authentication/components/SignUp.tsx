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
    <section className="w-full flex justify-center">
      {/* <form onSubmit={onSubmit}> */}
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
          <Form>
            <div className="h-screen mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome to EvenShare! Please Sign up here
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <label>
                  <p className="font-medium text-slate-700 pb-2">Email</p>
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
                </div>
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

                <Button className="mb-4 mt-2">Sign Up</Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className=" relative flex justify-center text-sm uppercase">
                    <Link to="/login" className="text-primary-button-color">
                      Sign In
                    </Link>
                    <span className="bg-background px-2 text-muted-foreground ">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="my-5">
                  <button
                    className="w-full h-12 text-center border flex space-x-2 items-center justify-center opacity-90 border-slate-400 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
                    disabled={authenticating}
                    onClick={googleSignInClick}
                  >
                    <img
                      src="https://www.svgrepo.com/show/355037/google.svg"
                      className="w-6 h-6"
                      alt=""
                    />{" "}
                    <span>Sign up</span>
                  </button>
                </div>
              </div>
              <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link
                  to="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
              {/* </form> */}
            </div>
            {errorMessage ||
              (passwordErrorMessage && (
                <div className="w-full mt-6 rounded border border-red-400">
                  <p className=" text-red-500 text-center py-2 font-medium">
                    {errorMessage || passwordErrorMessage}
                  </p>
                </div>
              ))}
          </Form>
        )}
      </Formik>
    </section>
  );
}

export default LoginPage;
