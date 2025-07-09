import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import BudgetForm from "./page/BudgetForm.jsx";
import Comparison from "./page/Comparison.jsx";
import Dashboard from "./page/DashBoard.jsx";
import TransactionForm from "./page/TransactionForm.jsx";

function App() {
  return (
    <Router>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <header className="flex justify-center gap-6 font-semibold text-blue-700 text-lg border-b pb-4">
          <Link to="/">Dashboard</Link>
          <Link to="/budget">Set Budget</Link>
          <Link to="/comparison">Compare</Link>
          <Link to="/add-transaction">Add Transaction</Link>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/budget" element={<BudgetForm />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/add-transaction" element={<TransactionForm />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
