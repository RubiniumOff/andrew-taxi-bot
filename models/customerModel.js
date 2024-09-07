const { Schema, model } = require('mongoose')

const Customer = new Schema({
    id: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    name : {
        type: String,
        default: null
    },
    raiting: {
        type: Number,
        default: 0
    },
    rides: {
        type: Array(Schema.Types.ObjectId),
        default: [],
        ref: 'ride'
    },
    isBan: {
        type: Boolean,
        default: false
    }
})

module.exports = model('customer', Customer)