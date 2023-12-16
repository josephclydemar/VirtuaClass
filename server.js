
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const { logEvents } = require(path.join(__dirname, 'middlewares', 'logger.js'));

dotenv.config();

const app = express();
const PORT = process.env.NODE_PORT || 8700;
const DATABASE_URI = process.env.DATABASE_URI;





app.use((req, res, next) => {
    logEvents(__dirname, `${req.method}\t${req.headers.origin}\t${req.url}`);
    next();
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // middleware2: enables to accept json data from requests
app.use(express.static(path.join(__dirname, 'build'))); // middleware3: gives public access of files in the build directory


//  API routes
app.use('/api', require(path.join(__dirname, 'routes', 'api', 'school.js')));
app.use('/api', require(path.join(__dirname, 'routes', 'api', 'course.js')));
app.use('/api', require(path.join(__dirname, 'routes', 'api', 'instructor.js')));
app.use('/api', require(path.join(__dirname, 'routes', 'api', 'student.js')));
app.use('/api', require(path.join(__dirname, 'routes', 'api', 'admin.js')));
app.use('/api', require(path.join(__dirname, 'routes', 'api', 'account.js')));
app.use('/api', require(path.join(__dirname, 'routes', 'api', 'enrollment.js')));
app.use('/api', require(path.join(__dirname, 'routes', 'api', 'event.js')));
app.use('/api', require(path.join(__dirname, 'routes', 'api', 'faq.js')));
app.use('/api', require(path.join(__dirname, 'routes', 'api', 'time_slot.js')));
app.use('/api', require(path.join(__dirname, 'routes', 'api', 'activity.js')));


//  General view routes
app.use('/', require(path.join(__dirname, 'routes', 'Courses.js')));
app.use('/', require(path.join(__dirname, 'routes', 'Faq.js')));
app.use('/', require(path.join(__dirname, 'routes', 'Enrollment.js')));
app.use('/', require(path.join(__dirname, 'routes', 'PaymentLinks.js')));
app.use('/', require(path.join(__dirname, 'routes', 'Calendar.js')));
app.use('/', require(path.join(__dirname, 'routes', 'Login.js')));
app.use('/', require(path.join(__dirname, 'routes', 'Blocked.js')));

// Admin view routes
app.use('/admins', require(path.join(__dirname, 'routes', 'ViewAdmin', 'AdminDashboard.js')));
app.use('/admins', require(path.join(__dirname, 'routes', 'ViewAdmin', 'EnrollmentApplications.js')));
app.use('/admins', require(path.join(__dirname, 'routes', 'ViewAdmin', 'StudentAccounts.js')));
app.use('/admins', require(path.join(__dirname, 'routes', 'ViewAdmin', 'InstructorAccounts.js')));
app.use('/admins', require(path.join(__dirname, 'routes', 'ViewAdmin', 'AdministratorAccounts.js')));
app.use('/admins', require(path.join(__dirname, 'routes', 'ViewAdmin', 'SiteSettings.js')));


// Instructor view routes
app.use('/instructors', require(path.join(__dirname, 'routes', 'ViewInstructor', 'InstructorDashboard.js')));
app.use('/instructors', require(path.join(__dirname, 'routes', 'ViewInstructor', 'OfferedCourses.js')));
app.use('/instructors', require(path.join(__dirname, 'routes', 'ViewInstructor', 'ManageCourses.js')));
app.use('/instructors', require(path.join(__dirname, 'routes', 'ViewInstructor', 'ClassRecords.js')));
app.use('/instructors', require(path.join(__dirname, 'routes', 'ViewInstructor', 'ClassActivities.js')));

// Student view routes
app.use('/students', require(path.join(__dirname, 'routes', 'ViewStudent', 'StudentDashboard.js')));
app.use('/students', require(path.join(__dirname, 'routes', 'ViewStudent', 'CourseList.js')));
app.use('/students', require(path.join(__dirname, 'routes', 'ViewStudent', 'ChangePassword.js')));
app.use('/students', require(path.join(__dirname, 'routes', 'ViewStudent', 'PendingActivities.js')));


app.use('/', require(path.join(__dirname, 'routes', 'Root.js')));





mongoose.connect(
    DATABASE_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    logEvents(__dirname, `Connected: ${DATABASE_URI.split('@')[1].split('/')[0]} [${DATABASE_URI.split('@')[1].split('/')[1].split('?')[0]}]`);
    app.listen(PORT, () => {
        logEvents(__dirname, `Listening on PORT: ${PORT}`);
    });
}).catch(err => console.log(err.message));



