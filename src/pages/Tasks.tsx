import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface Task {
    id: string;
    title: string;
    due_date: string;
    is_completed: boolean;
    category: string;
    created_at: string;
}

const Tasks: React.FC = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) return;
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setTasks(response.data);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-wrap justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">Your Tasks</h1>
                <div className="flex space-x-2">
                    <Link to="/tasks/create" className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
                        Create New Task
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                />
            </div>
            {loading ? (
                <p>Loading tasks...</p>
            ) : filteredTasks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map(task => (
                        <Link to={`/tasks/${task.id}`} key={task.id} className={`block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${task.is_completed ? 'border-l-4 border-green-500' : ''}`}>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-lg">{task.title}</h3>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${task.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {task.is_completed ? 'Completed' : 'Pending'}
                                </span>
                            </div>
                            {task.category && <p className="text-sm text-gray-600 capitalize mb-2">Category: {task.category}</p>}
                            <p className="text-sm text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-400 mt-2">Created: {new Date(task.created_at).toLocaleDateString()}</p>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p>You have no tasks yet.</p>
                    <Link to="/tasks/create" className="text-blue-500 hover:underline mt-2 inline-block">Create one now</Link>
                </div>
            )}
        </div>
    );
};

export default Tasks;