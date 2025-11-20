import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  const { code } = req.query;

  try {
    const result = await pool.query('SELECT * FROM links WHERE code=$1', [code]);

    if (result.rows.length === 0) {
      return res.status(404).send('Link not found');
    }

    const link = result.rows[0];

    // Update clicks and last_clicked
    await pool.query(
      'UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code = $1',
      [code]
    );

    // Redirect to original URL
    res.writeHead(302, { Location: link.url });
    res.end();
  } catch (err) {
    console.error("Redirect error:", err);
    res.status(500).send('Server error');
  }
}
