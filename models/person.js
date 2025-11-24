const mongoose = require('mongoose')

const phoneNumberValidator = (value) => {
  // длина минимум 8 символов
  if (!value || value.length < 8) {
    return false
  }
  // 2–3 цифры, дефис, потом только цифры (09-1234556, 040-22334455)
  return /^\d{2,3}-\d+$/.test(value)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: phoneNumberValidator,
      message:
        'Phone number must be at least 8 characters and in form XX-XXXXXXX or XXX-XXXXXXX',
    },
  },
})

module.exports = mongoose.model('Person', personSchema)
