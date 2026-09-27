import { createSpace } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { name, started_at } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Space name is required' });
    }

    const newSpace = await createSpace({
      name: name.trim(),
      started_at: started_at || null
    });

    return res.status(201).json(newSpace);
  } catch (err) {
    console.error('[API Error /api/spaces]:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
