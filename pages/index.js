import Link from 'next/link';
import { getBlogPostsAPI } from '../api';
import { linkResolver } from '../helpers';
import DefaultLayout from '../layouts';
import getCookies from 'next-cookies';

const Index = ({ posts = [] }) => (
  <DefaultLayout>
    <h2>Recent Blog Posts</h2>
    <ul>
      {posts.map((post, index) => (
        <li key={index}>
          <Link
            as={linkResolver(post)}
            href={`/blogPost?slug=${post.uid}`}
            passHref
          >
            <a>{post.data.title[0].text}</a>
          </Link>
        </li>
      ))}
    </ul>
  </DefaultLayout>
);

Index.getInitialProps = async context => {
  const cookies = getCookies(context);
  const ref = cookies['io.prismic.preview'] || null;
  const response = await getBlogPostsAPI({ pageSize: 5, ref });
  return {
    posts: response.results
  };
};

export default Index;
