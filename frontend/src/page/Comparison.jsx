import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Comparison() {
  const [month, setMonth] = useState("");
  const [comparisonData, setComparisonData] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (!month) return;

    const fetchComparison = async () => {
      try {
        const res = await axios.get("https://yardstick-cslv.onrender.com/comparison", {
          params: { month },
        });
        setComparisonData(res.data.data);
        setInsights(res.data.insights);
      } catch (error) {
        console.error("Error fetching comparison:", error);
      }
    };

    fetchComparison();
  }, [month]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-center text-blue-700">
        📊 Budget vs Actual Comparison
      </h2>

      {/* Month Selector */}
      <div className="flex items-center gap-4">
        <label className="text-base font-medium">Select Month:</label>
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Insights Section */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-green-600">🧠 Insights</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {insights.map((text, index) => (
              <Card key={index} className="border-l-4 border-blue-500">
                <CardContent className="p-4 text-sm text-gray-700">
                  {text}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Raw Comparison Data */}
      {comparisonData.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-700">📋 Raw Data</h3>
          <div className="space-y-2">
            {comparisonData.map((item, idx) => (
              <Card key={idx} className="bg-slate-50">
                <CardContent className="p-3 flex justify-between items-center">
                  <span className="font-medium text-sm text-gray-700">
                    {item.category}
                  </span>
                  <span className="text-right text-blue-700 text-sm">
                    Budgeted: ₹{item.budgeted}
                    <br />
                    Spent: ₹{item.spent}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recharts Bar Graph */}
      {comparisonData.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3 text-indigo-600">
            📈 Visual Comparison
          </h3>
          <div className="bg-white rounded-xl p-4 shadow">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={comparisonData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="budgeted" fill="#3b82f6" name="Budgeted" />
                <Bar dataKey="spent" fill="#ef4444" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Comparison;
