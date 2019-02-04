const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    // createDate: {type: Date, default: Date.now(), required: true},
    // updateDate: {type: Date, default: Date.now(), required: true},
    // email: {type: String, required: true}
})

userSchema.methods.comparePassword = (inputPass, originPass) => {
    return bcrypt.compareSync(inputPass, originPass);
}
userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}
module.exports = mongoose.model('users', userSchema, 'users');