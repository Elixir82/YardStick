import axios from 'axios';
import React from 'react';

function MonthlyBudget() {
  const months = [
    "01", "02", "03", "04", "05", "06",
    "07", "08", "09", "10", "11", "12"
  ];

  const [selectedMonth, setSelectedMonth] = React.useState("");
  const [budgets, setBudgets] = React.useState([]);

  React.useEffect(() => {
    if (!selectedMonth) return;

    const fetchBudgets = async () => {
      try {
        const resp = await axios.get(`https://yardstick-cslv.onrender.com/budgets`, {
          params: { month: selectedMonth } // ✅ send month as query param
        });
        setBudgets(resp.data.data); // assuming backend returns { data: [...] }
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };

    fetchBudgets();
  }, [selectedMonth]);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-lg font-semibold">📅 Choose a Month to View Budgets</h2>

      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="w-full border rounded p-2"
      >
        <option value="">-- Select Month --</option>
        {months.map((m, i) => {
          const year = new Date().getFullYear();
          const fullMonth = `${year}-${m}`; // format like 2025-07
          const label = `${m} - ${new Date(`${year}-${m}-01`).toLocaleString('default', { month: 'long' })}`;
          return (
            <option key={m} value={fullMonth}>{label}</option>
          );
        })}
      </select>

      <div className="mt-4 space-y-2">
        {budgets.map((b) => (
          <div key={b.category} className="flex justify-between border p-2 rounded shadow">
            <span className="font-medium">{b.category}</span>
            <span className="text-right text-blue-600 font-semibold">₹{b.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthlyBudget;
