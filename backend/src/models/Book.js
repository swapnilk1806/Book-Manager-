const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  author: { 
    type: String, 
    required: true 
  },
  tags: { 
    type: [String], 
    default: [] 
  },
  status: { 
    type: String, 
    enum: ['Want to Read', 'Reading', 'Completed'], 
    default: 'Want to Read' 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Book', bookSchema);