﻿import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import API_BASE_URL from "../config/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function RevenueChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/admin/stats/monthly-revenue`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const labels = res.data.map((item) => item._id);
        const totals = res.data.map((item) => item.total);

        setData({
          labels,
          datasets: [
            {
              label: "TÃ« Ardhurat Mujore",
              data: totals,
              borderColor: "rgba(255,99,132,1)",
              backgroundColor: "rgba(255,99,132,0.2)",
              tension: 0.3,
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        setError("Gabim gjatÃ« marrjes sÃ« tÃ« dhÃ«nave");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Duke ngarkuar grafikÃ«t...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return <Line data={data} />;
}
