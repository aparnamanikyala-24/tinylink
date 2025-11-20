import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url, customCode } = req.body;

    if (!url) return res.status(400).json({ message: 'URL is required' });

    try { new URL(url); } 
    catch { return res.status(400).json({ message: 'Invalid URL' }); }

    const code = customCode || Math.random().toString(36).substring(2, 8);

    const exists = await pool.query('SELECT * FROM links WHERE code=$1', [code]);
    if (exists.rows.length > 0) return res.status(409).json({ message: 'Code already exists' });

    const result = await pool.query(
      'INSERT INTO links (code, url) VALUES ($1, $2) RETURNING *',
      [code, url]
    );

    res.status(201).json(result.rows[0]);

  } else if (req.method === 'GET') {
    const result = await pool.query('SELECT * FROM links ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
