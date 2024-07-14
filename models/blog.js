const {Schema, model} = require('mongoose');

//Define User schema
const BlogSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    author: { type: Schema.Types.ObjectId, ref: "User"},
    state: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    read_count: {
        type: Number,
        required: true
    },
    reading_time: Number,
    tags: [String],
    body: {
        type: String,
        required: true,
    },
    timestamp: Date
});


// Export the model
module.exports = model('Blog', BlogSchema);