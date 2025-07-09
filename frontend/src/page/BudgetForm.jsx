import React from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { FiCalendar, FiTag, FiDollarSign, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  { label: "Food", icon: <FiTag /> },
  { label: "Movies", icon: <FiTag /> },
  { label: "Travel", icon: <FiTag /> },
  { label: "Utilities", icon: <FiTag /> },
  { label: "Rent", icon: <FiTag /> },
  { label: "Shopping", icon: <FiTag /> },
  { label: "Health", icon: <FiTag /> },
  { label: "Other", icon: <FiTag /> },
];

function BudgetForm() {
  const [month, setMonth] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [existingBudgets, setExistingBudgets] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!month || !amount || !category) return;
    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      await axios.post("http://localhost:8000/budgets", {
        month,
        amount: Number(amount),
        category,
      });
      setAmount("");
      setCategory("");
      setAlert({ type: "success", message: "Budget saved successfully!" });
      fetchBudgets(month);
    } catch (error) {
      setAlert({ type: "error", message: "Unable to save budget." });
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async (selectedMonth) => {
    setLoading(true);
    try {
      const resp = await axios.get(
        `http://localhost:8000/budgets?month=${selectedMonth}`
      );
      setExistingBudgets(resp.data.data);
    } catch (err) {
      setAlert({ type: "error", message: "Error fetching budgets." });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (month) fetchBudgets(month);
  }, [month]);

  return (
    <div className="max-w-md mx-auto p-6 space-y-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl">
      <Card className="shadow-xl transition-shadow hover:shadow-2xl">
        <CardHeader className="pb-4 border-b border-gray-100">
          <CardTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2">
            <FiDollarSign className="text-blue-500" /> Set a Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="month" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiCalendar /> Month (YYYY-MM)
              </Label>
              <Input
                id="month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiTag /> Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-lg border border-gray-200 mt-1">
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.label}
                      value={cat.label}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center gap-2"
                    >
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiDollarSign /> Amount (₹)
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                placeholder="0.00"
                min="0"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 rounded-lg shadow-md transition-all"
            >
              {loading ? "Saving..." : "Save Budget"}
            </Button>
          </form>
          {alert.message && (
            <div className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-md ${alert.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {alert.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
              <span>{alert.message}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {existingBudgets.length > 0 && (
        <Card className="shadow-xl transition-shadow hover:shadow-2xl">
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2">
              <FiCalendar className="text-blue-500" /> Budgets for {month}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {existingBudgets.map((b, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
              >
                <span className="font-medium text-gray-700 flex items-center gap-2">
                  <FiTag /> {b.category}
                </span>
                <span className="font-semibold text-blue-700">₹{b.amount.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BudgetForm;
