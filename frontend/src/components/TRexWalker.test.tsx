import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TRexWalker from './TRexWalker';
import { ThemeProvider } from '../context/ThemeContext';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('TRexWalker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the T-Rex emoji', () => {
    renderWithTheme(<TRexWalker />);
    expect(screen.getByText('🦖')).toBeInTheDocument();
  });

  it('is hidden from screen readers', () => {
    renderWithTheme(<TRexWalker />);
    const container = screen.getByText('🦖').closest('[aria-hidden]');
    expect(container).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not block pointer events', () => {
    renderWithTheme(<TRexWalker />);
    const container = screen.getByText('🦖').closest('.pointer-events-none');
    expect(container).toBeInTheDocument();
  });

  it('applies walk and step animation classes', () => {
    renderWithTheme(<TRexWalker />);
    const outer = screen.getByText('🦖').closest('.animate-trex-walk');
    const inner = screen.getByText('🦖').closest('.animate-trex-step');
    expect(outer).toBeInTheDocument();
    expect(inner).toBeInTheDocument();
  });

  it('calls onComplete and removes itself after 3 seconds', () => {
    const onComplete = vi.fn();
    renderWithTheme(<TRexWalker onComplete={onComplete} />);

    expect(screen.getByText('🦖')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('🦖')).not.toBeInTheDocument();
  });

  it('stays visible before the timeout', () => {
    renderWithTheme(<TRexWalker />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText('🦖')).toBeInTheDocument();
  });
});
