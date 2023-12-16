const path = require('path');
// const bcrypt = require('bcrypt');
const StudentModel = require(path.join(__dirname, '..', 'models', 'Student.js'));
const AccountController = require(path.join(__dirname, 'accountController.js'));
const AccountModel = require(path.join(__dirname, '..', 'models', 'Account.js'));
const accountTypes = require(path.join(__dirname, 'constants', 'accountTypes.js'));


const insertNewStudent = async (stundentData) => {
    // const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newStudent = await StudentModel.create(
        {
            email: stundentData.email,
            password: stundentData.password,
            name: stundentData.name,
            guardian_name: stundentData.guardian_name,
            contact: stundentData.contact,
            account_type: accountTypes.student,
            is_blocked: false,
            activities: stundentData.activities,
            courses_taken_id: stundentData.courses_taken_id
        }
    );
    await AccountController.createNewAccount( newStudent );
    return newStudent;
};




const getAllStudents = async (req, res) => {
    try {
        // console.log(req.query);
        if(req.query.course_id !== undefined) {
            const classStudents = await StudentModel.find(
                                                            { courses_taken_id: req.query.course_id }
                                                         ).sort({ createdAt: -1 });
            res.json( classStudents );
            return;
        }
        const students = await StudentModel.find({}).sort({ createdAt: -1 });
        res.json( students );
        return;
    } catch (err) {
        res.json({ message: err.message });
        return;
    }
};


const createNewStudent = async (req, res) => {
    const conflict = await StudentModel.findOne({ name: req.body.name }).exec();
    if (conflict) {
        res.status(409);
        res.json({
            message: 'Email conflict',
            conflict: true
    });
        return;
    }

    const newStudent = await insertNewStudent(req.body);
    res.json( newStudent );
};



const deleteStudent = async (req, res) => {

};






const getStudent = async (req, res) => {
    StudentModel.findById(req.params.id).then(result => {
        res.json( result );
    }).catch(err => {
        res.json({ message: 'Error retrieving student' });
        console.err( err );
    });
}

const updateStudent = async (req, res) => {
    console.log(req.body.update_type);
    if(req.body.update_type === 'change') {
        const updatedStudent = await StudentModel.updateOne(
                                    {
                                        _id: req.params.id
                                    },
                                    {
                                        $set: {
                                            email: req.body.email,
                                            name: req.body.name,
                                            guardian_name: req.body.guardian_name,
                                            contact: req.body.contact
                                        }
                                    }
        );
        res.json( updatedStudent );
        return;
    } else if (req.body.update_type === 'remove') {
        const updatedStudent = await StudentModel.updateOne(
            {
                _id: req.params.id,
            },
            {
                $pull: { courses_taken_id: req.body.course_id }
            }
        );
        res.json( updatedStudent );
        return;
    } else if (req.body.update_type === 'add') {
        const updatedStudent = await StudentModel.updateOne(
            {
                _id: req.params.id,
            },
            {
                $addToSet: { courses_taken_id: req.body.course_id }
            }
        );
        res.json( updatedStudent );
        return;
    } else if (req.body.update_type === 'block') {
        const updatedStudent = await StudentModel.updateOne(
            {
                _id: req.params.id,
            },
            {
                $set: {
                    is_blocked: req.body.is_blocked
                }
            }
        );
        res.json( updatedStudent );
        return;
    } else if (req.body.update_type === 'change_password') {
        const updatedStudent = await StudentModel.updateOne(
            {
                _id: req.params.id,
            },
            {
                $set: {
                    password: req.body.password
                }
            }
        );
        const studentUpdatedAccount = await AccountModel.updateOne(
                                                            { user_id: req.params.id },
                                                            { $set: {
                                                                password: req.body.password
                                                            } });
        res.json ({ updatedStudent, studentUpdatedAccount });
        return;
    } else if(req.body.update_type === 'change_activity') {
        const updatedStudentActivityScore = await StudentModel.updateOne(
            { _id:  req.params.id, 'activities.activity_id': req.body.activity_id },
            {
                $set: { 'activities.$.activity_score': req.body.activity_score }
            }
        );
        res.json(updatedStudentActivityScore);
        return;
    } else {
        res.json({ message: '\'update_type\' can only be 1 of the values \'add\', \'remove\', or \'change\'.' });
        return;
    }
};

module.exports = {
    getAllStudents,
    createNewStudent,
    deleteStudent,

    getStudent,
    updateStudent,
    insertNewStudent
};