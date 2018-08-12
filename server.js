const express = require('express');
const dev = process.env.NODE_ENV !== 'production';
const next = require('next');
const app = next({ dev });
const handle = app.getRequestHandler();
const Cookies = require('cookies');
const cookieParser = require('cookie-parser');
const Prismic = require('prismic-javascript');
const { linkResolver } = require('./helpers');

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('/blog/:slug', (req, res) => {
      const nextJsPage = '/blogPost';
      const queryParams = { slug: req.params.slug };
      app.render(req, res, nextJsPage, queryParams);
    });

    server.get('/preview', (req, res) => {
      const { token } = req.query;
      Prismic.getApi('https://nextjs-blog.prismic.io/api/v2', {
        req: req
      }).then(api => {
        api.previewSession(token, linkResolver, '/').then(url => {
          const cookies = new Cookies(req, res);
          cookies.set(Prismic.previewCookie, token, {
            maxAge: 30 * 60 * 1000,
            path: '/',
            httpOnly: false
          });
          res.redirect(302, url);
        });
      });
    });

    server.get('*', (req, res) => handle(req, res));

    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready http://localhost:3000 <');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
