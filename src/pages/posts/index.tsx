import { GetStaticProps } from 'next';
import Head from 'next/head';
import * as Prismic from '@prismicio/client';

import { getPrismictClient } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | igNews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {
            posts.map(post => (
              <a key={post.slug} href="#">
                <time>{ post.updatedAt }</time>
                <strong>{ post.title }</strong>
                <p>{ post.excerpt }</p>
              </a>
            ))
          }
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismictClient();

  const response = await prismic.get({
    predicates: Prismic.predicate.at('document.type', 'post'),
    fetch: ['post.title','post.content'],
    pageSize: 10
  });

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: post.data.title,
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    } as Post;
  });


  return {
    props: {
      posts
    }
  };
}