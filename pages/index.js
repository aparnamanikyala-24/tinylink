import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Fetch all links
  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Create link
  const handleCreate = async () => {
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, code }),
      });

      if (res.status === 409) {
        setMessage('Code already exists');
        setMessageType('error');
        return;
      }

      if (!res.ok) throw new Error('Error creating link');

      setMessage('Link created!');
      setMessageType('success');
      setUrl('');
      setCode('');
      fetchLinks();
    } catch (err) {
      setMessage('Error creating link');
      setMessageType('error');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  // Delete link
  const handleDelete = async (code) => {
    try {
      const res = await fetch(`/api/links/${code}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error deleting link');
      setMessage('Link deleted');
      setMessageType('success');
      fetchLinks();
    } catch (err) {
      setMessage('Error deleting link');
      setMessageType('error');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  // Copy short URL
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(`${window.location.origin}/${code}`);
    setMessage('Copied to clipboard!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>TinyLink Dashboard</h1>

      {message && (
        <div style={{ 
          color: messageType === 'success' ? 'green' : 'red', 
          marginBottom: '10px' 
        }}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: '6px', width: '60%', marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Custom code (optional)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ padding: '6px', width: '25%', marginRight: '10px' }}
        />
        <button 
          onClick={handleCreate}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th>Code</th>
              <th>URL</th>
              <th>Clicks</th>
              <th>Last Clicked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '10px' }}>
                  No links yet.
                </td>
              </tr>
            ) : (
              links.map((link) => (
                <tr key={link.code} style={{ borderBottom: '1px solid #eee' }}>
                  <td>{link.code}</td>
                  <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <a 
                      href={`/${link.code}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#1E90FF', textDecoration: 'underline' }}
                    >
                      {link.url}
                    </a>
                  </td>
                  <td>{link.clicks}</td>
                  <td>{link.last_clicked || '-'}</td>
                  <td>
                    <button 
                      style={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        padding: '4px 8px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleDelete(link.code)}
                    >
                      Delete
                    </button>
                    <button 
                      style={{
                        marginLeft: '5px',
                        padding: '4px 8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={() => copyToClipboard(link.code)}
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
