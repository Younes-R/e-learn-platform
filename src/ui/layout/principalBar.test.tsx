import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import PrincipalBar from './principalBar';
import { verifyRefreshToken } from '@/lib/utils';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock the utility function
jest.mock('@/lib/utils', () => ({
  verifyRefreshToken: jest.fn(),
}));

// Mock CSS modules
jest.mock('./principalBar.module.css', () => ({
  aside: 'aside',
  nav: 'nav',
  ul: 'ul',
  'support-list-item': 'support-list-item',
}));

// Mock icon components
jest.mock('../icons/exploreIcon', () => () => <div data-testid="explore-icon">ExploreIcon</div>);
jest.mock('../icons/coursesIcon', () => () => <div data-testid="courses-icon">CoursesIcon</div>);
jest.mock('../icons/scheduleIcon', () => () => <div data-testid="schedule-icon">ScheduleIcon</div>);
jest.mock('../icons/teachersIcon', () => () => <div data-testid="teachers-icon">TeachersIcon</div>);
jest.mock('../icons/paymentsIcon', () => () => <div data-testid="payments-icon">PaymentsIcon</div>);
jest.mock('../icons/supportIcon', () => () => <div data-testid="support-icon">SupportIcon</div>);
jest.mock('../icons/settingsIcon', () => () => <div data-testid="settings-icon">SettingsIcon</div>);

const mockVerifyRefreshToken = verifyRefreshToken as jest.MockedFunction<typeof verifyRefreshToken>;

