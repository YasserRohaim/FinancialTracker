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
  const [chartData, setChartData] = useState(null);
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [userCurrency, setUserCurrency] = useState(""); // New state for user currency
  const navigate = useNavigate();

  const calculateRemainingBudget = (budget, transactions) => {
    const totalSpent = transactions.reduce((sum, transaction) => {
      return sum + Number(transaction.amount || 0);
    }, 0);
    return budget - totalSpent;
  };

  const generateChartData = (transactions) => {
    if (!transactions.length) return null;

    const currencyTotals = transactions.reduce((acc, transaction) => {
      const { original_currency, amount } = transaction;
      if (original_currency && amount) {
        acc[original_currency] = (acc[original_currency] || 0) + Number(amount);
      }
      return acc;
    }, {});

    return {
      labels: Object.keys(currencyTotals),
      datasets: [
        {
          label: "Spending by Currency",
          data: Object.values(currencyTotals),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/signin");
      return;
    }

    fetchTransactions(token)
      .then((res) => {
        const fetchedTransactions = res.data.transactions || [];
        const userBudget = Number(res.data.budget || 0);
        const userCurrency = res.data.currency || "N/A"; // Extract user currency from response

        setTransactions(fetchedTransactions);
        setBudget(userBudget);
        setUserCurrency(userCurrency); // Update state with user currency
        setRemainingBudget(calculateRemainingBudget(userBudget, fetchedTransactions));
        setChartData(generateChartData(fetchedTransactions));
      })
      .catch((err) => {
        setMessage("Failed to fetch transactions.");
        console.error(err);
      });
  }, [navigate]);

  useEffect(() => {
    setRemainingBudget(calculateRemainingBudget(budget, transactions));
    setChartData(generateChartData(transactions));
  }, [transactions, budget]);

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
      <div className="budget-overview">
        <p>Budget: {budget}</p>
        <p>Remaining Budget: {remainingBudget}</p>
        <p>User Currency: {userCurrency}</p> {/* Display user currency */}
      </div>
      <div className="content-grid">
        <div className="card">
          <h3>Your Transactions</h3>
          {transactions.length > 0 ? (
            <div className="transactions-table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Original Currency</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.amount}</td>
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
          {chartData ? (
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
