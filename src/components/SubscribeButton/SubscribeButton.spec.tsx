
import { fireEvent, render, screen } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';

jest.mock('next-auth/react');
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn()
  })
}));

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    });

    render(<SubscribeButton />);
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = jest.mocked(signIn);
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    });
    render(<SubscribeButton />);

    const signInButton = screen.getByText('Subscribe now');
    fireEvent.click(signInButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it('redirects user to sign in when not authenticated', () => {
    const useRouterMocked = jest.mocked(useRouter);
    const pushMocked = jest.fn();
    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)

    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: { 
        user: {
          name: 'John Jon',
          email: 'johnjon@domain.com',
        },
        expires: 'fake',
        activeSubscription: true
      },
      status: 'authenticated'
    });

    render(<SubscribeButton />);

    const signInButton = screen.getByText('Subscribe now');
    fireEvent.click(signInButton);

    expect(pushMocked).toHaveBeenCalledWith('/posts');
  })
});
