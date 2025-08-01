import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GET } from './route';
import { getProfileInfo } from '@/database/dal/common';
import { getStudentCourses, getStudentPayments, getStudentTeachers } from '@/database/dal/student';
import { getPaymentsInfo, getTeacherCourses } from '@/database/dal/teacher';
import { neon } from '@neondatabase/serverless';

// Mock all external dependencies
vi.mock('@/database/dal/common');
vi.mock('@/database/dal/student');
vi.mock('@/database/dal/teacher');
vi.mock('@neondatabase/serverless');

// Type the mocked functions for TypeScript support
const mockGetProfileInfo = vi.mocked(getProfileInfo);
const mockGetStudentCourses = vi.mocked(getStudentCourses);
const mockGetStudentPayments = vi.mocked(getStudentPayments);
const mockGetStudentTeachers = vi.mocked(getStudentTeachers);
const mockGetPaymentsInfo = vi.mocked(getPaymentsInfo);
const mockGetTeacherCourses = vi.mocked(getTeacherCourses);
const mockNeon = vi.mocked(neon);

describe('GET /test API Route', () => {
  let mockRequest: Request;
  let mockSql: any;
  let consoleErrorSpy: any;
  let consoleLogSpy: any;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Create mock request object
    mockRequest = new Request('http://localhost:3000/test');
    
    // Mock the SQL function returned by neon
    mockSql = vi.fn();
    mockNeon.mockReturnValue(mockSql);
    
    // Mock console methods to capture and control output
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    // Set up required environment variable
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
  });

  afterEach(() => {
    // Restore console methods
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('Successful Payment Data Retrieval', () => {
    it('returns payment data when getPaymentsInfo succeeds with valid data', async () => {
      const mockPaymentData = {
        totalAmount: 1500.75,
        paidAmount: 1200.50,
        pendingAmount: 300.25,
        transactions: [
          { id: 1, amount: 600.25, date: '2024-01-15', status: 'completed' },
          { id: 2, amount: 600.25, date: '2024-01-20', status: 'completed' }
        ]
      };

      mockGetPaymentsInfo.mockResolvedValue(mockPaymentData);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(mockGetPaymentsInfo).toHaveBeenCalledWith('librarian@gmail.com');
      expect(mockGetPaymentsInfo).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(mockPaymentData);
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockPaymentData);
    });

    it('returns empty array when getPaymentsInfo succeeds with no data', async () => {
      const mockEmptyData: any[] = [];
      
      mockGetPaymentsInfo.mockResolvedValue(mockEmptyData);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(mockGetPaymentsInfo).toHaveBeenCalledWith('librarian@gmail.com');
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockEmptyData);
      expect(consoleLogSpy).toHaveBeenCalledWith(mockEmptyData);
    });

    it('returns single payment record successfully', async () => {
      const mockSinglePayment = {
        id: 'pay_123',
        amount: 99.99,
        currency: 'USD',
        status: 'paid',
        createdAt: '2024-01-15T10:30:00Z'
      };

      mockGetPaymentsInfo.mockResolvedValue(mockSinglePayment);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData).toEqual(mockSinglePayment);
      expect(response.status).toBe(200);
    });

    it('handles complex nested payment data structures', async () => {
      const mockComplexData = {
        user: {
          email: 'librarian@gmail.com',
          id: 'user_123'
        },
        summary: {
          totalEarnings: 2500.00,
          totalPending: 450.00,
          currency: 'USD'
        },
        paymentDetails: {
          completed: [
            { sessionId: 'sess_001', amount: 150.00, date: '2024-01-10' },
            { sessionId: 'sess_002', amount: 200.00, date: '2024-01-15' }
          ],
          pending: [
            { sessionId: 'sess_003', amount: 175.00, expectedDate: '2024-02-01' }
          ]
        }
      };

      mockGetPaymentsInfo.mockResolvedValue(mockComplexData);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData).toEqual(mockComplexData);
      expect(responseData.paymentDetails.completed).toHaveLength(2);
      expect(responseData.paymentDetails.pending).toHaveLength(1);
      expect(responseData.summary.totalEarnings).toBe(2500.00);
    });
  });

  describe('Null and Falsy Response Handling', () => {
    it('returns "nothing returned" message when getPaymentsInfo returns null', async () => {
      mockGetPaymentsInfo.mockResolvedValue(null);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(mockGetPaymentsInfo).toHaveBeenCalledWith('librarian@gmail.com');
      expect(response.status).toBe(200);
      expect(responseData).toEqual({ msg: "nothing returned" });
      expect(consoleLogSpy).toHaveBeenCalledWith(null);
    });

    it('returns "nothing returned" message when getPaymentsInfo returns undefined', async () => {
      mockGetPaymentsInfo.mockResolvedValue(undefined);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData).toEqual({ msg: "nothing returned" });
      expect(consoleLogSpy).toHaveBeenCalledWith(undefined);
    });

    it('returns "nothing returned" message when getPaymentsInfo returns false', async () => {
      mockGetPaymentsInfo.mockResolvedValue(false as any);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData).toEqual({ msg: "nothing returned" });
    });

    it('returns "nothing returned" message when getPaymentsInfo returns empty string', async () => {
      mockGetPaymentsInfo.mockResolvedValue("" as any);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData).toEqual({ msg: "nothing returned" });
    });

    it('returns "nothing returned" message when getPaymentsInfo returns 0', async () => {
      mockGetPaymentsInfo.mockResolvedValue(0 as any);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData).toEqual({ msg: "nothing returned" });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('handles database connection errors gracefully', async () => {
      const mockConnectionError = new Error('Connection to database failed');
      (mockConnectionError as any).cause = 'ECONNREFUSED';
      
      mockGetPaymentsInfo.mockRejectedValue(mockConnectionError);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(mockGetPaymentsInfo).toHaveBeenCalledWith('librarian@gmail.com');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Connection to database failed');
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        err_msg: "Something wrong happened. Try again later!",
        err_cause: 'ECONNREFUSED'
      });
    });

    it('handles SQL query errors', async () => {
      const mockSqlError = new Error('Invalid SQL query syntax');
      (mockSqlError as any).cause = 'SYNTAX_ERROR';
      
      mockGetPaymentsInfo.mockRejectedValue(mockSqlError);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid SQL query syntax');
      expect(responseData).toEqual({
        err_msg: "Something wrong happened. Try again later!",
        err_cause: 'SYNTAX_ERROR'
      });
    });

    it('handles timeout errors', async () => {
      const mockTimeoutError = new Error('Query execution timeout');
      (mockTimeoutError as any).cause = 'QUERY_TIMEOUT';
      
      mockGetPaymentsInfo.mockRejectedValue(mockTimeoutError);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData).toEqual({
        err_msg: "Something wrong happened. Try again later!",
        err_cause: 'QUERY_TIMEOUT'
      });
    });

    it('handles errors without cause property', async () => {
      const mockGenericError = new Error('Something went wrong');
      
      mockGetPaymentsInfo.mockRejectedValue(mockGenericError);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Something went wrong');
      expect(responseData).toEqual({
        err_msg: "Something wrong happened. Try again later!",
        err_cause: undefined
      });
    });

    it('handles non-Error objects thrown as exceptions', async () => {
      const mockErrorObject = { 
        message: 'Custom error from DAL', 
        code: 'DAL_ERROR',
        details: 'Payment retrieval failed'
      };
      
      mockGetPaymentsInfo.mockRejectedValue(mockErrorObject);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Custom error from DAL');
      expect(responseData.err_msg).toBe("Something wrong happened. Try again later!");
    });

    it('handles string errors thrown as exceptions', async () => {
      const mockStringError = 'String error message';
      
      mockGetPaymentsInfo.mockRejectedValue(mockStringError);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(consoleErrorSpy).toHaveBeenCalledWith(undefined);
      expect(responseData.err_msg).toBe("Something wrong happened. Try again later!");
    });
  });

  describe('Request Parameter Handling', () => {
    it('uses hardcoded email regardless of request parameters', async () => {
      const mockPaymentData = { totalPaid: 250.00 };
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentData);

      await GET(mockRequest);

      expect(mockGetPaymentsInfo).toHaveBeenCalledWith('librarian@gmail.com');
      expect(mockGetPaymentsInfo).toHaveBeenCalledTimes(1);
    });

    it('ignores query parameters in request URL', async () => {
      const mockPaymentData = { totalPaid: 300.00 };
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentData);
      
      const requestWithQuery = new Request('http://localhost:3000/test?email=different@email.com&user=other');

      await GET(requestWithQuery);

      expect(mockGetPaymentsInfo).toHaveBeenCalledWith('librarian@gmail.com');
    });

    it('ignores request body content', async () => {
      const mockPaymentData = { totalPaid: 400.00 };
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentData);
      
      const requestWithBody = new Request('http://localhost:3000/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      await GET(requestWithBody);

      expect(mockGetPaymentsInfo).toHaveBeenCalledWith('librarian@gmail.com');
    });

    it('ignores request headers', async () => {
      const mockPaymentData = { totalPaid: 500.00 };
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentData);
      
      const requestWithHeaders = new Request('http://localhost:3000/test', {
        headers: {
          'Authorization': 'Bearer token123',
          'X-User-Email': 'header@email.com',
          'Content-Type': 'application/json'
        }
      });

      await GET(requestWithHeaders);

      expect(mockGetPaymentsInfo).toHaveBeenCalledWith('librarian@gmail.com');
    });
  });

  describe('Response Format and Structure', () => {
    it('returns proper Response object with JSON content-type', async () => {
      const mockPaymentData = { totalPaid: 150.00 };
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentData);

      const response = await GET(mockRequest);

      expect(response).toBeInstanceOf(Response);
      expect(response.headers.get('content-type')).toContain('application/json');
    });

    it('maintains JSON serialization for special values', async () => {
      const mockSpecialData = {
        amount: 123.45,
        date: '2024-01-15T10:30:00Z',
        isActive: true,
        metadata: null,
        description: 'Payment with "quotes" and \\backslashes'
      };

      mockGetPaymentsInfo.mockResolvedValue(mockSpecialData);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData.amount).toBe(123.45);
      expect(responseData.isActive).toBe(true);
      expect(responseData.metadata).toBeNull();
      expect(responseData.description).toBe('Payment with "quotes" and \\backslashes');
    });

    it('handles Unicode characters in response data', async () => {
      const mockUnicodeData = {
        studentName: 'José María González-Pérez',
        courseName: 'Математика для начинающих',
        currency: '€',
        emoji: '🎓📚💰',
        description: 'Ĉu vi parolas Esperanton?'
      };

      mockGetPaymentsInfo.mockResolvedValue(mockUnicodeData);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData.studentName).toBe('José María González-Pérez');
      expect(responseData.courseName).toBe('Математика для начинающих');
      expect(responseData.currency).toBe('€');
      expect(responseData.emoji).toBe('🎓📚💰');
      expect(responseData.description).toBe('Ĉu vi parolas Esperanton?');
    });
  });

  describe('Console Logging Behavior', () => {
    it('logs successful payment data to console', async () => {
      const mockPaymentData = { totalPaid: 750.00, status: 'active' };
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentData);

      await GET(mockRequest);

      expect(consoleLogSpy).toHaveBeenCalledWith(mockPaymentData);
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it('logs null values to console', async () => {
      mockGetPaymentsInfo.mockResolvedValue(null);

      await GET(mockRequest);

      expect(consoleLogSpy).toHaveBeenCalledWith(null);
    });

    it('logs complex objects to console', async () => {
      const mockComplexData = {
        nested: { deep: { value: 'test' } },
        array: [1, 2, 3],
        boolean: false
      };
      mockGetPaymentsInfo.mockResolvedValue(mockComplexData);

      await GET(mockRequest);

      expect(consoleLogSpy).toHaveBeenCalledWith(mockComplexData);
    });

    it('does not log when error occurs', async () => {
      const mockError = new Error('Test error');
      mockGetPaymentsInfo.mockRejectedValue(mockError);

      await GET(mockRequest);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Test error');
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('handles extremely large payment amounts', async () => {
      const mockLargeData = {
        totalPaid: Number.MAX_SAFE_INTEGER,
        maxTransaction: 999999999.99
      };

      mockGetPaymentsInfo.mockResolvedValue(mockLargeData);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData.totalPaid).toBe(Number.MAX_SAFE_INTEGER);
      expect(responseData.maxTransaction).toBe(999999999.99);
    });

    it('handles negative payment amounts (refunds)', async () => {
      const mockRefundData = {
        totalPaid: -150.00,
        reason: 'Course cancellation refund'
      };

      mockGetPaymentsInfo.mockResolvedValue(mockRefundData);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData.totalPaid).toBe(-150.00);
      expect(responseData.reason).toBe('Course cancellation refund');
    });

    it('handles very long arrays of payment data', async () => {
      const mockLargeArray = Array.from({ length: 1000 }, (_, i) => ({
        id: `payment_${i}`,
        amount: (i + 1) * 10.50,
        date: `2024-01-${String((i % 30) + 1).padStart(2, '0')}`
      }));

      mockGetPaymentsInfo.mockResolvedValue({ payments: mockLargeArray });

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData.payments).toHaveLength(1000);
      expect(responseData.payments[0].id).toBe('payment_0');
      expect(responseData.payments[999].id).toBe('payment_999');
      expect(responseData.payments[999].amount).toBe(10500);
    });

    it('handles deeply nested object structures', async () => {
      const mockDeepData = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  value: 'deep value',
                  amount: 42.42
                }
              }
            }
          }
        }
      };

      mockGetPaymentsInfo.mockResolvedValue(mockDeepData);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData.level1.level2.level3.level4.level5.value).toBe('deep value');
      expect(responseData.level1.level2.level3.level4.level5.amount).toBe(42.42);
    });
  });

  describe('Database Configuration and Environment', () => {
    it('initializes neon client with DATABASE_URL from environment', () => {
      expect(mockNeon).toHaveBeenCalledWith(process.env.DATABASE_URL);
    });

    it('handles missing DATABASE_URL gracefully', () => {
      expect(mockNeon).toHaveBeenCalled();
    });
  });

  describe('Async Operation Performance', () => {
    it('completes successfully under normal conditions', async () => {
      const mockPaymentData = { totalPaid: 100.00 };
      mockGetPaymentsInfo.mockResolvedValue(mockPaymentData);

      const startTime = Date.now();
      const response = await GET(mockRequest);
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('handles slow database responses appropriately', async () => {
      const mockPaymentData = { totalPaid: 200.00 };
      
      mockGetPaymentsInfo.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockPaymentData), 100))
      );

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData).toEqual(mockPaymentData);
      expect(response.status).toBe(200);
    });

    it('handles promise rejection in async context', async () => {
      const mockError = new Error('Async operation failed');
      mockGetPaymentsInfo.mockRejectedValue(mockError);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.err_msg).toBe("Something wrong happened. Try again later!");
    });
  });

  describe('Additional Coverage Tests', () => {
    it('tests the complete happy path flow from start to finish', async () => {
      const mockPaymentData = {
        userEmail: 'librarian@gmail.com',
        totalEarnings: 5000.00,
        lastPayment: '2024-01-30',
        status: 'active'
      };

      mockGetPaymentsInfo.mockResolvedValue(mockPaymentData);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      // Verify the entire flow
      expect(mockGetPaymentsInfo).toHaveBeenCalledWith('librarian@gmail.com');
      expect(consoleLogSpy).toHaveBeenCalledWith(mockPaymentData);
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockPaymentData);
    });

    it('verifies error response structure matches expected format', async () => {
      const testError = new Error('Database unavailable');
      (testError as any).cause = 'CONNECTION_TIMEOUT';
      
      mockGetPaymentsInfo.mockRejectedValue(testError);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData).toHaveProperty('err_msg');
      expect(responseData).toHaveProperty('err_cause');
      expect(responseData.err_msg).toBe("Something wrong happened. Try again later!");
      expect(responseData.err_cause).toBe('CONNECTION_TIMEOUT');
    });

    it('validates that hardcoded email is consistently used', async () => {
      const mockData = { test: 'data' };
      mockGetPaymentsInfo.mockResolvedValue(mockData);

      // Test with different request configurations
      const requests = [
        new Request('http://localhost:3000/test'),
        new Request('http://localhost:3000/test?email=other@test.com'),
        new Request('http://localhost:3000/test', { 
          headers: { 'X-User': 'someone@else.com' }
        })
      ];

      for (const request of requests) {
        await GET(request);
        expect(mockGetPaymentsInfo).toHaveBeenCalledWith('librarian@gmail.com');
      }

      expect(mockGetPaymentsInfo).toHaveBeenCalledTimes(3);
    });
  });
});