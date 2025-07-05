import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface Task {
    id: string;
    title: string;
    description: string;
    due_date: string;
    is_completed: boolean;
    category: string;
    created_at: string;
}

const TaskDetail: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const { user } = useAuth();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            if (!user) return;
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setTask(response.data);
            } catch (error) {
                console.error('Failed to fetch task:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [user, taskId]);

    const handleDelete = async () => {
        if (!user || !task) return;
        if (window.confirm('Are you sure you want to delete this task?')) {
            setIsDeleting(true);
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${task.id}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                navigate('/tasks');
            } catch (error) {
                console.error('Failed to delete task:', error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    if (loading) return <p>Loading task...</p>;
    if (!task) return <p>Task not found.</p>;

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <div className="flex justify-between items-center mb-4 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold mr-4">{task.title}</h1>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${task.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {task.is_completed ? 'Completed' : 'Pending'}
                </span>
            </div>
            {task.category && <p className="mb-2 text-base text-gray-600 capitalize">Category: {task.category}</p>}
            <p className="mb-4 text-lg">{task.description}</p>
            <p className="text-base text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-400">Created: {new Date(task.created_at).toLocaleDateString()}</p>
            <div className="mt-6 flex space-x-4">
                <Link to="/tasks" className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
                    Back to Tasks
                </Link>
                <Link to={`/tasks/${task.id}/edit`} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                    Update
                </Link>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:bg-gray-400"
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    );
};

export default TaskDetail; 