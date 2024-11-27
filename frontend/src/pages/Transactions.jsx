import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTransactions, createTransaction, deleteTransaction } from "../services/api";
import { useFormik } from "formik";
import * as yup from "yup";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import "./Transactions.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const currencyOptions = ["USD", "EUR", "JPY", "AED", "EGP", "SAR"];

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/signin");
      return;
    }
    fetchTransactions(token)
      .then((res) => setTransactions(res.data.transactions))
      .catch((err) => {
        setMessage("Failed to fetch transactions.");
        console.error(err);
      });
  }, [navigate]);

  useEffect(() => {
    const currencyTotals = transactions.reduce((acc, transaction) => {
      acc[transaction.original_currency] =
        (acc[transaction.original_currency] || 0) + transaction.amount;
      return acc;
    }, {});

    setChartData({
      labels: Object.keys(currencyTotals),
      datasets: [
        {
          data: Object.values(currencyTotals),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FFC107", "#8E44AD"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FFC107", "#8E44AD"],
        },
      ],
    });
  }, [transactions]);

  const formik = useFormik({
    initialValues: {
      amount: "",
      original_currency: "",
      transaction_date: "",
      description: "",
    },
    validationSchema: yup.object({
      amount: yup.number().required("Amount is required").positive("Amount must be positive."),
      original_currency: yup
        .string()
        .oneOf(currencyOptions, "Invalid currency")
        .required("Currency is required."),
      transaction_date: yup.date().max(new Date(), "Date cannot be in the future.").optional(),
      description: yup.string().max(500, "Description cannot exceed 500 characters."),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await createTransaction(values, token);
        setTransactions((prev) => [...prev, res.data.transaction]);
        resetForm();
        setMessage("Transaction added successfully!");
      } catch (err) {
        setMessage("Failed to add transaction.");
        console.error(err);
      }
    },
  });

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await deleteTransaction(id, token);
      setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
      setMessage("Transaction deleted successfully!");
    } catch (err) {
      setMessage("Failed to delete transaction.");
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    navigate("/signin");
  };

  return (
    <div className="enhanced-transactions-container">
      <header className="header">
        <h2>Transactions</h2>
        <button onClick={logout} className="logout-button">Logout</button>
      </header>
      <div className="content-grid">
        <div className="card">
          <h3>Your Transactions</h3>
          {transactions.length > 0 ? (
            <div className="transactions-table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>${transaction.amount}</td>
                      <td>{transaction.original_currency}</td>
                      <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                      <td>{transaction.description || "N/A"}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
        <div className="card">
          <h3>Add Transaction</h3>
          <form onSubmit={formik.handleSubmit} className="form-style">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="error">{formik.errors.amount}</p>
            )}
            <select
              name="original_currency"
              value={formik.values.original_currency}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Currency</option>
              {currencyOptions.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            {formik.touched.original_currency && formik.errors.original_currency && (
              <p className="error">{formik.errors.original_currency}</p>
            )}
            <input
              type="date"
              name="transaction_date"
              value={formik.values.transaction_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.transaction_date && formik.errors.transaction_date && (
              <p className="error">{formik.errors.transaction_date}</p>
            )}
            <textarea
              name="description"
              placeholder="Description (optional)"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="error">{formik.errors.description}</p>
            )}
            <button type="submit" className="submit-button">Add Transaction</button>
          </form>
        </div>
        <div className="card">
          <h3>Spending Insights</h3>
          {chartData.labels ? (
            <div className="pie-chart-container">
              <Pie data={chartData} />
            </div>
          ) : (
            <p>No data available.</p>
          )}
        </div>
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default Transactions;
