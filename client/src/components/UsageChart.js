import React from "react";
import { Line } from "react-chartjs-2";

const UsageChart = ({ usage }) => {
  const data = {
    labels: usage.map(u => new Date(u.date).toLocaleDateString()),
    datasets: [
      {
        label: "Daily Water Usage (L)",
        data: usage.map(u => u.litersUsed),
        borderWidth: 2,
      },
    ],
  };

  return <Line data={data} />;
};

export default UsageChart;
