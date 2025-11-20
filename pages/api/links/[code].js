import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  const { code } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM links WHERE code=$1', [code]);
      if (result.rows.length === 0) return res.status(404).json({ message: 'Link not found' });

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: 'Database error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
