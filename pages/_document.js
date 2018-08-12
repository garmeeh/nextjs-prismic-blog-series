// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file
import Document, { Head, Main, NextScript } from 'next/document';
import { Fragment } from 'react';
import { PRISMIC_API_URL } from '../config';
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const isProduction = process.env.NODE_ENV === 'production';
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, isProduction };
  }

  setGoogleTags() {
    return {
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-XXXXXXXX-X');
      `
    };
  }

  setPrismic() {
    return {
      __html: `
        window.prismic = {
          endpoint: '${PRISMIC_API_URL}'
        }
      `
    };
  }

  render() {
    const { isProduction } = this.props;
    return (
      <html>
        <body>
          <Main />
          <NextScript />
          {isProduction && (
            <Fragment>
              <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXX-X"
              />
              <script dangerouslySetInnerHTML={this.setGoogleTags()} />
            </Fragment>
          )}

          {!isProduction && (
            <Fragment>
              <script dangerouslySetInnerHTML={this.setPrismic()} />
              <script
                type="text/javascript"
                src="//static.cdn.prismic.io/prismic.min.js"
              />
            </Fragment>
          )}
        </body>
      </html>
    );
  }
}
