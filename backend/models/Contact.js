import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: [true, 'Please enter a subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please enter your message'],
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
