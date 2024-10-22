import React, { useEffect, useState } from 'react';
import './admindashboard.css';  // Add custom styles here
import { Line } from 'react-chartjs-2';  // Using Chart.js for the chart
import { FaBox, FaUsers, FaShoppingCart, FaStar } from 'react-icons/fa';  // Icons for boxes

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalReviews: 0
    });
    const [chartData, setChartData] = useState({}); // Chart data for orders

    useEffect(() => {
        // Fetch summary stats
        fetchStats();
        // Fetch chart data
        fetchChartData();
    }, []);

    const fetchStats = async () => {
        // Assume an API call to fetch total products, users, orders, reviews
        const response = await fetch('/api/dashboard-stats');
        const data = await response.json();
        setStats(data);
    };

    const fetchChartData = async () => {
        // Assume an API call to fetch orders data
        const response = await fetch('/api/order-chart');
        const data = await response.json();

        // Formatting the data for the Line chart
        const formattedData = {
            labels: data.dates, // Array of dates
            datasets: [{
                label: 'Orders in Last 30 Days',
                data: data.orders,  // Array of order counts
                fill: true,
                backgroundColor: 'rgba(99, 132, 255, 0.3)',
                borderColor: '#6079ff'
            }]
        };

        setChartData(formattedData);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Admin Dashboard</h2>
            </div>
            <div className="dashboard-stats">
                {/* Top Summary Boxes */}
                <div className="stats-box">
                    <FaBox className="stat-icon" />
                    <div>
                        <p>Total Products</p>
                        <h3>{stats.totalProducts}</h3>
                    </div>
                </div>
                <div className="stats-box">
                    <FaUsers className="stat-icon" />
                    <div>
                        <p>Total Users</p>
                        <h3>{stats.totalUsers}</h3>
                    </div>
                </div>
                <div className="stats-box">
                    <FaShoppingCart className="stat-icon" />
                    <div>
                        <p>Total Orders</p>
                        <h3>{stats.totalOrders}</h3>
                    </div>
                </div>
                <div className="stats-box">
                    <FaStar className="stat-icon" />
                    <div>
                        <p>Total Reviews</p>
                        <h3>{stats.totalReviews}</h3>
                    </div>
                </div>
            </div>

            {/* Orders Chart */}
            <div className="dashboard-chart">
                <Line data={chartData} />
            </div>

            {/* Additional Features (e.g., Latest Orders) */}
            <div className="dashboard-latest-orders">
                <h3>Latest Orders</h3>
                <ul>
                    {/* This will display the latest orders, assuming you have the data */}
                    <li>Order #1 - $150 - 21 Oct 2024</li>
                    <li>Order #2 - $75 - 20 Oct 2024</li>
                    {/* More orders... */}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
