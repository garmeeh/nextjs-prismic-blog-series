import React, { Component } from 'react';
import { RichText } from 'prismic-reactjs';
import { getBlogPostAPI } from '../api';
import linkResolver from '../helpers';
import DefaultLayout from '../layouts';
import Head from 'next/head';

export default class BlogPost extends Component {
  static async getInitialProps(context) {
    const { slug } = context.query;
    const response = await getBlogPostAPI(slug);
    return {
      post: response
    };
  }

  addJSONLD(post, info, url) {
    return {
      __html: `{
      "@context": "http://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${url}"
      },
      "headline": "${post.og_title[0].text}",
      "image": [
        "${post.og_image.url}"
      ],
      "datePublished": "${info.first_publication_date}",
      "dateModified": "${info.first_publication_date}",
      "author": {
        "@type": "Person",
        "name": "Gary Meehan"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Gary Meehan",
        "logo": {
          "@type": "ImageObject",
          "url": "https://prismic-io.s3.amazonaws.com/gary-blog%2Fa64f6d7e-5c0e-4190-b852-2122e087ae2b_gm.jpg"
        }
      },
      "description": "${post.og_description[0].text}"
    }`
    };
  }

  render() {
    const post = this.props.post.data;
    const info = this.props.post;
    const url = `https://www.yourdomain.ie/blog/${info.uid}`;

    return (
      <DefaultLayout>
        <Head>
          <title key="title">{post.og_title[0].text}</title>
          <meta
            key="description"
            name="description"
            content={post.og_description[0].text}
          />
          <meta key="og:url" property="og:url" content={url} />
          <meta key="og:type" property="og:type" content="article" />
          <meta
            key="og:title"
            property="og:title"
            content={post.og_title[0].text}
          />
          <meta
            key="og:description"
            property="og:description"
            content={post.og_description[0].text}
          />
          <meta
            key="og:image"
            property="og:image"
            content={post.og_image.url}
          />
        </Head>
        <article>
          <h1>{post.title.length ? post.title[0].text : ''}</h1>
          {RichText.render(post.body, linkResolver)}
        </article>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={this.addJSONLD(post, info, url)}
        />
      </DefaultLayout>
    );
  }
}
