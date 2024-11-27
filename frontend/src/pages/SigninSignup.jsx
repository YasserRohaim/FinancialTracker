import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import "./Auth.css";
import { signupUser, loginUser } from "../services/api";

const currencyOptions = ["USD", "EUR", "JPY", "AED", "EGP", "SAR"];

const SigninSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // For navigation

  // Validation schemas
  const signinSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const signupSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(8, "Minimum length is 8").required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    budget: yup
      .number()
      .positive("Budget must be a positive number")
      .integer("Budget must be an integer")
      .required("Budget is required"),
    preferredCurrency: yup
      .mixed()
      .oneOf(currencyOptions, "Invalid currency")
      .required("Preferred currency is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      budget: "",
      preferredCurrency: "",
    },
    validationSchema: isSignup ? signupSchema : signinSchema,
    onSubmit: async (values) => {
      try {
        let response;
        if (isSignup) {
          response = await signupUser({
            name: values.name,
            email: values.email,
            password: values.password,
            budget: values.budget,
            preferredCurrency: values.preferredCurrency,
          });
          setMessage("Signup successful! Redirecting to transactions...");
        } else {
          response = await loginUser({
            email: values.email,
            password: values.password,
          });
          setMessage("Login successful! Redirecting to transactions...");
        }

        // Save token to localStorage
        const token = response.data.token;
        localStorage.setItem("authToken", token);

        // Redirect to transactions page
        navigate("/transactions");
      } catch (error) {
        setMessage(error.response?.data?.message || "Something went wrong.");
      }
    },
  });

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setMessage("");
    formik.resetForm();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isSignup ? "Sign Up" : "Sign In"}</h2>
        <form onSubmit={formik.handleSubmit}>
          {isSignup && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="error">{formik.errors.name}</p>
              )}
              <input
                type="number"
                name="budget"
                placeholder="Budget"
                value={formik.values.budget}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.budget && formik.errors.budget && (
                <p className="error">{formik.errors.budget}</p>
              )}
              <select
                name="preferredCurrency"
                value={formik.values.preferredCurrency}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Preferred Currency</option>
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              {formik.touched.preferredCurrency &&
                formik.errors.preferredCurrency && (
                  <p className="error">{formik.errors.preferredCurrency}</p>
                )}
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="error">{formik.errors.email}</p>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="error">{formik.errors.password}</p>
          )}
          {isSignup && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          )}
          {isSignup &&
            formik.touched.confirmPassword &&
            formik.errors.confirmPassword && (
              <p className="error">{formik.errors.confirmPassword}</p>
            )}
          <button type="submit">{isSignup ? "Sign Up" : "Sign In"}</button>
        </form>
        <p className="auth-toggle">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={toggleMode}>
            {isSignup ? "Sign In" : "Sign Up"}
          </span>
        </p>
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
};

export default SigninSignup;
