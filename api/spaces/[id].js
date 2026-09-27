import { getSpaceById } from '../../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
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

    return res.status(200).json(space);
  } catch (err) {
    console.error('[API Error /api/spaces/[id]]:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
