import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/register.css';

export default function Register() {

    const navigate = useNavigate()

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const registerUser  = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if(response.error) {
                console.log('Response error: ' + response.error);
            } else {
                setData({});
                navigate('/login');
            }
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <div className="register">
            <div className="register-container">
                <form className="register-form" onSubmit={registerUser}>
                    <label>Name</label>
                    <input type="text" placeholder='enter your name' value={data.name} onChange={(e) => setData({...data, name: e.target.value})}/>
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                    <label>Password</label>
                    <input type="password" placeholder="Enter your password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}
