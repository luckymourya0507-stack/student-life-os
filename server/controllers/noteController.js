const Note = require('../models/Note');
const inMemoryStore = require('../config/inMemoryStore');
const { getIsConnected } = require('../config/db');

const getNotes = async (req, res) => {
  try {
    const { search, subject } = req.query;

    if (!getIsConnected()) {
      const userId = req.user.id || req.user._id;
      let list = inMemoryStore.notes.filter((note) => note.userId === userId);
      if (search) {
        list = list.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));
      }
      if (subject && subject !== 'All') {
        list = list.filter((n) => n.subject === subject);
      }
      return res.json(list);
    }

    let query = { userId: req.user.id };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    if (subject && subject !== 'All') query.subject = subject;

    const notes = await Note.find(query).sort({ updatedAt: -1 });
    return res.json(notes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getNoteById = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const note = inMemoryStore.notes.find((n) => n._id === req.params.id && n.userId === (req.user.id || req.user._id));
      if (!note) return res.status(404).json({ message: 'Note not found' });
      return res.json(note);
    }
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    return res.json(note);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content, subject, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    if (!getIsConnected()) {
      const newNote = {
        _id: 'note_' + Date.now(),
        userId: req.user.id || req.user._id,
        title,
        content,
        subject: subject || 'General',
        tags: parsedTags || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryStore.notes.unshift(newNote);
      return res.status(201).json(newNote);
    }

    const note = await Note.create({
      userId: req.user.id,
      title,
      content,
      subject: subject || 'General',
      tags: parsedTags || []
    });

    return res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content, subject, tags } = req.body;

    if (!getIsConnected()) {
      const note = inMemoryStore.notes.find((n) => n._id === req.params.id && n.userId === (req.user.id || req.user._id));
      if (!note) return res.status(404).json({ message: 'Note not found' });

      if (title !== undefined) note.title = title;
      if (content !== undefined) note.content = content;
      if (subject !== undefined) note.subject = subject;
      if (tags !== undefined) {
        note.tags = typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : tags;
      }
      note.updatedAt = new Date();
      return res.json(note);
    }

    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (subject !== undefined) note.subject = subject;
    if (tags !== undefined) {
      note.tags = typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : tags;
    }

    const updatedNote = await note.save();
    return res.json(updatedNote);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const index = inMemoryStore.notes.findIndex((n) => n._id === req.params.id && n.userId === (req.user.id || req.user._id));
      if (index === -1) return res.status(404).json({ message: 'Note not found' });
      inMemoryStore.notes.splice(index, 1);
      return res.json({ message: 'Note deleted successfully' });
    }

    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    return res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
