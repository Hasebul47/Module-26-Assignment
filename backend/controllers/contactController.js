import Contact from '../models/Contact.js';

// @desc    Submit a contact inquiry
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields (name, email, subject, message) are required.' });
    }

    const newContact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Our editorial team will get back to you shortly.',
      data: newContact,
    });
  } catch (error) {
    console.error('submitContact Error:', error);
    return res.status(500).json({ message: error.message || 'Error submitting message' });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private (admin or staff)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json(contacts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
