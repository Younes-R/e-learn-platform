import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from './page';

// Mock the CSS module
jest.mock('./page.module.css', () => ({
  main: 'mocked-main-class'
}));

// Mock the Payments component
jest.mock('@/ui/teacher/payments', () => {
  return function MockedPayments({ 
    coursesIncomeCount, 
    sessionsIncomeCount, 
    coursesIncome 
  }: {
    coursesIncomeCount: number | null;
    sessionsIncomeCount: number | null;
    coursesIncome: Array<{
      invoice: string;
      date: string;
      firstName: string;
      lastName: string;
      course: string;
      price: number;
    }>;
  }) {
    return (
      <div data-testid="payments-component">
        <div data-testid="courses-income-count">{String(coursesIncomeCount)}</div>
        <div data-testid="sessions-income-count">{String(sessionsIncomeCount)}</div>
        <div data-testid="courses-income">{JSON.stringify(coursesIncome)}</div>
      </div>
    );
  };
});

// Mock utility functions
jest.mock('@/lib/utils', () => ({
  verifyRefreshToken: jest.fn(),
  verifyRoles: jest.fn()
}));

// Mock database DAL
jest.mock('@/database/dal/teacher', () => ({
  getPaymentsInfo: jest.fn()
}));

import { verifyRefreshToken, verifyRoles } from '@/lib/utils';
import { getPaymentsInfo } from '@/database/dal/teacher';

const mockVerifyRefreshToken = verifyRefreshToken as jest.MockedFunction<typeof verifyRefreshToken>;
const mockVerifyRoles = verifyRoles as jest.MockedFunction<typeof verifyRoles>;
const mockGetPaymentsInfo = getPaymentsInfo as jest.MockedFunction<typeof getPaymentsInfo>;

