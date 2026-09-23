const Subject = require('../models/Subject');
const Task = require('../models/Task');
const Note = require('../models/Note');
const Exam = require('../models/Exam');
const inMemoryStore = require('../config/inMemoryStore');
const { getIsConnected } = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const userId = req.user.id || req.user._id;
      const userTasks = inMemoryStore.tasks.filter((task) => task.userId === userId);
      return res.json({
        subjects: inMemoryStore.subjects.filter((item) => item.userId === userId).length,
        tasks: userTasks.length,
        notes: inMemoryStore.notes.filter((item) => item.userId === userId).length,
        exams: inMemoryStore.exams.filter((item) => item.userId === userId).length,
        completedTasks: userTasks.filter((task) => task.status === 'Completed').length,
        pendingTasks: userTasks.filter((task) => task.status !== 'Completed').length
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
