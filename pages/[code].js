// pages/[code].js
import { useEffect, useState } from "react";

export default function RedirectPage({ code }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    async function go() {
      const res = await fetch(`/api/links/${code}`);
      const data = await res.json();

      setUrl(data.url);

      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = data.url;
      }, 3000);
    }
    go();
  }, [code]);

  return (
    <div style={{ textAlign: "center", paddingTop: "80px" }}>
      <h2>Redirecting…</h2>
      <p>Please wait, you are being redirected.</p>
    </div>
  );
}

RedirectPage.getInitialProps = ({ query }) => {
  return { code: query.code };
};
