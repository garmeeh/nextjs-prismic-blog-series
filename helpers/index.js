function linkResolver(doc) {
  if (doc.type === 'blog_post') {
    return `/blog/${doc.uid}`;
  }
  return '/';
}

function trackPageView(url) {
  try {
    window.gtag('config', 'UA-XXXXXXXX-X', {
      page_location: url
    });
  } catch (error) {
    // silence the error in dev mode
    // and/or if gtag fails to load
  }
}

module.exports = {
  linkResolver,
  trackPageView
};
