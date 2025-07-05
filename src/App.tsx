import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Tasks from './pages/Tasks';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TaskDetail from './pages/TaskDetail';
import UpdateTask from './pages/UpdateTask';
import CreateTask from './pages/CreateTask';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow p-4 md:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/create" element={<CreateTask />} />
              <Route path="/tasks/:taskId" element={<TaskDetail />} />
              <Route path="/tasks/:taskId/edit" element={<UpdateTask />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;