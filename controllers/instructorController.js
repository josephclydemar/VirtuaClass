const path = require('path');
// const fsPromise = require('fs').promises;
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const InstructorModel = require(path.join(__dirname, '..', 'models', 'Instructor.js'));
const CourseModel = require(path.join(__dirname, '..', 'models', 'Course.js'));

const AccountController = require(path.join(__dirname, 'accountController.js'));
const accountTypes = require(path.join(__dirname, 'constants', 'accountTypes.js'));




const getAllInstructors = async (req, res) => {
    try {
        const instructors = await InstructorModel.find({}).sort({ createdAt: -1 });
        res.json( instructors );
        return;
    } catch (err) {
        res.json({ message: err.message });
        console.error(err.message);
        return;
    }
};

const createNewInstructor = async (req, res) => {
    try {
        const conflict = await InstructorModel.findOne({ email: req.body.email }).exec();
        if (conflict) {
            res.status(409);
            res.json({
                message: 'Email conflict',
                conflict: true
            });
            return;
        }

        const systemGeneratedPassword = await bcrypt.hash(uuid(), 10);
        const newInstructor = await InstructorModel.create(
            {
                email: req.body.email,
                password: systemGeneratedPassword,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                account_type: accountTypes.instructor,
                is_blocked: false
            }
        );
        await AccountController.createNewAccount( newInstructor );
        // const svgQR = qr.imageSync(newInstructor.gcash_account_id, { type: 'svg' });
        // await fsPromise.writeFile(path.join(__dirname, '..', 'public', 'svg', newInstructor.qr_code), svgQR);
        res.json( newInstructor );
        return;
    } catch (err) {
        res.json({ message: err.message });
        console.error(err.message);
        return;
    }
};

const updateInstructor = async (req, res) => {
    try {
        if(req.body.update_type === 'change') {
            const updatedInstructor = await InstructorModel.updateOne(
                {
                    _id: req.body.id
                },
                {
                    $set: {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email
                    }
                }
            );
            res.json(updatedInstructor);
            return;
        } else if(req.body.update_type == 'block') {
            // console.log(req.body.is_blocked);
            const updatedInstructor = await InstructorModel.updateOne(
                {
                    _id: req.body.id
                },
                {
                    $set: {
                        is_blocked: req.body.is_blocked
                    }
                }
            );
            res.json(updatedInstructor);
            return;
        }
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
};

const deleteInstructor = async (req, res) => {
    try {
        const deletedInstructor = await InstructorModel.deleteOne({ _id: req.body.id });
        res.json(deletedInstructor);
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
};





const getOneInstructor = async (req, res) => {
    try {
        const result = await InstructorModel.findById(req.params.id);
        res.json(result);
        return;
    } catch(err) {
        res.json({ message: err.message });
        console.error( err.message );
        return;
    }
}

const updateOneInstructor = async (req, res) => {
    try {
        if(req.body.update_type === 'add') {
            const newCourseConflict = await CourseModel.findOne({ name: req.body.course_name }).exec();
            console.log('HERE 6666');
            console.log(newCourseConflict);
            console.log('sdh');
            
            if(newCourseConflict === null) {
                const updatedInstructorSchedule = await InstructorModel.updateOne(
                    { _id: req.params.id },
                    {
                        $addToSet: { schedule_ids: req.body.course_time_slot_id }
                    }
                );
    
                const newCourse = await CourseModel.create({
                    name: req.body.course_name,
                    fee: req.body.course_fee,
                    description: req.body.course_description,
                    time_slot_id: req.body.course_time_slot_id,
                    instructor_id: req.params.id
                });
                res.json({ updatedInstructorSchedule, newCourse });
                return;
            } else {
                res.json({
                    conflict: true, 
                    message: 'Course name already exists',
                    newCourseConflict});
                return;
            }
    
        } else if(req.body.update_type === 'change') {
            let updatedInstructorSchedule = null;
            let updatedCourse = null;

            if(req.body.new_course_time_slot_id !== '') {
                updatedInstructorSchedule = await InstructorModel.updateOne(
                    {
                        _id: req.params.id,
                        schedule_ids: req.body.course_time_slot_id
                    },
                    {
                        $set: {
                            'schedule_ids.$': req.body.new_course_time_slot_id
                        }
                    }
                );
            }
            
            if(req.body.new_course_time_slot_id !== '') {
                updatedCourse = await CourseModel.updateOne(
                    {
                        instructor_id: req.params.id,
                        time_slot_id: req.body.course_time_slot_id
                    },
                    {
                        $set: {
                            name: req.body.course_name,
                            fee: req.body.course_fee,
                            description: req.body.course_description,
                            time_slot_id: req.body.new_course_time_slot_id
                        }
                    }
                );
            } else {
                updatedCourse = await CourseModel.updateOne(
                    {
                        instructor_id: req.params.id,
                        time_slot_id: req.body.course_time_slot_id
                    },
                    {
                        $set: {
                            name: req.body.course_name,
                            fee: req.body.course_fee,
                            description: req.body.course_description
                        }
                    }
                );
            }
            res.json({ updatedInstructorSchedule, updatedCourse });
            return;
        } else if(req.body.update_type === 'remove') {
            const updatedInstructorSchedule = await InstructorModel.updateOne(
                                        { _id: req.params.id },
                                        {
                                            $pull: { schedule_ids: req.body.course_time_slot_id }
                                        }
                                    );
            const deletedCourse = await CourseModel.deleteMany({
                    instructor_id: req.params.id, 
                    time_slot_id: req.body.course_time_slot_id
                });
            res.json({ updatedInstructorSchedule, deletedCourse });
            return;
    
        } else {
            res.json({ message: '\'update_type\' can only be 1 of the values \'add\', \'remove\', or \'change\'.' });
            return;
        }
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
}

module.exports = {
    getAllInstructors,
    createNewInstructor,
    updateInstructor,
    deleteInstructor,
    
    getOneInstructor,
    updateOneInstructor
};