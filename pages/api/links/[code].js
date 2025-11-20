import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  const { code } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM links WHERE code=$1', [code]);
      if (result.rows.length === 0) return res.status(404).json({ message: 'Link not found' });

      // Optional: increment clicks if this is for redirect
      await pool.query('UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code=$1', [code]);

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: 'Database error' });
    }

  } else if (req.method === 'DELETE') {
    try {
      const result = await pool.query('SELECT * FROM links WHERE code=$1', [code]);
      if (result.rows.length === 0) return res.status(404).json({ message: 'Link not found' });

      await pool.query('DELETE FROM links WHERE code=$1', [code]);
      res.status(200).json({ message: 'Link deleted successfully' });
    } catch (err) {
      console.error("Database error on delete:", err);
      res.status(500).json({ message: 'Database error while deleting link' });
    }

  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
