import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './client';

const DEFAULT_CONFIG = {
  botInviteUrl: '#',
  supportServerInvite: '#',
  logoUrl: '',
  faviconUrl: '',
  seoTitle: '',
  seoDescription: '',
};

const SiteConfigContext = createContext(DEFAULT_CONFIG);

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    api.siteConfig().then((d) => setConfig((c) => ({ ...c, ...d }))).catch(() => {});
  }, []);

  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
