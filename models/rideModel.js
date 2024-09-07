const { Schema, model } = require('mongoose')

const Ride = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'customer'
    },
    driver_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'driver'
    },
    driver_car: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'car'
    },
    amount: Number,
    driver_raiting: {
        type: Number,
        default: 0
    },
    customer_raiting: {
        type: Number,
        default: 0
    }
})

module.exports = model('ride', Ride)