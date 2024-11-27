import React, { useState, useEffect } from "react";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]); // State to store transactions
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    // Fetch transactions on component mount
    fetch("http://localhost:3001/api/transactions/getall", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authentication if needed
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        return response.json();
      })
      .then((data) => {
        setTransactions(data.transactions || []); // Update state with fetched data
      })
      .catch((err) => {
        console.error(err);
        setError(err.message); // Update state with error
      });
  }, []);

  return (
    <div>
      <h1>Transactions</h1>
      <form>
        <input type="number" name="amount" placeholder="Amount" required />
        <input type="text" name="description" placeholder="Description" required />
        <button type="submit">Add Transaction</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error if any */}
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.description} - ${transaction.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsPage;
