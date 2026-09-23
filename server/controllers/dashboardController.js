const Subject = require('../models/Subject');
const Task = require('../models/Task');
const Note = require('../models/Note');
const Exam = require('../models/Exam');
const inMemoryStore = require('../config/inMemoryStore');
const { getIsConnected } = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.json({
        subjects: inMemoryStore.subjects.length,
        tasks: inMemoryStore.tasks.length,
        notes: inMemoryStore.notes.length,
        exams: inMemoryStore.exams.length,
        completedTasks: inMemoryStore.tasks.filter((t) => t.status === 'Completed').length,
        pendingTasks: inMemoryStore.tasks.filter((t) => t.status !== 'Completed').length
      });
    }

    const userId = req.user.id;
    const [subjects, tasks, notes, exams, completedTasks, pendingTasks] = await Promise.all([
      Subject.countDocuments({ userId }),
      Task.countDocuments({ userId }),
      Note.countDocuments({ userId }),
      Exam.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'Completed' }),
      Task.countDocuments({ userId, status: { $ne: 'Completed' } })
    ]);

    return res.json({
      subjects,
      tasks,
      notes,
      exams,
      completedTasks,
      pendingTasks
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats
};
