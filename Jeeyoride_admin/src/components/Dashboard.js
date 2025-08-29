import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Bar } from "react-chartjs-2";
import { BASE_URL } from "./config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Dashboard() {
  const [isActive, setIsActive] = useState(true);
  const [counts, setCounts] = useState(null);
  // New state to toggle background color
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
    setIsDarkMode(!isDarkMode); // toggle dark mode along with sidebar
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/dashboard_data_count`);
        setCounts(response.data);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const chartOptions = {
    indexAxis: "x",
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { ticks: { color: "white" } },
      y: { ticks: { color: "white" } },
    },
  };

  const cards = [
    {
      title: "Auto",
      key: "autocount",
      chartData: {
        labels: [
          "May 08",
          "May 09",
          "May 10",
          "May 10",
          "May 10",
          "May 10",
          "May 10",
        ],
        datasets: [
          {
            label: "",
            data: [500, 800, 650, 650, 650, 650, 650],
            backgroundColor: "cyan",
            borderRadius: 5,
            barThickness: 20,
          },
        ],
      },
    },
    {
      title: "AC Mini Car",
      key: "ACMinicar",
      chartData: {
        labels: [
          "May 08",
          "May 09",
          "May 10",
          "May 11",
          "May 11",
          "May 11",
          "May 11",
        ],
        datasets: [
          {
            label: "",
            data: [900, 600, 850, 750, 78, 89, 89],
            backgroundColor: "lightgreen",
            borderRadius: 5,
            barThickness: 20,
          },
        ],
      },
    },
    {
      title: "Ac Prime",
      key: "acprime",
      chartData: {
        labels: [
          "May 09",
          "May 10",
          "May 11",
          "May 11",
          "May 11",
          "May 11",
          "May 11",
        ],
        datasets: [
          {
            label: "",
            data: [300, 420, 78, 89, 89, 89, 90],
            backgroundColor: "salmon",
            borderRadius: 5,
            barThickness: 20,
          },
        ],
      },
    },
    {
      title: "Primier Taxi",
      key: "primiertaxi",
      chartData: {
        labels: [
          "May 08",
          "May 09",
          "May 10",
          "May 11",
          "May 12",
          "May 12",
          "May 12",
        ],
        datasets: [
          {
            label: "",
            data: [110, 130, 160, 90, 100, 60, 70],
            backgroundColor: "violet",
            borderRadius: 5,
            barThickness: 20,
          },
        ],
      },
    },
  ];

  // Dynamic style for background color
  const backgroundStyle = {
    backgroundColor: isDarkMode ? "#222" : "#f0f0f0",
    minHeight: "100vh",
    transition: "background-color 0.3s ease",
  };

  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      {/* Apply dynamic background style here */}
      <div
        id="page-container"
        className={isActive ? "sidebar-open" : "sidebar-closed"}
        style={backgroundStyle}
      >
        <div className="barchart">
          <div className="row">
            {cards.map((card, idx) => (
              <div className="col-6 mt-2" key={idx}>
                <div
                  className="cards"
                  style={{
                    backgroundColor: isDarkMode ? "#333" : "white",
                    color: isDarkMode ? "white" : "black",
                    borderRadius: "10px",
                  }}
                >
                  <div className="card-statistic-3 p-4">
                    <div className="mb-2">
                      <div className="row">
                        <div className="col-md-10">
                          <h5 className="card-titles mb-0">
                            {card.title} - ({counts ? counts[card.key] : "..."})
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div className="row align-items-center mb-2 d-flex">
                      <div className="col-12">
                        <Bar data={card.chartData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
