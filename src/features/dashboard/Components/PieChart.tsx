import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ chartData, groupName }) {
  return (
    <div className="w-72 h-72 md:w-80 md:h-80 flex flex-col items-center text-lg font-medium mb-16 ">
        <h2 className="py-4 text-neutral-600 ">{groupName}</h2>
      <Pie data={chartData} />
    </div>
  );
}

export default PieChart;
