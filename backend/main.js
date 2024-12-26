

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(bodyParser.json());



const dbURI = process.env.SERVER;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));


const JWT_SECRET = process.env.JWTSECRET;






const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['student', 'professor'], required: true },
});



const availabilitySchema = new mongoose.Schema({
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: String,
    slots: [String],
});




const appointmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: String,
    time: String,
});



const User = mongoose.model('User', userSchema);
const Availability = mongoose.model('Availability', availabilitySchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);




const authenticate = (roles) => async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token.split(' ')[1], JWT_SECRET);
        req.user = verified;
        if (roles && !roles.includes(req.user.role)) {
            return res.status(403).send('Forbidden');
        }
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};




app.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});



app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid email or password');
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET);
        res.json({ token });
    } catch (err) {
        res.status(400).send(err.message);
    }
});


app.post('/availability', authenticate(['professor']), async (req, res) => {
    const { date, slots } = req.body;

    try {
        const availability = new Availability({
            professorId: req.user._id,
            date,
            slots,
        });
        await availability.save();
        res.status(201).send('Availability added');
    } catch (err) {
        res.status(400).send(err.message);
    }
});


app.get('/availability/', authenticate(['student']), async (req, res) => {
    try {
        const availability = await Availability.find(); 
        res.json(availability);
    } catch (err) {
        res.status(400).send(err.message);
    }
});



app.post('/appointments', authenticate(['student']), async (req, res) => {
    const { professorId, date, time } = req.body;

    try {
        const appointment = new Appointment({
            studentId: req.user._id,
            professorId,
            date,
            time,
        });
        await appointment.save();
        res.status(201).send('Appointment booked');
    } catch (err) {
        res.status(400).send(err.message);
    }
});



app.get('/', (req, res) => {
    res.send('<h1>Hello, World! This is an H1 tag!</h1>');
  });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
