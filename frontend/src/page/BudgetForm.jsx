import React from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const categories = ["Food", "Movies", "Travel", "Utilities", "Rent", "Shopping", "Health", "Other"];

function BudgetForm() {
  const [month, setMonth] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [existingBudgets, setExistingBudgets] = React.useState([]);

  const fetchBudgets = async (month) => {
    try {
      const res = await axios.get(`https://yardstick-cslv.onrender.com/budgets?month=${month}`);
      setExistingBudgets(res.data.data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!month || !category || !amount) return;

    try {
      await axios.post("https://yardstick-cslv.onrender.com/budgets", {
        month,
        category,
        amount: Number(amount),
      });
      setAmount("");
      setCategory("");
      fetchBudgets(month); // refresh list after submit
    } catch (error) {
      console.error("Error setting budget:", error);
    }
  };

  React.useEffect(() => {
    if (month) fetchBudgets(month);
  }, [month]);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Set Budget for a Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="month">Month</Label>
              <Input
                type="month"
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full border px-3 py-2 rounded">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Save Budget
            </Button>
          </form>
        </CardContent>
      </Card>

      {existingBudgets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budgets Set for {month}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {existingBudgets.map((b, idx) => (
              <div
                key={idx}
                className="flex justify-between text-sm text-muted-foreground"
              >
                <span>{b.category}</span>
                <span>₹{b.amount}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BudgetForm;