describe('Teacher Payments Page', () => {
  // Note: Using Jest and React Testing Library as the testing framework
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path Scenarios', () => {
    it('should render the payments page with valid data', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 1500.50,
        sessionsIncomeCount: 2750.75,
        coursesIncome: [
          { 
            invoice: 'INV-001', 
            date: '2024-01-15', 
            firstName: 'John', 
            lastName: 'Doe', 
            course: 'Math 101', 
            price: 299.99 
          },
          { 
            invoice: 'INV-002', 
            date: '2024-01-20', 
            firstName: 'Jane', 
            lastName: 'Smith', 
            course: 'Science 201', 
            price: 399.99 
          }
        ]
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      const PageComponent = await Page();
      render(PageComponent);

      // Assert
      expect(screen.getByText('Payments')).toBeInTheDocument();
      expect(screen.getByTestId('payments-component')).toBeInTheDocument();
      expect(screen.getByTestId('courses-income-count')).toHaveTextContent('1500.5');
      expect(screen.getByTestId('sessions-income-count')).toHaveTextContent('2750.75');
      
      const coursesIncomeElement = screen.getByTestId('courses-income');
      expect(coursesIncomeElement).toHaveTextContent(JSON.stringify(mockPaymentsData.coursesIncome));
    });

    it('should call all required functions with correct parameters in sequence', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@test.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 500,
        sessionsIncomeCount: 800,
        coursesIncome: []
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      await Page();

      // Assert
      expect(mockVerifyRefreshToken).toHaveBeenCalledTimes(1);
      expect(mockVerifyRoles).toHaveBeenCalledWith(['teacher']);
      expect(mockGetPaymentsInfo).toHaveBeenCalledWith('teacher@test.com');
    });

    it('should handle zero income data correctly', async () => {
      // Arrange
      const mockPayload = { 
        email: 'newteacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 0,
        sessionsIncomeCount: 0,
        coursesIncome: []
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      const PageComponent = await Page();
      render(PageComponent);

      // Assert
      expect(screen.getByTestId('courses-income-count')).toHaveTextContent('0');
      expect(screen.getByTestId('sessions-income-count')).toHaveTextContent('0');
      expect(screen.getByTestId('courses-income')).toHaveTextContent('[]');
    });

    it('should handle null income values from database queries', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: null,
        sessionsIncomeCount: null,
        coursesIncome: []
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      const PageComponent = await Page();
      render(PageComponent);

      // Assert
      expect(screen.getByTestId('courses-income-count')).toHaveTextContent('null');
      expect(screen.getByTestId('sessions-income-count')).toHaveTextContent('null');
      expect(screen.getByTestId('courses-income')).toHaveTextContent('[]');
    });
  });

  describe('Edge Cases', () => {
    it('should handle large income amounts and course lists', async () => {
      // Arrange
      const mockPayload = { 
        email: 'popular-teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 999999.99,
        sessionsIncomeCount: 1000000.01,
        coursesIncome: Array.from({ length: 50 }, (_, i) => ({
          invoice: `INV-${String(i + 1).padStart(4, '0')}`,
          date: '2024-01-01',
          firstName: `FirstName${i}`,
          lastName: `LastName${i}`,
          course: `Course ${i}`,
          price: Math.floor(Math.random() * 1000) + 100
        }))
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      const PageComponent = await Page();
      render(PageComponent);

      // Assert
      expect(screen.getByTestId('courses-income-count')).toHaveTextContent('999999.99');
      expect(screen.getByTestId('sessions-income-count')).toHaveTextContent('1000000.01');
      expect(screen.getByTestId('payments-component')).toBeInTheDocument();
    });

    it('should handle special characters in email addresses', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher+special@example-domain.co.uk', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 250,
        sessionsIncomeCount: 500,
        coursesIncome: []
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      await Page();

      // Assert
      expect(mockGetPaymentsInfo).toHaveBeenCalledWith('teacher+special@example-domain.co.uk');
    });

    it('should handle unicode characters in course names and user names', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 500,
        sessionsIncomeCount: 750,
        coursesIncome: [
          { 
            invoice: 'INV-003', 
            date: '2024-01-25', 
            firstName: 'María José', 
            lastName: 'González-Smith', 
            course: 'Advanced Math & Physics (Level 2) 数学', 
            price: 599.99 
          },
          {
            invoice: 'INV-004',
            date: '2024-01-26',
            firstName: 'محمد',
            lastName: 'Ahmed',
            course: 'Programming with C++ & Python',
            price: 450.00
          }
        ]
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      const PageComponent = await Page();
      render(PageComponent);

      // Assert
      const coursesIncomeElement = screen.getByTestId('courses-income');
      expect(coursesIncomeElement).toHaveTextContent(JSON.stringify(mockPaymentsData.coursesIncome));
    });

    it('should handle decimal precision in financial amounts', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 123.456789,
        sessionsIncomeCount: 987.654321,
        coursesIncome: [
          { 
            invoice: 'INV-005', 
            date: '2024-01-30', 
            firstName: 'Test', 
            lastName: 'User', 
            course: 'Precision Course', 
            price: 99.999999 
          }
        ]
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      const PageComponent = await Page();
      render(PageComponent);

      // Assert
      expect(screen.getByTestId('courses-income-count')).toHaveTextContent('123.456789');
      expect(screen.getByTestId('sessions-income-count')).toHaveTextContent('987.654321');
    });

    it('should handle empty course titles and names', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 100,
        sessionsIncomeCount: 200,
        coursesIncome: [
          { 
            invoice: 'INV-006', 
            date: '2024-02-01', 
            firstName: '', 
            lastName: '', 
            course: '', 
            price: 150.00 
          }
        ]
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      const PageComponent = await Page();
      render(PageComponent);

      // Assert
      const coursesIncomeElement = screen.getByTestId('courses-income');
      expect(coursesIncomeElement).toHaveTextContent(JSON.stringify(mockPaymentsData.coursesIncome));
    });
  });

  describe('Error Handling', () => {
    it('should propagate verifyRefreshToken rejection errors', async () => {
      // Arrange
      const mockError = new Error('Invalid refresh token');
      mockVerifyRefreshToken.mockRejectedValue(mockError);

      // Act & Assert
      await expect(Page()).rejects.toThrow('Invalid refresh token');
      expect(mockVerifyRoles).not.toHaveBeenCalled();
      expect(mockGetPaymentsInfo).not.toHaveBeenCalled();
    });

    it('should propagate verifyRoles rejection errors', async () => {
      // Arrange
      const mockPayload = { 
        email: 'unauthorized@example.com', 
        role: 'student', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockError = new Error('Insufficient permissions');
      
      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockRejectedValue(mockError);

      // Act & Assert
      await expect(Page()).rejects.toThrow('Insufficient permissions');
      expect(mockVerifyRefreshToken).toHaveBeenCalledTimes(1);
      expect(mockGetPaymentsInfo).not.toHaveBeenCalled();
    });

    it('should propagate getPaymentsInfo database errors', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockError = new Error('[getPaymentsInfo]: Failed to get payments info.');
      
      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockRejectedValue(mockError);

      // Act & Assert
      await expect(Page()).rejects.toThrow('[getPaymentsInfo]: Failed to get payments info.');
      expect(mockVerifyRefreshToken).toHaveBeenCalledTimes(1);
      expect(mockVerifyRoles).toHaveBeenCalledWith(['teacher']);
    });

    it('should handle malformed token response missing email field', async () => {
      // Arrange
      const mockPayload = { 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      } as any;
      
      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);

      // Act & Assert
      await expect(Page()).rejects.toThrow();
    });

    it('should handle null token payload', async () => {
      // Arrange
      mockVerifyRefreshToken.mockResolvedValue(null as any);
      mockVerifyRoles.mockResolvedValue(undefined);

      // Act & Assert
      await expect(Page()).rejects.toThrow();
    });

    it('should handle undefined payments data from database', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      
      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(undefined as any);

      // Act & Assert
      await expect(Page()).rejects.toThrow();
    });

    it('should handle partial payments data structure', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 100
        // Missing sessionsIncomeCount and coursesIncome
      } as any;
      
      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act & Assert
      await expect(Page()).rejects.toThrow();
    });

    it('should handle network timeout errors', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockError = new Error('Network timeout');
      
      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockRejectedValue(mockError);

      // Act & Assert
      await expect(Page()).rejects.toThrow('Network timeout');
    });
  });

  describe('Authentication and Authorization', () => {
    it('should verify teacher role specifically and not other roles', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 100,
        sessionsIncomeCount: 200,
        coursesIncome: []
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      await Page();

      // Assert
      expect(mockVerifyRoles).toHaveBeenCalledWith(['teacher']);
      expect(mockVerifyRoles).toHaveBeenCalledTimes(1);
      expect(mockVerifyRoles).not.toHaveBeenCalledWith(['student']);
      expect(mockVerifyRoles).not.toHaveBeenCalledWith(['admin']);
    });

    it('should handle expired token scenario gracefully', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 - 3600, // Expired 1 hour ago
        iat: Date.now() / 1000 - 7200  // Issued 2 hours ago
      };
      const mockPaymentsData = {
        coursesIncomeCount: 300,
        sessionsIncomeCount: 600,
        coursesIncome: []
      };
      
      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      await Page();

      // Assert - Token validation is handled by utility functions, page should still work
      expect(mockVerifyRefreshToken).toHaveBeenCalledTimes(1);
      expect(mockVerifyRoles).toHaveBeenCalledWith(['teacher']);
      expect(mockGetPaymentsInfo).toHaveBeenCalledWith('teacher@example.com');
    });

    it('should handle multiple authentication calls for different users', async () => {
      // Arrange
      const mockPayload1 = { 
        email: 'teacher1@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPayload2 = { 
        email: 'teacher2@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 150,
        sessionsIncomeCount: 300,
        coursesIncome: []
      };

      // First call
      mockVerifyRefreshToken.mockResolvedValueOnce(mockPayload1);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      await Page();

      // Second call
      mockVerifyRefreshToken.mockResolvedValueOnce(mockPayload2);
      await Page();

      // Assert
      expect(mockVerifyRefreshToken).toHaveBeenCalledTimes(2);
      expect(mockVerifyRoles).toHaveBeenCalledTimes(2);
      expect(mockGetPaymentsInfo).toHaveBeenNthCalledWith(1, 'teacher1@example.com');
      expect(mockGetPaymentsInfo).toHaveBeenNthCalledWith(2, 'teacher2@example.com');
    });

    it('should validate JWT token structure', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: 1234567890, // Valid Unix timestamp
        iat: 1234567800  // Valid Unix timestamp
      };
      const mockPaymentsData = {
        coursesIncomeCount: 400,
        sessionsIncomeCount: 800,
        coursesIncome: []
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      await Page();

      // Assert
      expect(mockVerifyRefreshToken).toHaveBeenCalledTimes(1);
      expect(mockGetPaymentsInfo).toHaveBeenCalledWith('teacher@example.com');
    });
  });

  describe('Component Integration', () => {
    it('should pass all required props to Payments component with correct types', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 1250.75,
        sessionsIncomeCount: 2100.25,
        coursesIncome: [
          { 
            invoice: 'INV-101', 
            date: '2024-02-01', 
            firstName: 'Alice', 
            lastName: 'Johnson', 
            course: 'Advanced Mathematics', 
            price: 450.50 
          },
          { 
            invoice: 'INV-102', 
            date: '2024-02-02', 
            firstName: 'Bob', 
            lastName: 'Wilson', 
            course: 'Physics Fundamentals', 
            price: 380.25 
          }
        ]
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      const PageComponent = await Page();
      render(PageComponent);

      // Assert
      const paymentsComponent = screen.getByTestId('payments-component');
      expect(paymentsComponent).toBeInTheDocument();
      
      // Verify all props are passed correctly with proper serialization
      expect(screen.getByTestId('courses-income-count')).toHaveTextContent('1250.75');
      expect(screen.getByTestId('sessions-income-count')).toHaveTextContent('2100.25');
      expect(screen.getByTestId('courses-income')).toHaveTextContent(
        JSON.stringify(mockPaymentsData.coursesIncome)
      );
    });

    it('should apply correct CSS classes and semantic HTML structure', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 100,
        sessionsIncomeCount: 200,
        coursesIncome: []
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      const PageComponent = await Page();
      render(PageComponent);

      // Assert
      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveClass('mocked-main-class');
      
      const headingElement = screen.getByText('Payments');
      expect(headingElement).toBeInTheDocument();
      expect(headingElement.tagName).toBe('H2');
    });

    it('should maintain correct DOM hierarchy and accessibility', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 300,
        sessionsIncomeCount: 600,
        coursesIncome: []
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      const PageComponent = await Page();
      render(PageComponent);

      // Assert
      const mainElement = screen.getByRole('main');
      const h2Element = screen.getByRole('heading', { level: 2 });
      const paymentsComponent = screen.getByTestId('payments-component');
      
      expect(mainElement).toContainElement(h2Element);
      expect(mainElement).toContainElement(paymentsComponent);
      expect(h2Element).toHaveTextContent('Payments');
    });

    it('should handle component props with various data combinations', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 0,
        sessionsIncomeCount: 1500.50,
        coursesIncome: [
          { 
            invoice: 'INV-999', 
            date: '2024-12-31', 
            firstName: 'Last', 
            lastName: 'Student', 
            course: 'Final Course of Year', 
            price: 1000.00 
          }
        ]
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      const PageComponent = await Page();
      render(PageComponent);

      // Assert
      expect(screen.getByTestId('courses-income-count')).toHaveTextContent('0');
      expect(screen.getByTestId('sessions-income-count')).toHaveTextContent('1500.5');
      expect(screen.getByTestId('courses-income')).toHaveTextContent(
        JSON.stringify(mockPaymentsData.coursesIncome)
      );
    });
  });

  describe('Data Flow and Async Operations', () => {
    it('should execute authentication and data fetching in correct sequence', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 500,
        sessionsIncomeCount: 1000,
        coursesIncome: []
      };

      let callOrder: string[] = [];
      
      mockVerifyRefreshToken.mockImplementation(async () => {
        callOrder.push('verifyRefreshToken');
        return mockPayload;
      });
      
      mockVerifyRoles.mockImplementation(async () => {
        callOrder.push('verifyRoles');
        return undefined;
      });
      
      mockGetPaymentsInfo.mockImplementation(async () => {
        callOrder.push('getPaymentsInfo');
        return mockPaymentsData;
      });

      // Act
      await Page();

      // Assert
      expect(callOrder).toEqual(['verifyRefreshToken', 'verifyRoles', 'getPaymentsInfo']);
    });

    it('should handle concurrent async operations with proper timing', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 750,
        sessionsIncomeCount: 1500,
        coursesIncome: []
      };

      // Add realistic delays to simulate async operations
      mockVerifyRefreshToken.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockPayload), 50))
      );
      mockVerifyRoles.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(undefined), 30))
      );
      mockGetPaymentsInfo.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockPaymentsData), 40))
      );

      // Act
      const startTime = Date.now();
      await Page();
      const endTime = Date.now();

      // Assert
      // Should take at least 120ms due to sequential execution (50 + 30 + 40)
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
      expect(mockVerifyRefreshToken).toHaveBeenCalledTimes(1);
      expect(mockVerifyRoles).toHaveBeenCalledTimes(1);
      expect(mockGetPaymentsInfo).toHaveBeenCalledTimes(1);
    });

    it('should maintain data integrity through the async chain', async () => {
      // Arrange
      const originalEmail = 'test-teacher@domain.com';
      const mockPayload = { 
        email: originalEmail, 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const mockPaymentsData = {
        coursesIncomeCount: 200,
        sessionsIncomeCount: 400,
        coursesIncome: []
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      await Page();

      // Assert
      expect(mockGetPaymentsInfo).toHaveBeenCalledWith(originalEmail);
      expect(mockVerifyRoles).toHaveBeenCalledWith(['teacher']);
    });

    it('should handle promise rejection at any stage of the chain', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };

      // Test rejection at different stages
      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockRejectedValue(new Error('Role verification failed'));

      // Act & Assert
      await expect(Page()).rejects.toThrow('Role verification failed');
      expect(mockGetPaymentsInfo).not.toHaveBeenCalled();
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large datasets efficiently', async () => {
      // Arrange
      const mockPayload = { 
        email: 'teacher@example.com', 
        role: 'teacher', 
        exp: Date.now() / 1000 + 3600, 
        iat: Date.now() / 1000 
      };
      const largeCourseList = Array.from({ length: 1000 }, (_, i) => ({
        invoice: `INV-${i}`,
        date: '2024-01-01',
        firstName: `Student${i}`,
        lastName: `Surname${i}`,
        course: `Course ${i}`,
        price: 100 + (i % 500)
      }));
      const mockPaymentsData = {
        coursesIncomeCount: 50000,
        sessionsIncomeCount: 75000,
        coursesIncome: largeCourseList
      };

      mockVerifyRefreshToken.mockResolvedValue(mockPayload);
      mockVerifyRoles.mockResolvedValue(undefined);
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentsData);

      // Act
      const startTime = performance.now();
      const PageComponent = await Page();
      render(PageComponent);
      const endTime = performance.now();

      // Assert
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
      expect(screen.getByTestId('payments-component')).toBeInTheDocument();
      expect(screen.getByTestId('courses-income-count')).toHaveTextContent('50000');
    });
  });
});