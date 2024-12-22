import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './setEmployeeData.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';

function SetEmployeeData() {  
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState(''); 

    const navigate = useNavigate();

    
    const generatePassword = () => {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'; //a-zA-Z0-9 And symbols only
        let password = '';
        for (let i = 0; i < 10; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId || !name) {
            alert('Please enter both User ID and name');
            return;
        }

        const password = generatePassword(); // Generate password
        setGeneratedPassword(password);

        try {
            // Send the data to the backend, including the auto-generated password
            const response = await axios.post('http://localhost:3002/api/set-employee', {
                name,
                userId,
                password, // Include generated password
            });

            if (response.status === 200) {
                alert(`Employee created successfully! Password: ${password}`);
                navigate('/AdminDashboard'); // Redirect to admin page on success
            } else {
                alert('Failed to create employee! Please try again.');
            }
        } catch (err) {
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="App">
            <header>
                <h2>Sigvitas</h2>
            </header>
            <main>
                <form onSubmit={handleSubmit}>
                    <h2>Set Employee Data</h2>
                    <div id="div1">
                        <input
                            type="text"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <br />
                        <input
                            type="text"
                            placeholder="Enter User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                        <br />
                        <button id="logBtn" type="submit">Update</button>
                    </div>
                </form>
            </main>
            <footer>
                <p>&copy; 2024 Sigvitas. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default SetEmployeeData;
