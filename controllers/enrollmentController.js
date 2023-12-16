const path = require('path');


const EnrollmentModel = require(path.join(__dirname, '..', 'models', 'Enrollment.js'));
const studentController = require(path.join(__dirname, 'studentController.js'));
const AccountController = require(path.join(__dirname, 'accountController.js'));




const getAllEnrollments = async (req, res) => {
    try {
        const Enrollments = await EnrollmentModel.find({}).sort({ createdAt: -1 });
        res.json( Enrollments );
        return;
    } catch (err) {
        res.json({ message: 'Error retrieving enrollments' });
        console.error(err);
        return;
    }
};

const createNewEnrollment = async (req, res) => {
    try {
        const conflict = await EnrollmentModel.findOne({ email: req.body.email }).exec();
        if (conflict) {
            res.status(409);
            res.json({
                message: 'Email conflict', // Not Final (Should not be in conflict with emails in Students, Instructors, Admins)
                conflict: true
            });
            return;
        }
        const newEnrollment = await EnrollmentModel.create(
            {
                firstname: req.body.firstname,
                middleInitial: req.body.middleInitial,
                lastname: req.body.lastname,
                email: req.body.email,
                
                guardianFirstname: req.body.guardianFirstname,
                guardianMiddleInitial: req.body.guardianMiddleInitial,
                guardianLastname: req.body.guardianLastname,
                guardianContactNumber: req.body.guardianContactNumber,
                coursesTakenIds: req.body.coursesTakenIds
            }
        );
        res.json( newEnrollment );
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
};

const updateEnrollment = async (req, res) => {

};

const deleteEnrollment = async (req, res) => {
    try {
        if (req.body.accept) {
            const acceptedEnrollment = await EnrollmentModel.findById( req.body.id );
    
            const newStudent = await studentController.insertNewStudent(
                {
                    email: acceptedEnrollment.email,
                    password: `${acceptedEnrollment.firstname} ${acceptedEnrollment.middleInitial} ${acceptedEnrollment.lastname}`,
                    name: `${acceptedEnrollment.firstname} ${acceptedEnrollment.middleInitial} ${acceptedEnrollment.lastname}`,
                    guardian_name: `${acceptedEnrollment.guardianFirstname} ${acceptedEnrollment.guardianMiddleInitial} ${acceptedEnrollment.guardianLastname}`,
                    contact: acceptedEnrollment.guardianContactNumber,
                    courses_taken_id: acceptedEnrollment.coursesTakenIds
                }
            );
            const result = await EnrollmentModel.deleteOne({ _id: req.body.id });
            res.json({ newStudent, result });
            return;
        }
        const result = await EnrollmentModel.deleteOne({ _id: req.body.id });
        res.json( result );
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
};



const getEnrollment = async (req, res) => {
    try {
        const enrollment = await EnrollmentModel.findById(req.params.id);
        res.json(  enrollment );
    } catch (err) {
        res.json({ message: 'Error retrieving enrollment' });
        console.error( err );
    }
}

module.exports = {
    getAllEnrollments,
    createNewEnrollment,
    updateEnrollment,
    deleteEnrollment,
    getEnrollment
};