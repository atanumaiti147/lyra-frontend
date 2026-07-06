import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PageLoadingBar from './PageLoadingBar';
import { useSiteConfig } from '../api/SiteConfigContext';

export default function Layout({ children }) {
  const { botInviteUrl, supportServerInvite, seoTitle, seoDescription, faviconUrl } = useSiteConfig();

  useEffect(() => {
    if (seoTitle) document.title = seoTitle;
    if (seoDescription) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', seoDescription);
    }
    if (faviconUrl) {
      let link = document.querySelector('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'icon');
        document.head.appendChild(link);
      }
      link.setAttribute('href', faviconUrl);
    }
  }, [seoTitle, seoDescription, faviconUrl]);

  return (
    <>
      <PageLoadingBar />
      <Navbar botInviteUrl={botInviteUrl} />
      {children}
      <Footer botInviteUrl={botInviteUrl} supportServerInvite={supportServerInvite} />
    </>
  );
}
