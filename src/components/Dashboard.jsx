import React, { useState,useEffect } from 'react';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import ExpensesBarChart from './Charts/ExpensesBarChart';
import CategoryPieChart from './Charts/CategoryPieChart';
import { v4 as uuidv4 } from "uuid";
import EditTransactionForm from './EditTransactionForm';
import BudgetComparisonChart from './Charts/BudgetComparisonChart';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [budgets, setBudgets] = useState({
    Food: 500,
    Transportation: 300,
    Entertainment: 200,
    Utilities: 400,
    Shopping: 300,
    Healthcare: 250,
    Other: 150

  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('transactions'));
    if (saved) {
      setTransactions(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);


  
  const addTransaction = (transaction) => {
    
      setTransactions([...transactions, { ...transaction, id: uuidv4() }]);
    
  };
  const updateTransaction = (updatedTransaction) => {
    setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    setEditingTransaction(null);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  return (
    
    <div className="dashboard">
       {editingTransaction ? (
        <EditTransactionForm onEdit={updateTransaction} editingTransaction={editingTransaction} />
      ) : (
        <TransactionForm onAdd={addTransaction} />
      )}

      <TransactionList transactions={transactions} onDelete={deleteTransaction} onEdit={editTransaction}/>
      <ExpensesBarChart transactions={transactions} />
      <CategoryPieChart transactions={transactions} />
      <BudgetComparisonChart budgets={budgets || {}} transactions={transactions}/>

    </div>
  );
};

export default Dashboard;
