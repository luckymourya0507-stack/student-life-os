const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    examName: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Exam date is required']
    },
    time: {
      type: String,
      default: '10:00 AM'
    },
    room: {
      type: String,
      default: 'Hall A'
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Exam', examSchema);
