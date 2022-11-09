const mongoose = require('mongoose');
const validator = require('validator');
const bycrypt = require('bcryptjs');

//name,email,photo,,password,passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email address'],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, 'Please enter a valid email'],
  },
  photos: String,
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlenght: 8,
    select: false, //sa  nu se vada parola cand dam login
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This works only on  SAVE!!! or on CREATE!!!  NOT IN UPDATE!!!
      validator: function (el) {
        return el === this.password; // pt. a confirma parola
      },
      message: 'Passwords are not the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  this.password = await bycrypt.hash(this.password, 12); //folosim bcrypt pt a coda parolele /adica hashing

  this.passwordConfirm = undefined; //dupa ce confirmam parola ,o  facem undefined pt ca nu conteaza cum se salveaza in baza de date
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bycrypt.compare(candidatePassword, userPassword); //ca sa comparam parola introdusa daca este la fel cu cea al userului care vrea sa se logheze care este criptata
};

const User = mongoose.model('User', userSchema);

module.exports = User;
