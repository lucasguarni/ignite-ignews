import Head from 'next/head';
import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | igNews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>12 de março de 2022</time>
            <strong>Creating monorep</strong>
            <p>Lorem ispsum dolor amet</p>
          </a>
          <a href="#">
            <time>12 de março de 2022</time>
            <strong>Creating monorep</strong>
            <p>Lorem ispsum dolor amet</p>
          </a>
          <a href="#">
            <time>12 de março de 2022</time>
            <strong>Creating monorep</strong>
            <p>Lorem ispsum dolor amet</p>
          </a>
        </div>
      </main>
    </>
  );
}