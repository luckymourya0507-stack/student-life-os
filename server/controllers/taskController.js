const Task = require('../models/Task');
const inMemoryStore = require('../config/inMemoryStore');
const { getIsConnected } = require('../config/db');

const getTasks = async (req, res) => {
  try {
    const { search, priority, status } = req.query;

    if (!getIsConnected()) {
      let list = [...inMemoryStore.tasks];
      if (search) {
        list = list.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
      }
      if (priority && priority !== 'All') {
        list = list.filter((t) => t.priority === priority);
      }
      if (status && status !== 'All') {
        list = list.filter((t) => t.status === status);
      }
      return res.json(list);
    }

    let query = { userId: req.user.id };
    if (search) query.title = { $regex: search, $options: 'i' };
    if (priority && priority !== 'All') query.priority = priority;
    if (status && status !== 'All') query.status = status;

    const tasks = await Task.find(query).sort({ dueDate: 1 });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const task = inMemoryStore.tasks.find((t) => t._id === req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      return res.json(task);
    }
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title and due date are required' });
    }

    if (!getIsConnected()) {
      const newTask = {
        _id: 'task_' + Date.now(),
        userId: req.user.id || req.user._id,
        title,
        description: description || '',
        dueDate: new Date(dueDate),
        priority: priority || 'Medium',
        status: status || 'Pending'
      };
      inMemoryStore.tasks.unshift(newTask);
      return res.status(201).json(newTask);
    }

    const task = await Task.create({
      userId: req.user.id,
      title,
      description: description || '',
      dueDate,
      priority: priority || 'Medium',
      status: status || 'Pending'
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!getIsConnected()) {
      const task = inMemoryStore.tasks.find((t) => t._id === req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });

      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (dueDate !== undefined) task.dueDate = new Date(dueDate);
      if (priority !== undefined) task.priority = priority;
      if (status !== undefined) task.status = status;
      return res.json(task);
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    return res.json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const index = inMemoryStore.tasks.findIndex((t) => t._id === req.params.id);
      if (index !== -1) {
        inMemoryStore.tasks.splice(index, 1);
      }
      return res.json({ message: 'Task deleted successfully' });
    }

    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    return res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
