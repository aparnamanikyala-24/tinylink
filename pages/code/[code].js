import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LinkStats() {
  const router = useRouter();
  const { code } = router.query;

  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code) return;

    fetch(`/api/links/${code}`)
      .then((res) => {
        if (!res.ok) throw new Error('Link not found');
        return res.json();
      })
      .then((data) => {
        setLink(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [code]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Stats for Code: {link.code}</h1>
      <p><strong>Original URL:</strong> <a href={link.url} target="_blank">{link.url}</a></p>
      <p><strong>Total Clicks:</strong> {link.clicks}</p>
      <p><strong>Last Clicked:</strong> {link.last_clicked || '-'}</p>
    </div>
  );
}
