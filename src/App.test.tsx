import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';

// Mock ResizeObserver for Recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock getUserMedia for KYC
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: () => {} }],
    }),
  },
});

// Mock Recharts to avoid rendering issues in JSDOM
vi.mock('recharts', () => {
  const OriginalModule = vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div style={{ width: 800, height: 800 }}>{children}</div>,
  };
});

// Mock motion/react to avoid animation delays
vi.mock('motion/react', () => {
  return {
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
      p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
      button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
      span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
      img: ({ children, ...props }: any) => <img {...props} />,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('Ruwadverse App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    window.scrollTo = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderApp = async () => {
    localStorage.setItem('language', 'en');
    const result = render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );

    // Fast-forward loading screen
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    
    vi.useRealTimers();
    
    return result;
  };

  it('renders landing page correctly', async () => {
    await renderApp();
    
    expect(screen.getByText(/Start Journey/i)).toBeInTheDocument();
    const featuresLinks = screen.getAllByText(/Features/i);
    expect(featuresLinks.length).toBeGreaterThan(0);
  }, 10000);

  it('navigates to registration page when "Start Now" is clicked', async () => {
    await renderApp();
    
    const navbar = screen.getByRole('navigation');
    const startButton = within(navbar).getByText(/Start Now/i);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/How do you want to start/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  }, 10000);

  it('allows user to select "Idea Owner" type', async () => {
    await renderApp();
    
    const navbar = screen.getByRole('navigation');
    const startButton = within(navbar).getByText(/Start Now/i);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/How do you want to start/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    const ideaCard = screen.getByText(/I have an Idea/i).closest('button');
    fireEvent.click(ideaCard!);

    await waitFor(() => {
      expect(screen.getByText(/what problem are you trying to solve/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  }, 10000);

  it('completes onboarding and shows dashboard', async () => {
    await renderApp();
    
    const navbar = screen.getByRole('navigation');
    const startButton = within(navbar).getByText(/Start Now/i);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/How do you want to start/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    const ideaCard = screen.getByText(/I have an Idea/i).closest('button');
    fireEvent.click(ideaCard!);

    // Step 1: Problem
    await waitFor(() => {
      expect(screen.getByText(/what problem are you trying to solve/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    const input1 = screen.getByPlaceholderText(/Difficulty finding parking/i);
    fireEvent.change(input1, { target: { value: 'Problem description' } });
    
    const nextButton1 = screen.getByLabelText('Next');
    fireEvent.click(nextButton1);

    // Step 2: Fear
    await waitFor(() => {
      expect(screen.getByText(/what is your biggest fear/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    const input2 = screen.getByPlaceholderText(/Fear of idea theft/i);
    fireEvent.change(input2, { target: { value: 'Fear description' } });

    // The button is re-rendered, so we need to get it again
    const nextButton2 = screen.getByLabelText('Next');
    fireEvent.click(nextButton2);

    // Step 3: Needs (Select)
    await waitFor(() => {
      expect(screen.getByText(/what partner are you missing/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    const optionButton = screen.getByText(/Tech Partner/i);
    fireEvent.click(optionButton);

    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(screen.getByText(/Market Insight/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Recommendations/i)).toBeInTheDocument();
  }, 20000);

  it('opens pricing modal correctly', async () => {
    await renderApp();
    
    const subscribeButtons = screen.getAllByText(/Subscribe Now/i);
    fireEvent.click(subscribeButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Secure Payment Methods/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  }, 10000);
});
