const fsPromise = require('fs').promises;
const path = require('path');
const SchoolModel = require(path.join(__dirname, '..', 'models', 'School.js'));


const getAllSchoolInfo = async (req, res) => {
    SchoolModel.find().then(result => {
        res.json( result[0] );
    }).catch(err => {
        res.json({ message: 'Error retrieving data' });
        console.error(err);
    });
    
};

const createNewSchoolInfo = async (req, res) => {
    const result = await SchoolModel.create(
        {
            schoolName: req.body.schoolName,
            mission: req.body.mission,
            vision: req.body.vision,
            objectives: req.body.objectives,
            paymentLink: req.body.paymentLink,
            contactInformation: req.body.contactInformation
        }
    );
    res.json( result );
};

const updateSchoolInfo = async (req, res) => {
    const content = await SchoolModel.find({});
    console.log(content);
    let result = null;
    if (content.length > 0) {
        result = await SchoolModel.updateOne(
            {
                _id: req.body.id,
            },
            {
                $set: {
                    schoolName: req.body.schoolName,
                    mission: req.body.mission,
                    vision: req.body.vision,
                    objectives: req.body.objectives,
                    paymentLink: req.body.paymentLink,
                    contactInformation: req.body.contactInformation
                }
            }
        );
        console.log("update ran!");
        res.json( result );
        return;
    }
    result = await SchoolModel.create(
        {
            schoolName: req.body.schoolName,
            mission: req.body.mission,
            vision: req.body.vision,
            objectives: req.body.objectives,
            paymentLink: req.body.paymentLink,
            contactInformation: req.body.contactInformation
        }
    );
    console.log("create ran!");
    res.json( result );
};

module.exports = {
    getAllSchoolInfo,
    createNewSchoolInfo,
    updateSchoolInfo
};