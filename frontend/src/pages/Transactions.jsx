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

  // Generate chart data for spending insights
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

  // Formik for adding a new transaction
  const formik = useFormik({
    initialValues: {
      amount: "",
      original_currency: "",
      transaction_date: Date.new,
      description: "",
    },
    validationSchema: yup.object({
      amount: yup.number().required("Amount is required").positive("Amount must be positive."),
      original_currency: yup
        .string()
        .oneOf(currencyOptions, "Invalid currency")
        .required("Currency is required."),
      transaction_date: yup
        .date()
        .max(new Date(), "Date cannot be in the future."),
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
    <div className="transactions-container">
      <header className="transactions-header">
        <h1>Transactions</h1>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </header>
      <div className="transactions-content">
        <div className="transactions-list">
          <h2>Your Transactions</h2>
          {transactions.length > 0 ? (
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
          ) : (
            <p className="no-transactions">No transactions found.</p>
          )}
        </div>
        <div className="transactions-form">
          <h2>Add Transaction</h2>
          <form onSubmit={formik.handleSubmit} className="form-style">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-input"
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="error">{formik.errors.amount}</p>
            )}
            <select
              name="original_currency"
              value={formik.values.original_currency}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-input"
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
              className="form-input"
            />
            {formik.touched.transaction_date && formik.errors.transaction_date && (
              <p className="error">{formik.errors.transaction_date}</p>
            )}
            <textarea
              name="description"
              placeholder="Description (Optional)"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-input"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="error">{formik.errors.description}</p>
            )}
            <button type="submit" className="submit-button">
              Add Transaction
            </button>
          </form>
        </div>
        <div className="transactions-insights">
          <h2>Spending Insights</h2>
          {Object.keys(chartData).length > 0 ? (
            <div className="pie-chart-container">
              <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          ) : (
            <p className="no-data">No data to display.</p>
          )}
        </div>
      </div>
      {message && <p className="transactions-message">{message}</p>}
    </div>
  );
};

export default Transactions;
