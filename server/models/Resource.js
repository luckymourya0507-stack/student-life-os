const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true
    },
    url: {
      type: String,
      required: [true, 'Resource URL is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['PDF', 'Video', 'Website', 'Documentation', 'GitHub', 'Other'],
      default: 'Website'
    },
    subject: {
      type: String,
      default: 'General'
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

module.exports = mongoose.model('Resource', resourceSchema);
