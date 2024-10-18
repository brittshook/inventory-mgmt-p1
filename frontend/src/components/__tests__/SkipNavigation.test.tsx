import { render, screen, fireEvent } from '@testing-library/react';
import { SkipNavigation } from '../SkipNavigation';
import "@testing-library/jest-dom";

describe('SkipNavigation', () => {
    test('renders the link with correct href', () => {
        render(<SkipNavigation section="#main-content" />);
        const linkElement = screen.getByText(/Skip to main content/i);
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', '#main-content');
    });

    test('link is visually hidden by default', () => {
        render(<SkipNavigation section="#main-content" />);
        const linkElement = screen.getByText("Skip to main content");
        expect(linkElement).toHaveClass('visually-hidden');
    });

    test('link is not visually hidden when focused', () => {
        render(<SkipNavigation section="#main-content" />);
        const linkElement = screen.getByText("Skip to main content");
        fireEvent.focus(linkElement);
        expect(linkElement).not.toHaveClass('visually-hidden');
    });

    test('link is visually hidden again when blurred', () => {
        render(<SkipNavigation section="#main-content" />);
        const linkElement = screen.getByText("Skip to main content");
        fireEvent.focus(linkElement);
        fireEvent.blur(linkElement);
        expect(linkElement).toHaveClass('visually-hidden');
    });
});