import { render, screen } from "@testing-library/react";
import { getPrismicClient } from '../../services/prismic'
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getSession } from "next-auth/react";

jest.mock('next-auth/react');
jest.mock('../../services/prismic');

const post = {
  content: '<p>my description</p>',
  slug: 'my-new-post',
  title: 'My new Post',
  updatedAt: '22 de março de 2023'
}

describe('Post Page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />);
    
    expect(screen.getByText('My new Post')).toBeInTheDocument();
    expect(screen.getByText('my description')).toBeInTheDocument();
  });

  it('redirect user if no subscription is found', async () => {
    const getSessionMocked = jest.mocked(getSession);
    getSessionMocked.mockResolvedValueOnce(null);
    const response = await getServerSideProps({
      params: {
        slug: post.slug
      }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/posts/preview/my-new-post'
        })
      })
    );
  });

  it('loads initial data', async () => {
    const getSessionMocked = jest.mocked(getSession);
    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        uid: post.slug,
        data: {
          title: post.title,
          content: [
            { type: 'paragraph', text: 'my description'}
          ]
        },
        last_publication_date: '2023-03-22T00:00:00'
      })
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: post.slug
      }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: { post }
      })
    );
  });
});
