import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Logo } from './Logo';

describe('Logo', () => {
  it('should render the logo', () => {
    const { container } = render(<Logo />);
    expect(container.querySelector('svg')).toBeDefined();
  });
});
