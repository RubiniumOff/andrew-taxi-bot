const { Schema, model } = require('mongoose')

const Car = new Schema({
    driver_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'driver'
    },
    color: String,
    model: String,
    number: Number,
})

module.exports = model('car', Car)