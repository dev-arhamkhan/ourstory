import { getSpaceById, addMoment } from '../../../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Space ID is required' });
    }

    const space = await getSpaceById(id);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    const { title, description, moment_date, photo_url, category } = req.body || {};

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

    return res.status(201).json(newMoment);
  } catch (err) {
    console.error('[API Error /api/spaces/[id]/moments]:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
