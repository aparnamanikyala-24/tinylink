export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({
      ok: true,
      version: '1.0'
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
