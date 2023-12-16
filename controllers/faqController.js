
const path = require('path');
const FaqModel = require(path.join(__dirname, '..', 'models', 'Faq.js'));


const getAllFaqs = async (req, res) => {
    try {
        const Faqs = await FaqModel.find().sort({ createdAt: -1 });
        res.json( Faqs );
        return;
    } catch (err) {
        res.json({ message: 'Error retrieving Faqs' });
        return;
    }
};

const createNewFaq = async (req, res) => {
    try {
        const conflict = await FaqModel.findOne({ question: req.body.question }).exec();
        if (conflict) {
            res.status(409);
            res.json({
                message: 'Question conflict',
                conflict: true
            });
            return;
        }

        const newFaq = await FaqModel.create(
            {
                question: req.body.question,
                answer: req.body.answer
            }
        );
        res.json( newFaq );
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
};

const updateFaq = async (req, res) => {
    try {
        const conflict = await FaqModel.findOne({ _id: req.body.id }).exec();
        console.log(conflict);
        if (conflict) {
            const result = await FaqModel.updateOne(
                    { _id: req.body.id }, 
                    { $set: {
                        question: req.body.question,
                        answer: req.body.answer
                    }
                }
            );
            // console.log(result);
            res.json( result );
            return;
        }
        
        return;
    } catch(err) {
        const newFaq = await FaqModel.create(
            {
                question: req.body.question,
                answer: req.body.answer
            }
        );
        // console.log(newFaq);
        res.json( newFaq );
        // res.json({ message: err.message });
        return;
    }
};

const deleteFaq = async (req, res) => {
    try {
        const result = await FaqModel.deleteOne({ _id: req.body.id });
        res.json( result );
        return;
    } catch (err) {
        res.json({ message: err.message });
        return;
    }
};


const getFaq = async (req, res) => {
    FaqModel.findById(req.params.id).then(result => {
        res.json( result );
    }).catch(err => {
        res.json({ message: err.message });
        console.error( err );
    });
}


module.exports = {
    getAllFaqs,
    createNewFaq,
    updateFaq,
    deleteFaq,
    getFaq
};