import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock('next-auth/react');
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn()
  })
}));
jest.mock('../../services/prismic');

const post = {
  content: '<p>my description</p>',
  slug: 'my-new-post',
  title: 'My new Post',
  updatedAt: '22 de março de 2023'
}

describe('Post Preview Page', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated"
    });

    render(<PostPreview post={post} />);
    
    expect(screen.getByText('My new Post')).toBeInTheDocument();
    expect(screen.getByText('my description')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('redirects user to full post when user is subscribed', async () => {
    const getSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);
    const pushMock = jest.fn();

    getSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Joe',
          email: 'johnjoe@domain.com',
        },
        activeSubscription: 'fake-subscription',
        expires: 'fake'
      },
      status: "authenticated",
    });

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any);

    render(<PostPreview post={post} />);

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient)

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

    const response = await getStaticProps({
      params: {
        slug: post.slug
      }
    });

    expect(response).toEqual(
      expect.objectContaining({
        props: { post }
      })
    );
  });
});
