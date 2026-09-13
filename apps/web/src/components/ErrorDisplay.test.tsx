import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorDisplay from './ErrorDisplay';

describe('ErrorDisplay', () => {
  it('renders the provided message', () => {
    render(<ErrorDisplay message="Something broke" />);
    expect(screen.getByText('Something broke')).toBeInTheDocument();
  });

  it('shows the default title when none is given', () => {
    render(<ErrorDisplay message="x" />);
    expect(screen.getByText('Error loading cars')).toBeInTheDocument();
  });

  it('shows a custom title', () => {
    render(<ErrorDisplay title="Boom" message="x" />);
    expect(screen.getByText('Boom')).toBeInTheDocument();
  });
});
