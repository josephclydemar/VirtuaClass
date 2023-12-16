const path = require('path');
const { nanoid } = require('nanoid');
const ActivityModel = require(path.join(__dirname, '..', 'models', 'Activity.js'));
const StudentModel = require(path.join(__dirname, '..', 'models', 'Student.js'));

async function getActivities(req, res) {
    try {
        if(req.query.course_id !== undefined) {
            const classActivities = await ActivityModel
                                                .find({ course_id: req.query.course_id })
                                                .sort({ createdAt: 1 });
            res.json(classActivities);
            return;
        }
        const activities = await ActivityModel.find({}).sort({ createdAt: 1 });
        res.json(activities);
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
}

async function createNewActivity(req, res) {
    try {
        const conflictActivity = await ActivityModel.findOne({ 
                                                                title: req.body.title,
                                                                course_id: req.body.course_id
                                                             }).exec();
        console.log(conflictActivity);
        if(conflictActivity !== null) {
            res.json({ message: 'Activity Title conflict', conflict: true, conflictActivity });
            return;
        }
        const createdNewActivity = await ActivityModel.create({
            title: req.body.title,
            description: req.body.description,
            documents_link: req.body.documents_link,
            shortened_documents_link: nanoid(10),
            deadline: req.body.deadline,
            course_id: req.body.course_id
        });
        const addedToStudents = await StudentModel.updateMany(
                                                                { courses_taken_id: req.body.course_id },
                                                                {
                                                                    $addToSet: { 
                                                                        activities: {
                                                                            activity_id: createdNewActivity._id,
                                                                            activity_course_id: createdNewActivity.course_id,
                                                                            activity_score: 0
                                                                            }
                                                                        }
                                                                }
                                                             );
        res.json({ createdNewActivity, addedToStudents });
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
}




async function getActivity(req, res) {
    try {
        const activity = await ActivityModel.findById(req.params.id);
        res.json(activity);
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
}

async function updateActivity(req, res) {
    try {
        const conflictActivity = await ActivityModel.findOne({
                                                                title: req.body.title,
                                                                course_id: req.body.course_id
                                                            }).exec();
        if(conflictActivity !== null) {
            res.json({ message: 'Conflict Activity Update', conflict: true, conflictActivity });
            return;
        }
        const updatedActivity = await ActivityModel.updateOne(
                                                                { _id: req.params.id },
                                                                { $set: {
                                                                    title: req.body.title,
                                                                    description: req.body.description,
                                                                    documents_link: req.body.documents_link,
                                                                    deadline: req.body.deadline
                                                                } }
                                                             );
        res.json(updatedActivity);
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
}

async function deleteActivity(req, res) {
    try {
        const deletedActivity = await ActivityModel.deleteOne({ _id: req.params.id });
        const removedFromStudents = await StudentModel.updateMany({ 'activities.activity_id': req.params.id },
                                                                  {
                                                                    $pull: {
                                                                        activities: {
                                                                            activity_id: req.params.id
                                                                        }
                                                                    }
                                                                  })
        res.json({ deletedActivity, removedFromStudents });
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
}

module.exports = {
    getActivities,
    createNewActivity,
    getActivity,
    updateActivity,
    deleteActivity
}