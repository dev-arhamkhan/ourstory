import { updateMoment, deleteMoment } from '../../lib/db.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Moment ID is required' });
  }

  if (req.method === 'PUT') {
    try {
      const { title, description, moment_date, photo_url, category } = req.body || {};

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

      return res.status(200).json(updated);
    } catch (err) {
      console.error('[API Error PUT /api/moments/[id]]:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const success = await deleteMoment(id);

      if (!success) {
        return res.status(404).json({ error: 'Moment not found' });
      }

      return res.status(200).json({ success: true, message: 'Moment deleted successfully' });
    } catch (err) {
      console.error('[API Error DELETE /api/moments/[id]]:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
