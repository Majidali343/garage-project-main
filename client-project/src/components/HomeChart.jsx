import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components in Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HomeBarChart = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);

  // Function to fetch both income and expense data simultaneously
  const fetchData = async () => {
    try {
      const [incomeResponse, expenseResponse] = await Promise.all([
        fetch("http://localhost:5000/income/get/E-income"),
        fetch("http://localhost:5000/expense/get/Eexpenses"),
      ]);

      const incomeData = await incomeResponse.json();
      const expenseData = await expenseResponse.json();

      // Set chart labels based on the income data (assuming both income and expense have the same dates)
      setChartLabels(incomeData.rows.map(item => item.date));

      // Set income and expense data
      setIncomeData(incomeData.rows.map(item => item.salary));  // Assuming 'salary' represents income
      setExpenseData(expenseData.rows.map(item => item.amount)); // Assuming 'amount' represents expenses

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Data for the bar chart
  const data = {
    labels: chartLabels, // Dates will be used for x-axis
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    indexAxis: 'y', // This makes the bars horizontal
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '900px', height: '650px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default HomeBarChart;
