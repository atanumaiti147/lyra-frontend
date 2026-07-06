import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageLoadingBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 450);
    return () => clearTimeout(t);
  }, [location.pathname]);

  if (!visible) return null;
  return <div className="page-loading-bar" aria-hidden="true" />;
}
