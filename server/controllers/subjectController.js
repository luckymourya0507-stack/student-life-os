const Subject = require('../models/Subject');
const inMemoryStore = require('../config/inMemoryStore');
const { getIsConnected } = require('../config/db');

const getSubjects = async (req, res) => {
  try {
    const { search } = req.query;

    if (!getIsConnected()) {
      let list = [...inMemoryStore.subjects];
      if (search) {
        list = list.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase()));
      }
      return res.json(list);
    }

    let query = { userId: req.user.id };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    const subjects = await Subject.find(query).sort({ createdAt: -1 });
    return res.json(subjects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const { name, code, teacher, description } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: 'Subject name and code are required' });
    }

    if (!getIsConnected()) {
      const newSubject = {
        _id: 'sub_' + Date.now(),
        userId: req.user.id || req.user._id,
        name,
        code,
        teacher: teacher || '',
        description: description || ''
      };
      inMemoryStore.subjects.unshift(newSubject);
      return res.status(201).json(newSubject);
    }

    const subject = await Subject.create({
      userId: req.user.id,
      name,
      code,
      teacher: teacher || '',
      description: description || ''
    });

    return res.status(201).json(subject);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { name, code, teacher, description } = req.body;

    if (!getIsConnected()) {
      const subject = inMemoryStore.subjects.find((s) => s._id === req.params.id);
      if (!subject) return res.status(404).json({ message: 'Subject not found' });

      if (name !== undefined) subject.name = name;
      if (code !== undefined) subject.code = code;
      if (teacher !== undefined) subject.teacher = teacher;
      if (description !== undefined) subject.description = description;
      return res.json(subject);
    }

    const subject = await Subject.findOne({ _id: req.params.id, userId: req.user.id });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    if (name !== undefined) subject.name = name;
    if (code !== undefined) subject.code = code;
    if (teacher !== undefined) subject.teacher = teacher;
    if (description !== undefined) subject.description = description;

    const updatedSubject = await subject.save();
    return res.json(updatedSubject);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const index = inMemoryStore.subjects.findIndex((s) => s._id === req.params.id);
      if (index !== -1) {
        inMemoryStore.subjects.splice(index, 1);
      }
      return res.json({ message: 'Subject deleted successfully' });
    }

    const subject = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    return res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject
};
