import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  initDb,
  createSpace,
  getSpaceById,
  addMoment,
  updateMoment,
  deleteMoment,
  getRecapBySpaceId
} from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Database connection / memory fallback
initDb();

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'OurStory Backend', timestamp: new Date().toISOString() });
});

// POST /api/spaces — create a space
app.post('/api/spaces', async (req, res) => {
  try {
    const { name, started_at } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Space name is required' });
    }

    const newSpace = await createSpace({
      name: name.trim(),
      started_at: started_at || null
    });

    res.status(201).json(newSpace);
  } catch (err) {
    console.error('Error creating space:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/spaces/:id — return space info + moments sorted by date
app.get('/api/spaces/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const space = await getSpaceById(id);

    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    res.json(space);
  } catch (err) {
    console.error('Error fetching space:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/spaces/:id/moments — add a new moment
app.post('/api/spaces/:id/moments', async (req, res) => {
  try {
    const { id } = req.params;
    const space = await getSpaceById(id);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    const { title, description, moment_date, photo_url, category } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!moment_date) {
      return res.status(400).json({ error: 'Moment date is required' });
    }

    const newMoment = await addMoment(id, {
      title: title.trim(),
      description,
      moment_date,
      photo_url,
      category
    });

    res.status(201).json(newMoment);
  } catch (err) {
    console.error('Error adding moment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/moments/:id — edit a moment
app.put('/api/moments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, moment_date, photo_url, category } = req.body;

    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    const updated = await updateMoment(id, {
      title: title ? title.trim() : undefined,
      description,
      moment_date,
      photo_url,
      category
    });

    if (!updated) {
      return res.status(404).json({ error: 'Moment not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating moment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/moments/:id — delete a moment
app.delete('/api/moments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteMoment(id);

    if (!success) {
      return res.status(404).json({ error: 'Moment not found' });
    }

    res.json({ success: true, message: 'Moment deleted successfully' });
  } catch (err) {
    console.error('Error deleting moment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/spaces/:id/recap — computed recap stats
app.get('/api/spaces/:id/recap', async (req, res) => {
  try {
    const { id } = req.params;
    const recap = await getRecapBySpaceId(id);

    if (!recap) {
      return res.status(404).json({ error: 'Space not found' });
    }

    res.json(recap);
  } catch (err) {
    console.error('Error computing recap:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`[OurStory] Backend running on port ${PORT}`);
});
