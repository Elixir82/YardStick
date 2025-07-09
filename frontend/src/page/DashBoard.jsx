import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function Dashboard() {
  const [month, setMonth] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a855f7", "#ef4444"];

  useEffect(() => {
    if (!month) return;

    const fetchTransactions = async () => {
      try {
        const res = await axios.get("https://yardstick-cslv.onrender.com/transactions", {
          params: { month },
        });

        const txs = res.data.data || [];
        setTransactions(txs);

        // Group by category
        const categorySums = {};
        let total = 0;
        txs.forEach((tx) => {
          const cat = tx.category;
          const amt = Number(tx.amount);
          categorySums[cat] = (categorySums[cat] || 0) + amt;
          total += amt;
        });

        setCategoryTotals(categorySums);
        setTotalSpent(total);
      } catch (err) {
        console.error("Error fetching transactions", err);
      }
    };

    fetchTransactions();
  }, [month]);

  // Convert categoryTotals object into an array for Recharts
  const pieData = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: categoryTotals[cat],
  }));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-center text-blue-700">
        💰 Personal Finance Dashboard
      </h2>

      {/* Month Picker */}
      <div className="flex items-center gap-4">
        <label className="text-base font-medium">Select Month:</label>
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-blue-100">
          <CardContent className="p-4">
            <div className="text-sm text-gray-700">Total Spent</div>
            <div className="text-xl font-bold text-blue-700">₹{totalSpent}</div>
          </CardContent>
        </Card>

        <Card className="bg-indigo-100">
          <CardContent className="p-4">
            <div className="text-sm text-gray-700">Total Transactions</div>
            <div className="text-xl font-bold text-indigo-700">{transactions.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-100">
          <CardContent className="p-4">
            <div className="text-sm text-gray-700">Categories</div>
            <div className="text-xl font-bold text-emerald-700">{Object.keys(categoryTotals).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart */}
      {pieData.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow">
          <h3 className="text-lg font-medium mb-2">🥧 Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium mb-2">🧾 Recent Transactions</h3>
          {transactions
            .slice(-5)
            .reverse()
            .map((tx, i) => (
              <Card key={i}>
                <CardContent className="p-3 flex justify-between items-center text-sm">
                  <div>
                    <div className="font-medium">{tx.category}</div>
                    <div className="text-gray-500">{tx.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-700 font-semibold">₹{tx.amount}</div>
                    <div className="text-xs text-gray-500">{tx.date}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
