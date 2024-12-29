import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [professorId, setProfessorId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    
    const [date, setDate] = useState('');
    const [selectedTimes, setSelectedTimes] = useState([]);

  
    const login = async (data) => {
        try {
            const response = await axios.post('http://localhost:3000/login', data);
            setToken(response.data.token);
            setRole(data.role);
        } catch (error) {
            alert(error.response?.data || 'Login failed');
        }
    };


    const addAvailability = async (data) => {
        try {
            const response = await axios.post('http://localhost:3000/availability', data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(response.data); 
            setDate(''); 
            setSelectedTimes([]); 
        } catch (error) {
            alert(error.response?.data || 'Failed to add availability');
        }
    };
    

    const fetchAvailability = async () => {
        try {
            const response = await axios.get('http://localhost:3000/availability/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAvailability(response.data);
        } catch (error) {
            alert(error.response?.data || 'Failed to fetch availability');
        }
    };


    const bookAppointment = async (data) => {
        try {
            await axios.post('http://localhost:3000/appointments', data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Appointment booked');
        } catch (error) {
            alert(error.response?.data || 'Failed to book appointment');
        }
    };

    const uniqueProfessors = [...new Set(availability.map((item) => item.professorId))];


    const availableDates = availability
        .filter((item) => item.professorId === professorId)
        .map((item) => item.date);

    const availableTimes = availability
        .find((item) => item.professorId === professorId && item.date === selectedDate)?.slots || [];

    const handleTimeSelection = (e) => {
        const value = e.target.value;
        setSelectedTimes((prevSelected) => {
            if (prevSelected.includes(value)) {
                return prevSelected.filter((time) => time !== value); 
            }
            return [...prevSelected, value]; 
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addAvailability({
            date,
            slots: selectedTimes,
        });
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
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="date"
                                    name="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                                <div className="time-select">
                                    <h4>Select Available Time Slots:</h4>
                                    <select
                                        multiple
                                        value={selectedTimes}
                                        onChange={handleTimeSelection}
                                        className="time-dropdown"
                                    >
                                        <option value="10:00 AM">10:00 AM</option>
                                        <option value="11:00 AM">11:00 AM</option>
                                        <option value="12:00 PM">12:00 PM</option>
                                        <option value="1:00 PM">1:00 PM</option>
                                        <option value="2:00 PM">2:00 PM</option>
                                        <option value="3:00 PM">3:00 PM</option>
                                        <option value="4:00 PM">4:00 PM</option>
                                    </select>
                                </div>

                                {selectedTimes.length > 0 && (
                                    <div className="selected-times-box">
                                        <h4>Selected Slots:</h4>
                                        <ul>
                                            {selectedTimes.map((time, index) => (
                                                <li key={index}>{time}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <button type="submit" disabled={selectedTimes.length === 0}>
                                    Add Availability
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h3>Book Appointment</h3>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    bookAppointment({
                                        professorId,
                                        date: selectedDate,
                                        time: selectedTime,
                                    });
                                }}
                            >
                                <select
                                    name="professorId"
                                    value={professorId}
                                    onChange={(e) => setProfessorId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>
                                        Select Professor
                                    </option>
                                    {uniqueProfessors.map((id) => (
                                        <option key={id} value={id}>
                                            {id}
                                        </option>
                                    ))}
                                </select>

                
                                <select
                                    name="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    required
                                    disabled={!professorId}
                                >
                                    <option value="" disabled>
                                        Select Date
                                    </option>
                                    {availableDates.map((date, index) => (
                                        <option key={index} value={date}>
                                            {date}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="time"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    required
                                    disabled={!selectedDate}
                                >
                                    <option value="" disabled>
                                        Select Time
                                    </option>
                                    {availableTimes.map((time, index) => (
                                        <option key={index} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>

                                <button type="submit">Book</button>
                            </form>
                            <button onClick={fetchAvailability}>View Availability</button>
                            {availability.length > 0 && (
                                <div>
                                    <h4>Available Slots</h4>
                                    <ul>
                                        {availability.map((slot, index) => (
                                            <li key={index}>{`${slot.professorId} : ${slot.date}: ${slot.slots.join(', ')}`}</li>
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
