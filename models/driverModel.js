const { Schema, model } = require('mongoose')

const Driver = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'customer'
    },
    name: String,
    car: {
        type: Array(Schema.Types.ObjectId),
        default: [],
        ref: 'car'
    },
    raiting: {
        type: Number,
        default: 0
    },
    rides: {
        type: Array(Schema.Types.ObjectId),
        default: [],
        ref: 'ride'
    }
})

module.exports = model('driver', Driver)