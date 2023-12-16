
const path = require('path');
const CourseModel = require(path.join(__dirname, '..', 'models', 'Course.js'));


const getAllCourses = async (req, res) => {
    try {
        let courses = undefined;
        // console.log(req.query.instructor_id);
        if(req.query.instructor_id !== undefined) {
            courses = await CourseModel.find({ instructor_id: req.query.instructor_id }).sort({ createdAt: -1 });
            res.json( courses );
            return;
        }
        courses = await CourseModel.find().sort({ createdAt: -1 });
        res.json( courses );
        return;
    } catch (err) {
        res.json({ message: err.message });
        return;
    }
};

const getCourse = async (req, res) => {
    CourseModel.findById(req.params.id).then(result => {
        res.json( result );
        return;
    }).catch(err => {
        res.json({ message: err.message });
        console.error( err.message );
        return;
    });
};





const createNewCourse = async (req, res) => {
    try {
        const conflict = await CourseModel.findOne({ name: req.body.name }).exec();
        if (conflict) {
            res.status(409);
            res.json({
                message: 'Name conflict',
                conflict: true
            });
            return;
        }

        const newCourse = await CourseModel.create(
            {
                name: req.body.name,
                fee: req.body.fee,
                description: req.body.description,
                time_slot_id: req.body.time_slot_id,
                instructor_id: req.body.instructor_id
            }
        );
        res.json( newCourse );
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
};

const updateCourse = async (req, res) => {

};

const deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await CourseModel.deleteOne({ _id: req.body.id });
        res.json( deletedCourse );
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
};



module.exports = {
    getAllCourses,
    createNewCourse,
    updateCourse,
    deleteCourse,
    getCourse
};