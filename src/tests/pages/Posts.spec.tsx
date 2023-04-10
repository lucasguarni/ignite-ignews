import { render, screen } from "@testing-library/react";
import { getPrismicClient } from '../../services/prismic'
import Posts, { getStaticProps, Post } from "../../pages/posts";


jest.mock('../../services/prismic')

const posts: Post[] = [
  {
    excerpt: 'my description',
    slug: 'my-new-post',
    title: 'My new Post',
    updatedAt: '22 de março de 2023'
  }
]

describe('Posts Page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />);
    
    expect(screen.getByText('My new Post')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      get: jest.fn().mockResolvedValueOnce({
        results: [{
          uid: 'my-new-post',
          data: {
            title: 'My new Post',
            content: [
              { type: 'paragraph', text: 'my description' }
            ]
          },
          last_publication_date: '2023-03-22T00:00:00'
        }]
      })
    } as any)

    const response = await getStaticProps({});
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts
        }
      })
    )

  });
});
