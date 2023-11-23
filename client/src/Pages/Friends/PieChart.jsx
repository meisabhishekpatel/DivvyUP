import axios from "axios";
import React, { useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useState } from "react";
// import { userService } from "services";

const COLORS = ["#0088FE", "#FFBB28"];

export default function PieGraph({ currentUser }) {
  const [data, setData] = useState([
    { name: "Lent", value: Number(1000) },
    { name: "Owe", value: Math.abs(500) },
  ]);

  //   const fetchExpenses = async () => {
  //     try {
  //       setData([
  //         { name: "Lent", value: Number(1000) },
  //         { name: "Owe", value: Math.abs(500) },
  //       ]);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchExpenses();
  //   }, []);

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl font-semibold ">Lent vs Owe</p>

      {data[1] && data[0] && data[0].value === 0 && data?.[1].value === 0 ? (
        <div className="flex h-72 items-center justify-center">
          <div>
            <h1 className="flex items-center justify-center text-xl font-semibold">
              <span className="mr-2 mb-6 block text-4xl">🏎</span>{" "}
              <span className="block">No Expense Data</span>
            </h1>
            <p className=" text-gray-600">Pie-chart not available </p>
          </div>
        </div>
      ) : (
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            outerRadius={130}
            fill="#8884d8"
            dataKey="value"
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      )}
    </div>
  );
}
