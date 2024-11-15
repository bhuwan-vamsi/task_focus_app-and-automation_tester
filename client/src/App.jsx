import './App.css'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from '../src/components/Navbar'
import Register from '../src/pages/Register'
import Login from '../src/pages/Login'
import Dashboard from '../src/pages/Dashboard'
import TaskList from '../src/components/TaskList';
import TaskForm from '../src/components/TaskForm';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap JS (includes Popper.js)


function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/new" element={<TaskForm />} />
        <Route path="/tasks/edit/:id" element={<TaskForm />} />
      </Routes>
    </div>
  )
}

export default App
