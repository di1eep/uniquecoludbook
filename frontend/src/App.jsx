// Required Modules
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [user, setUser] = useState({});
    const [availability, setAvailability] = useState([]);
    const [professorId, setProfessorId] = useState('');

    // Authentication Handlers
    const register = async (data) => {
        try {
            const response = await axios.post('http://13.127.15.20/register', data);
            alert('User registered successfully');
        } catch (error) {
            alert(error.response?.data || 'Registration failed');
        }
    };

    const login = async (data) => {
        try {
            const response = await axios.post('http://13.127.15.20/login', data);
            setToken(response.data.token);
            setRole(data.role);
        } catch (error) {
            alert(error.response?.data || 'Login failed');
        }
    };

    // Availability Handlers
    const addAvailability = async (data) => {
        try {
            await axios.post('http://13.127.15.20/availability', data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Availability added');
        } catch (error) {
            alert(error.response?.data || 'Failed to add availability');
        }
    };

    const fetchAvailability = async () => {
        try {
            const response = await axios.get(`http://13.127.15.20/availability/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAvailability(response.data);
        } catch (error) {
            alert(error.response?.data || 'Failed to fetch availability');
        }
    };

    const bookAppointment = async (data) => {
        try {
            await axios.post('http://13.127.15.20/appointments', data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Appointment booked');
        } catch (error) {
            alert(error.response?.data || 'Failed to book appointment');
        }
    };

    return (
        <div className="App">
            <h1>College Appointment System</h1>

            {!token ? (
                <div>
                    <h2>Login / Register</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const { email, password, role } = e.target.elements;
                            login({ email: email.value, password: password.value, role: role.value });
                        }}
                    >
                        <input type="text" name="email" placeholder="Email" required />
                        <input type="password" name="password" placeholder="Password" required />
                        <select name="role" required>
                            <option value="">Select Role</option>
                            <option value="student">Student</option>
                            <option value="professor">Professor</option>
                        </select>
                        <button type="submit">Login</button>
                    </form>
                </div>
            ) : (
                <div>
                    <h2>Welcome</h2>
                    {role === 'professor' ? (
                        <div>
                            <h3>Add Availability</h3>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const { date, slots } = e.target.elements;
                                    addAvailability({ date: date.value, slots: slots.value.split(',') });
                                }}
                            >
                                <input type="date" name="date" required />
                                <input type="text" name="slots" placeholder="Slots (comma-separated)" required />
                                <button type="submit">Add</button>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h3>Book Appointment</h3>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const { professorId, date, time } = e.target.elements;
                                    bookAppointment({
                                        professorId: professorId.value,
                                        date: date.value,
                                        time: time.value,
                                    });
                                }}
                            >
                                <input
                                    type="text"
                                    name="professorId"
                                    placeholder="Professor ID"
                                    value={professorId}
                                    onChange={(e) => setProfessorId(e.target.value)}
                                    required
                                />
                                <input type="date" name="date" required />
                                <input type="text" name="time" required />
                                <button type="submit">Book</button>
                            </form>

                            <button onClick={fetchAvailability}>View Availability</button>

                            {availability.length > 0 && (
                                <div>
                                    <h4>Available Slots</h4>
                                    
                                    <ul>
                                        {availability.map((slot, index) => (
                                            <li key={index}>{`${slot._id} : ${slot.date}: ${slot.slots.join(', ')}`}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default App;
