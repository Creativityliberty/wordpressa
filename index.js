const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const WP = axios.create({
  baseURL: process.env.WP_BASE_URL,
  auth: {
    username: process.env.WP_USERNAME,
    password: process.env.WP_PASSWORD
  },
  headers: {
    'Content-Type': 'application/json'
  }
});

app.use(express.json());

app.get('/posts', async (req, res) => {
  try {
    const response = await WP.get('/posts');
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const response = await WP.get(`/posts/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/posts', async (req, res) => {
  try {
    const response = await WP.post('/posts', req.body);
    res.status(201).json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.put('/posts/:id', async (req, res) => {
  try {
    const response = await WP.put(`/posts/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
