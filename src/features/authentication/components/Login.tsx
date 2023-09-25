import { useState } from "react";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn.js";
import { useGoogleGetSignInResult } from "../hooks/useGoogleGetSignInResult.js";
import { useSignInEmailPassword } from "../hooks/useSignInEmailPassword.js";
import { useSignedinDispatchUserInfo } from "../hooks/useSignedinDispatchUserInfo.js";
import { Link } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { AuthValues } from "../../../types.tsx";

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
    googleSignIn()
  };

  //custom hooks for authentication 
  const { googleSignIn } = useGoogleSignIn(setAuthenticating, setErrorMessage);
  useGoogleGetSignInResult(setAuthenticating);
  const { passwordErrorMessage, signInWithEmailPassword } = useSignInEmailPassword(setAuthenticating);
  useSignedinDispatchUserInfo();

  if (authenticating) {
    return (
      <div className="h-screen w-full bg-primary-bg-color ">
        <div className="flex justify-center items-center h-full bg-primary-bg-color">
          <img
            className="h-16 w-16 bg-primary-bg-color"
            src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
            alt=""
          />
        </div>
      </div>
    );
  }

  return (
    <section className="antialiased h-screen w-full flex justify-center items-center ">
      <div className="sm:mx-px sm:w-full w-11/12  max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300 ">
        <h1 className="text-4xl font-medium text-center">Login</h1>

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
            <span>Login with Google</span>
          </button>
        </div>

        <Formik
          initialValues={{
            password: "",
            email: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values: AuthValues) => {
            signInWithEmailPassword(values);
            setErrorMessage(passwordErrorMessage)
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
                    <button className="font-medium text-indigo-600">
                      Forgot Password?
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3h7a3 3 0 013-3v1"
                    />
                  </svg>
                  <span>Login</span>
                </button>
                <p className="text-center">
                  Not registered yet?{" "}
                  <Link
                    to="/signup"
                    className="text-indigo-600 font-medium inline-flex space-x-1 items-center"
                  >
                    <span>Register now </span>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </span>
                  </Link>
                </p>
              </div>
              {errorMessage || passwordErrorMessage && (
                <div className="w-full mt-6 rounded border border-red-400">
                  <p className=" text-red-500 text-center py-2 font-medium">
                    {errorMessage || passwordErrorMessage}
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
