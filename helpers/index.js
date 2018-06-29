function linkResolver(doc) {
  if (doc.type === 'blog_post') {
    return `/blog/${doc.uid}`;
  }
  return '/';
}

module.exports = {
  linkResolver
};