describe('PrincipalBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when user role is student', () => {
    beforeEach(() => {
      mockVerifyRefreshToken.mockResolvedValue({ role: 'student' });
    });

    it('should render the navigation bar for student role', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByText('Logo')).toBeInTheDocument();
      expect(screen.getByText('Explore')).toBeInTheDocument();
      expect(screen.getByText('Courses')).toBeInTheDocument();
      expect(screen.getByText('Schedule')).toBeInTheDocument();
      expect(screen.getByText('Teachers')).toBeInTheDocument();
      expect(screen.getByText('Payments')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should render all navigation icons for student role', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByTestId('explore-icon')).toBeInTheDocument();
      expect(screen.getByTestId('courses-icon')).toBeInTheDocument();
      expect(screen.getByTestId('schedule-icon')).toBeInTheDocument();
      expect(screen.getByTestId('teachers-icon')).toBeInTheDocument();
      expect(screen.getByTestId('payments-icon')).toBeInTheDocument();
      expect(screen.getByTestId('support-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    });

    it('should have correct href attributes for student role', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByRole('link', { name: /explore/i })).toHaveAttribute('href', '/common/explore');
      expect(screen.getByRole('link', { name: /courses/i })).toHaveAttribute('href', '/student/courses');
      expect(screen.getByRole('link', { name: /schedule/i })).toHaveAttribute('href', '/student/schedule');
      expect(screen.getByRole('link', { name: /teachers/i })).toHaveAttribute('href', '/student/teachers');
      expect(screen.getByRole('link', { name: /payments/i })).toHaveAttribute('href', '/student/payments');
      expect(screen.getByRole('link', { name: /support/i })).toHaveAttribute('href', '/common/support');
      expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/common/settings');
    });

    it('should show Teachers link only for student role', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByText('Teachers')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /teachers/i })).toHaveAttribute('href', '/student/teachers');
    });

    it('should apply correct CSS classes', async () => {
      const component = await PrincipalBar();
      render(component);

      const aside = screen.getByRole('complementary');
      expect(aside).toHaveClass('aside');

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('nav');

      const ul = screen.getByRole('list');
      expect(ul).toHaveClass('ul');
    });
  });

  describe('when user role is teacher', () => {
    beforeEach(() => {
      mockVerifyRefreshToken.mockResolvedValue({ role: 'teacher' });
    });

    it('should render navigation bar for teacher role', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByText('Logo')).toBeInTheDocument();
      expect(screen.getByText('Explore')).toBeInTheDocument();
      expect(screen.getByText('Courses')).toBeInTheDocument();
      expect(screen.getByText('Schedule')).toBeInTheDocument();
      expect(screen.getByText('Payments')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should not show Teachers link for teacher role', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.queryByText('Teachers')).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /teachers/i })).not.toBeInTheDocument();
    });

    it('should have correct href attributes for teacher role', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByRole('link', { name: /explore/i })).toHaveAttribute('href', '/common/explore');
      expect(screen.getByRole('link', { name: /courses/i })).toHaveAttribute('href', '/teacher/courses');
      expect(screen.getByRole('link', { name: /schedule/i })).toHaveAttribute('href', '/teacher/schedule');
      expect(screen.getByRole('link', { name: /payments/i })).toHaveAttribute('href', '/teacher/payments');
      expect(screen.getByRole('link', { name: /support/i })).toHaveAttribute('href', '/common/support');
      expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/common/settings');
    });

    it('should render correct number of navigation items for teacher', async () => {
      const component = await PrincipalBar();
      render(component);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6); // Should be 6 items (no Teachers link)
    });
  });

  describe('when user role is moderator', () => {
    beforeEach(() => {
      mockVerifyRefreshToken.mockResolvedValue({ role: 'moderator' });
    });

    it('should return null for moderator role', async () => {
      const component = await PrincipalBar();
      expect(component).toBeNull();
    });

    it('should not render any navigation elements for moderator', async () => {
      const component = await PrincipalBar();
      
      if (component) {
        render(component);
      }

      expect(screen.queryByText('Logo')).not.toBeInTheDocument();
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
      expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    });
  });

  describe('when user role is admin', () => {
    beforeEach(() => {
      mockVerifyRefreshToken.mockResolvedValue({ role: 'admin' });
    });

    it('should return null for admin role', async () => {
      const component = await PrincipalBar();
      expect(component).toBeNull();
    });

    it('should not render any navigation elements for admin', async () => {
      const component = await PrincipalBar();
      
      if (component) {
        render(component);
      }

      expect(screen.queryByText('Logo')).not.toBeInTheDocument();
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
      expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    });
  });

  describe('when user has unknown role', () => {
    beforeEach(() => {
      mockVerifyRefreshToken.mockResolvedValue({ role: 'unknown' });
    });

    it('should render navigation bar for unknown role', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByText('Logo')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should not show Teachers link for unknown role', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.queryByText('Teachers')).not.toBeInTheDocument();
    });

    it('should have correct href attributes with unknown role', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByRole('link', { name: /courses/i })).toHaveAttribute('href', '/unknown/courses');
      expect(screen.getByRole('link', { name: /schedule/i })).toHaveAttribute('href', '/unknown/schedule');
      expect(screen.getByRole('link', { name: /payments/i })).toHaveAttribute('href', '/unknown/payments');
    });
  });

  describe('when verifyRefreshToken throws an error', () => {
    beforeEach(() => {
      mockVerifyRefreshToken.mockRejectedValue(new Error('Token verification failed'));
    });

    it('should handle token verification errors gracefully', async () => {
      await expect(PrincipalBar()).rejects.toThrow('Token verification failed');
    });
  });

  describe('when verifyRefreshToken returns undefined role', () => {
    beforeEach(() => {
      mockVerifyRefreshToken.mockResolvedValue({ role: undefined as any });
    });

    it('should render navigation bar when role is undefined', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByText('Logo')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle undefined role in href attributes', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByRole('link', { name: /courses/i })).toHaveAttribute('href', '/undefined/courses');
      expect(screen.getByRole('link', { name: /schedule/i })).toHaveAttribute('href', '/undefined/schedule');
      expect(screen.getByRole('link', { name: /payments/i })).toHaveAttribute('href', '/undefined/payments');
    });
  });

  describe('when verifyRefreshToken returns null role', () => {
    beforeEach(() => {
      mockVerifyRefreshToken.mockResolvedValue({ role: null as any });
    });

    it('should render navigation bar when role is null', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByText('Logo')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle null role in href attributes', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByRole('link', { name: /courses/i })).toHaveAttribute('href', '/null/courses');
      expect(screen.getByRole('link', { name: /schedule/i })).toHaveAttribute('href', '/null/schedule');
      expect(screen.getByRole('link', { name: /payments/i })).toHaveAttribute('href', '/null/payments');
    });
  });

  describe('when verifyRefreshToken returns empty string role', () => {
    beforeEach(() => {
      mockVerifyRefreshToken.mockResolvedValue({ role: '' });
    });

    it('should render navigation bar when role is empty string', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByText('Logo')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle empty string role in href attributes', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByRole('link', { name: /courses/i })).toHaveAttribute('href', '//courses');
      expect(screen.getByRole('link', { name: /schedule/i })).toHaveAttribute('href', '//schedule');
      expect(screen.getByRole('link', { name: /payments/i })).toHaveAttribute('href', '//payments');
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      mockVerifyRefreshToken.mockResolvedValue({ role: 'student' });
    });

    it('should have proper semantic HTML structure', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByRole('complementary')).toBeInTheDocument(); // aside element
      expect(screen.getByRole('navigation')).toBeInTheDocument(); // nav element
      expect(screen.getByRole('list')).toBeInTheDocument(); // ul element
      expect(screen.getAllByRole('listitem')).toHaveLength(7); // li elements
    });

    it('should have all links accessible by keyboard navigation', async () => {
      const component = await PrincipalBar();
      render(component);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(7);
      
      links.forEach(link => {
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href');
      });
    });

    it('should have descriptive text for each navigation item', async () => {
      const component = await PrincipalBar();
      render(component);

      expect(screen.getByRole('link', { name: /explore/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /courses/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /schedule/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /teachers/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /payments/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /support/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
    });
  });

  describe('component structure and styling', () => {
    beforeEach(() => {
      mockVerifyRefreshToken.mockResolvedValue({ role: 'student' });
    });

    it('should apply support-list-item class to support link', async () => {
      const component = await PrincipalBar();
      render(component);

      const supportListItem = screen.getByRole('link', { name: /support/i }).parentElement;
      expect(supportListItem).toHaveClass('support-list-item');
    });

    it('should render logo heading correctly', async () => {
      const component = await PrincipalBar();
      render(component);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Logo');
    });

    it('should have proper nesting structure', async () => {
      const component = await PrincipalBar();
      render(component);

      const aside = screen.getByRole('complementary');
      const nav = screen.getByRole('navigation');
      const ul = screen.getByRole('list');

      expect(aside).toContainElement(nav);
      expect(nav).toContainElement(ul);
      expect(ul.children).toHaveLength(7);
    });
  });
});