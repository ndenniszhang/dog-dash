import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../page';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('Home page', () => {
  beforeEach(() => {
    render(<Home />);
  });

  it('renders without crashing', () => {
    expect(document.body).toBeTruthy();
  });

  it('renders the Next.js logo image', () => {
    expect(screen.getByAltText('Next.js logo')).toBeInTheDocument();
  });

  it('renders a Deploy now link', () => {
    const deployLink = screen.getByRole('link', { name: /Deploy now/i });
    expect(deployLink).toBeInTheDocument();
  });

  it('renders a Read docs link', () => {
    const docsLink = screen.getByRole('link', { name: /Read our docs/i });
    expect(docsLink).toBeInTheDocument();
  });

  it('Deploy now link opens in new tab', () => {
    const deployLink = screen.getByRole('link', { name: /Deploy now/i });
    expect(deployLink).toHaveAttribute('target', '_blank');
  });

  it('Read docs link opens in new tab', () => {
    const docsLink = screen.getByRole('link', { name: /Read our docs/i });
    expect(docsLink).toHaveAttribute('target', '_blank');
  });

  it('external links have rel="noopener noreferrer" for security', () => {
    const externalLinks = screen.getAllByRole('link');
    externalLinks.forEach((link) => {
      if (link.getAttribute('target') === '_blank') {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });
  });

  it('renders footer Learn link', () => {
    expect(screen.getByRole('link', { name: /Learn/i })).toBeInTheDocument();
  });

  it('renders footer Examples link', () => {
    expect(screen.getByRole('link', { name: /Examples/i })).toBeInTheDocument();
  });

  it('renders footer nextjs.org link', () => {
    const nextjsLink = screen.getByRole('link', { name: /Go to nextjs.org/i });
    expect(nextjsLink).toBeInTheDocument();
  });

  it('renders editing instructions text', () => {
    expect(screen.getByText(/Get started by editing/i)).toBeInTheDocument();
  });

  it('renders the page.tsx code reference', () => {
    expect(screen.getByText('src/app/page.tsx')).toBeInTheDocument();
  });
});
