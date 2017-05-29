let mongoose = require('mongoose');

// Article Schema

let articleSchema = mongoose.Schema({
    title: {                            // einzelne Felder werden definiert
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

let Article = module.exports = mongoose.model('Article', articleSchema);    //Name des Models, Schema