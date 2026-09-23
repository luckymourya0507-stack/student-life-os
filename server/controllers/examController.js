const Exam = require('../models/Exam');
const inMemoryStore = require('../config/inMemoryStore');
const { getIsConnected } = require('../config/db');

const getExams = async (req, res) => {
  try {
    const { search } = req.query;

    if (!getIsConnected()) {
      let list = [...inMemoryStore.exams];
      if (search) {
        list = list.filter((e) => e.examName.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase()));
      }
      return res.json(list);
    }

    let query = { userId: req.user.id };
    if (search) {
      query.$or = [
        { examName: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }
    const exams = await Exam.find(query).sort({ date: 1 });
    return res.json(exams);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createExam = async (req, res) => {
  try {
    const { examName, subject, date, time, room, description } = req.body;
    if (!examName || !subject || !date) {
      return res.status(400).json({ message: 'Exam name, subject, and date are required' });
    }

    if (!getIsConnected()) {
      const newExam = {
        _id: 'exam_' + Date.now(),
        userId: req.user.id || req.user._id,
        examName,
        subject,
        date: new Date(date),
        time: time || '10:00 AM',
        room: room || 'Main Hall',
        description: description || ''
      };
      inMemoryStore.exams.push(newExam);
      return res.status(201).json(newExam);
    }

    const exam = await Exam.create({
      userId: req.user.id,
      examName,
      subject,
      date,
      time: time || '10:00 AM',
      room: room || 'Main Hall',
      description: description || ''
    });

    return res.status(201).json(exam);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const { examName, subject, date, time, room, description } = req.body;

    if (!getIsConnected()) {
      const exam = inMemoryStore.exams.find((e) => e._id === req.params.id);
      if (!exam) return res.status(404).json({ message: 'Exam not found' });

      if (examName !== undefined) exam.examName = examName;
      if (subject !== undefined) exam.subject = subject;
      if (date !== undefined) exam.date = new Date(date);
      if (time !== undefined) exam.time = time;
      if (room !== undefined) exam.room = room;
      if (description !== undefined) exam.description = description;
      return res.json(exam);
    }

    const exam = await Exam.findOne({ _id: req.params.id, userId: req.user.id });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    if (examName !== undefined) exam.examName = examName;
    if (subject !== undefined) exam.subject = subject;
    if (date !== undefined) exam.date = date;
    if (time !== undefined) exam.time = time;
    if (room !== undefined) exam.room = room;
    if (description !== undefined) exam.description = description;

    const updatedExam = await exam.save();
    return res.json(updatedExam);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const index = inMemoryStore.exams.findIndex((e) => e._id === req.params.id);
      if (index !== -1) {
        inMemoryStore.exams.splice(index, 1);
      }
      return res.json({ message: 'Exam deleted successfully' });
    }

    const exam = await Exam.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    return res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExams,
  createExam,
  updateExam,
  deleteExam
};
