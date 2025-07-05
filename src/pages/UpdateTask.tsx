import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const UpdateTask: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            if (!user) return;
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                const { title, description, due_date, is_completed, category } = response.data;
                setTitle(title);
                setDescription(description);
                setDueDate(due_date.split('T')[0]); // Format date for input
                setIsCompleted(is_completed);
                setCategory(category || 'other');
            } catch (err) {
                setError('Failed to fetch task details.');
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [user, taskId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setFormLoading(true);
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, 
            { title, description, due_date: dueDate, is_completed: isCompleted, category }, 
            {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            navigate('/tasks');
        } catch (err) {
            setError('Failed to update task.');
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <h1 className="text-2xl font-bold mb-4">Update Task</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="work">Work</option>
                        <option value="hobbies">Hobbies</option>
                        <option value="education">Education</option>
                        <option value="savings">Savings</option>
                        <option value="health">Health</option>
                        <option value="family">Family</option>
                        <option value="personal">Personal</option>
                        <option value="shopping">Shopping</option>
                        <option value="travel">Travel</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="completed"
                        checked={isCompleted}
                        onChange={(e) => setIsCompleted(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="completed" className="ml-2 block text-sm text-gray-900">
                        Completed
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {formLoading ? 'Please Wait...' : 'Update Task'}
                </button>
            </form>
        </div>
    );
};

export default UpdateTask; 