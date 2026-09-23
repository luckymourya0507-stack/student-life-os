const Resource = require('../models/Resource');
const inMemoryStore = require('../config/inMemoryStore');
const { getIsConnected } = require('../config/db');

const getResources = async (req, res) => {
  try {
    const { search, type, subject } = req.query;

    if (!getIsConnected()) {
      let list = [...inMemoryStore.resources];
      if (search) {
        list = list.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()));
      }
      if (type && type !== 'All') {
        list = list.filter((r) => r.type === type);
      }
      if (subject && subject !== 'All') {
        list = list.filter((r) => r.subject === subject);
      }
      return res.json(list);
    }

    let query = { userId: req.user.id };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (type && type !== 'All') query.type = type;
    if (subject && subject !== 'All') query.subject = subject;

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    return res.json(resources);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createResource = async (req, res) => {
  try {
    const { title, url, type, subject, description } = req.body;
    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required' });
    }

    if (!getIsConnected()) {
      const newResource = {
        _id: 'res_' + Date.now(),
        userId: req.user.id || req.user._id,
        title,
        url,
        type: type || 'Website',
        subject: subject || 'General',
        description: description || ''
      };
      inMemoryStore.resources.unshift(newResource);
      return res.status(201).json(newResource);
    }

    const resource = await Resource.create({
      userId: req.user.id,
      title,
      url,
      type: type || 'Website',
      subject: subject || 'General',
      description: description || ''
    });

    return res.status(201).json(resource);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateResource = async (req, res) => {
  try {
    const { title, url, type, subject, description } = req.body;

    if (!getIsConnected()) {
      const resource = inMemoryStore.resources.find((r) => r._id === req.params.id);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      if (title !== undefined) resource.title = title;
      if (url !== undefined) resource.url = url;
      if (type !== undefined) resource.type = type;
      if (subject !== undefined) resource.subject = subject;
      if (description !== undefined) resource.description = description;
      return res.json(resource);
    }

    const resource = await Resource.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (title !== undefined) resource.title = title;
    if (url !== undefined) resource.url = url;
    if (type !== undefined) resource.type = type;
    if (subject !== undefined) resource.subject = subject;
    if (description !== undefined) resource.description = description;

    const updatedResource = await resource.save();
    return res.json(updatedResource);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const index = inMemoryStore.resources.findIndex((r) => r._id === req.params.id);
      if (index !== -1) {
        inMemoryStore.resources.splice(index, 1);
      }
      return res.json({ message: 'Resource deleted successfully' });
    }

    const resource = await Resource.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    return res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResources,
  createResource,
  updateResource,
  deleteResource
};
