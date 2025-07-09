import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function TransactionForm() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !category || !date) {
      alert("Amount, Category, and Date are required");
      return;
    }

    try {
      const res = await axios.post("https://yardstick-cslv.onrender.com/transactions", {
        amount: Number(amount),
        category,
        date,
        description,
      });

      alert("✅ Transaction Saved");
      setAmount("");
      setCategory("");
      setDate("");
      setDescription("");
    } catch (err) {
      console.error("Failed to save transaction", err);
      alert("Error saving transaction");
    }
  };

  const categories = ["Food", "Movies", "Travel", "Utilities", "Rent", "Shopping", "Health", "Other"];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-bold text-blue-700">
            🧾 Add New Transaction
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount (₹)
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date" className="text-sm font-medium">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="desc" className="text-sm font-medium">
                Description (optional)
              </Label>
              <Input
                id="desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Save Transaction
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default TransactionForm;
