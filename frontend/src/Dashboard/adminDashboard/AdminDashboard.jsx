import React, { useEffect, useState, useContext } from 'react';
import './admindashboard.css';
import { Line } from 'react-chartjs-2';
import { FaBox, FaUsers, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import { Context } from '../../context API/Contextapi';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register the components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const { fetchOrders, fetchInfo, fetchUsers } = useContext(Context);
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalSales: 0,
    });
    const [chartData, setChartData] = useState({});
    const [latestOrders, setLatestOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                await fetchDashboardStats();
                await fetchOrdersChart();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [fetchInfo, fetchOrders, fetchUsers]);

    const fetchDashboardStats = async () => {
        let allProducts = [];
        const users = await fetchUsers();

        await new Promise((resolve, reject) => {
            fetchInfo(
                (err) => {
                    console.error('Error fetching products', err);
                    reject(err);
                },
                (loading) => console.log('Loading products', loading),
                (products) => {
                    allProducts = products;
                    resolve(products);
                }
            );
        });

        const orders = await fetchOrders();
        const totalOrders = orders.length;
        const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        setLatestOrders(orders.slice(0, 5)); 

        setStats({
            totalProducts: allProducts.length,
            totalUsers: users.length,
            totalOrders: totalOrders,
            totalSales: totalSales,
        });
    };

    const fetchOrdersChart = async () => {
        const orders = await fetchOrders();
        const data = formatOrderChartData(orders);
        setChartData(data);
    };

    const formatOrderChartData = (orders) => {
        if (!Array.isArray(orders) || orders.length === 0) {
            console.error("No orders found or invalid data format.");
            return { labels: [], datasets: [] }; 
        }

        const orderCounts = Array(30).fill(0);
        const labels = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0]; 
        }).reverse();

        orders.forEach(order => {
            const orderDate = new Date(order.dateOrdered).toISOString().split('T')[0];
            const index = labels.indexOf(orderDate);
            if (index > -1) {
                orderCounts[index]++;
            }
        });

        return {
            labels,
            datasets: [{
                label: 'Orders in Last 30 Days',
                data: orderCounts,
                fill: true,
                backgroundColor: 'rgba(99, 132, 255, 0.3)',
                borderColor: '#6079ff',
            }]
        };
    };

    const handleNavigateToProducts = () => navigate('/admin/productlist'); 
    const handleNavigateToUsers = () => navigate('/admin/users'); 
    const handleNavigateToOrders = () => navigate('/admin/orders');
    const handleNavigateToSales = () => navigate('/admin/sales'); // Uncomment this

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Admin Dashboard</h2>
            </div>
            <div className="dashboard-stats">
                <div className="stats-box" onClick={handleNavigateToProducts}>
                    <FaBox className="stat-icon" />
                    <div>
                        <p>Total Products</p>
                        <h3>{stats.totalProducts}</h3>
                    </div>
                </div>
                <div className="stats-box" onClick={handleNavigateToUsers}>
                    <FaUsers className="stat-icon" />
                    <div>
                        <p>Total Users</p>
                        <h3>{stats.totalUsers}</h3>
                    </div>
                </div>
                <div className="stats-box" onClick={handleNavigateToOrders}>
                    <FaShoppingCart className="stat-icon" />
                    <div>
                        <p>Total Orders</p>
                        <h3>{stats.totalOrders}</h3>
                    </div>
                </div>
                <div className="stats-box">
                    <FaDollarSign className="stat-icon" />
                    <div>
                        <p>Total Sales</p>
                        <h3>${stats.totalSales.toFixed(2)}</h3>
                    </div>
                </div>
            </div>

            <div className="dashboard-chart">
                <Line data={chartData} />
            </div>

            <div className="dashboard-latest-orders">
                <h3>Latest Orders</h3>
                <ul>
                    {latestOrders.length > 0 ? (
                        latestOrders.map((order, index) => (
                            <li key={index}>
                                Order # {order._id} - ${order.totalPrice} - {new Date(order.dateOrdered).toLocaleDateString()}
                            </li>
                        ))
                    ) : (
                        <li>No latest orders available.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
