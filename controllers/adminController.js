const path = require('path');
const fsPromise = require('fs').promises;
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const AdminModel = require(path.join(__dirname, '..', 'models', 'Admin.js'));


const AccountController = require(path.join(__dirname, 'accountController.js'));
const accountTypes = require(path.join(__dirname, 'constants', 'accountTypes.js'));




const getAllAdmins = async (req, res) => {
    try {
        const admins = await AdminModel.find({}).sort({ createdAt: -1 });
        res.json( admins );
        return;
    } catch (err) {
        res.json({ message: err.message });
        console.error(err.message);
        return;
    }
};

const createNewAdmin = async (req, res) => {
    try {
        const conflict = await AdminModel.findOne({ email: req.body.email }).exec();
    if (conflict) {
        res.status(409);
        res.json({
            message: 'Email conflict',
            conflict: true
        });
        return;
    }

    const systemGeneratedPassword = await bcrypt.hash(uuid(), 10);
    const newAdmin = await AdminModel.create(
        {
            email: req.body.email,
            password: systemGeneratedPassword,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            account_type: accountTypes.admin,
            is_blocked: false
        }
    );
    await AccountController.createNewAccount( newAdmin );
    
    
    res.json( newAdmin );
    return;
    } catch (err) {
        res.json({ message: err.message });
        console.error(err.message);
        return;
    }
};

const updateAdmin = async (req, res) => {
    try {
        if(req.body.update_type === 'change') {
            const updatedAdmin = await AdminModel.updateOne(
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
            res.json(updatedAdmin);
            return;
        } else if(req.body.update_type == 'block') {
            console.log(req.body.is_blocked);
            const updatedAdmin = await AdminModel.updateOne(
                {
                    _id: req.body.id
                },
                {
                    $set: {
                        is_blocked: req.body.is_blocked
                    }
                }
            );
            res.json(updatedAdmin);
            return;
        }
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
};

const deleteAdmin = async (req, res) => {
    try{
        const deletedAdmin = await AdminModel.deleteOne({ _id: req.body.id });
        res.json(deletedAdmin);
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
};





const getAdmin = async (req, res) => {
    try {
        const result = await AdminModel.findById(req.params.id);
        res.json(result);
        return;
    } catch (err) {
        res.json({ message: err.message });
        console.err( err.message );
        return;
    }
}

module.exports = {
    getAllAdmins,
    createNewAdmin,
    updateAdmin,
    deleteAdmin,
    getAdmin
};