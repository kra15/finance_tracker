import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BudgetComparisonChart = ({ budgets, transactions }) => {
  const actuals = {};

  transactions.forEach(t => {
    actuals[t.category] = (actuals[t.category] || 0) + t.amount;
  });

  const data = Object.keys(budgets).map(cat => ({
    category: cat,
    Budget: budgets[cat],
    Actual: actuals[cat] || 0
  }));

  return (
    <div className="chart-container">
      <h2>Budget vs Actual</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Budget" fill="#8884d8" />
          <Bar dataKey="Actual" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetComparisonChart;