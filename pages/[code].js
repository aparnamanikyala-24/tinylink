import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CodeRedirect() {
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    if (!code) return;
    window.location.href = `/api/redirect/${code}`;
  }, [code]);

  return <p>Redirecting...</p>;
}
