import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPaymentsInfo, getTeacherCourses } from './teacher';

// Mock the neon database client
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => vi.fn()),
}));

// Mock the getUserId function
vi.mock('./db', () => ({
  getUserId: vi.fn(),
}));

describe('Teacher DAL Functions', () => {
  let mockSql: any;
  
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup mock SQL function
    mockSql = vi.fn();
    const { neon } = require('@neondatabase/serverless');
    neon.mockReturnValue(mockSql);
    
    // Mock console methods to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getPaymentsInfo', () => {
    const mockTeacherEmail = 'teacher@example.com';

    it('should return payments info with valid data', async () => {
      // Mock database responses
      mockSql
        .mockResolvedValueOnce([{ count: '1500' }]) // coursesIncomeCountRes
        .mockResolvedValueOnce([{ count: '800' }])  // sessionsIncomeCountRes
        .mockResolvedValueOnce([                    // coursesIncomeRes
          {
            invoice: 'inv_123',
            date: new Date('2024-01-15'),
            firstName: 'John',
            lastName: 'Doe',
            course: 'Math 101',
            price: 100
          },
          {
            invoice: 'inv_124',
            date: new Date('2024-01-16'),
            firstName: 'Jane',
            lastName: 'Smith',
            course: 'Science 101',
            price: 150
          }
        ]);

      const result = await getPaymentsInfo(mockTeacherEmail);

      expect(result).toEqual({
        coursesIncomeCount: 1500,
        sessionsIncomeCount: 800,
        coursesIncome: [
          {
            invoice: 'inv_123',
            date: new Date('2024-01-15'),
            firstName: 'John',
            lastName: 'Doe',
            course: 'Math 101',
            price: 100
          },
          {
            invoice: 'inv_124',
            date: new Date('2024-01-16'),
            firstName: 'Jane',
            lastName: 'Smith',
            course: 'Science 101',
            price: 150
          }
        ]
      });

      expect(mockSql).toHaveBeenCalledTimes(3);
    });

    it('should handle zero income counts', async () => {
      mockSql
        .mockResolvedValueOnce([{ count: null }])     // coursesIncomeCountRes
        .mockResolvedValueOnce([{ count: null }])     // sessionsIncomeCountRes
        .mockResolvedValueOnce([]);                   // coursesIncomeRes

      const result = await getPaymentsInfo(mockTeacherEmail);

      expect(result).toEqual({
        coursesIncomeCount: 0,
        sessionsIncomeCount: 0,
        coursesIncome: null
      });
    });

    it('should handle empty courses income result', async () => {
      mockSql
        .mockResolvedValueOnce([{ count: '500' }])
        .mockResolvedValueOnce([{ count: '300' }])
        .mockResolvedValueOnce([]);

      const result = await getPaymentsInfo(mockTeacherEmail);

      expect(result.coursesIncome).toBeNull();
    });

    it('should handle undefined counts gracefully', async () => {
      mockSql
        .mockResolvedValueOnce([{ count: undefined }])
        .mockResolvedValueOnce([{ count: undefined }])
        .mockResolvedValueOnce([]);

      const result = await getPaymentsInfo(mockTeacherEmail);

      expect(result.coursesIncomeCount).toBe(0);
      expect(result.sessionsIncomeCount).toBe(0);
    });

    it('should handle string numeric values correctly', async () => {
      mockSql
        .mockResolvedValueOnce([{ count: '2500' }])
        .mockResolvedValueOnce([{ count: '1200' }])
        .mockResolvedValueOnce([]);

      const result = await getPaymentsInfo(mockTeacherEmail);

      expect(result.coursesIncomeCount).toBe(2500);
      expect(result.sessionsIncomeCount).toBe(1200);
    });

    it('should throw error when database query fails', async () => {
      const mockError = new Error('Database connection failed');
      mockError.routine = 'connect';
      mockError.hint = 'Check database connection';
      
      mockSql.mockRejectedValueOnce(mockError);

      await expect(getPaymentsInfo(mockTeacherEmail)).rejects.toThrow(
        '[getPaymentsInfo]: Failed to get payments info.'
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[Database error]:')
      );
    });

    it('should handle empty teacher email', async () => {
      mockSql
        .mockResolvedValueOnce([{ count: null }])
        .mockResolvedValueOnce([{ count: null }])
        .mockResolvedValueOnce([]);

      const result = await getPaymentsInfo('');

      expect(result).toEqual({
        coursesIncomeCount: 0,
        sessionsIncomeCount: 0,
        coursesIncome: null
      });
    });

    it('should handle malformed email addresses', async () => {
      mockSql
        .mockResolvedValueOnce([{ count: null }])
        .mockResolvedValueOnce([{ count: null }])
        .mockResolvedValueOnce([]);

      const result = await getPaymentsInfo('invalid-email');

      expect(result).toEqual({
        coursesIncomeCount: 0,
        sessionsIncomeCount: 0,
        coursesIncome: null
      });
    });

    it('should preserve original error in thrown error', async () => {
      const originalError = new Error('Connection timeout');
      mockSql.mockRejectedValueOnce(originalError);

      try {
        await getPaymentsInfo(mockTeacherEmail);
      } catch (error: any) {
        expect(error.cause).toBe(originalError);
      }
    });
  });

  describe('getTeacherCourses', () => {
    const mockTeacherEmail = 'teacher@example.com';

    it('should return complete courses data with documents and enrolled students', async () => {
      const mockCoursesData = [
        {
          cid: 'course_1',
          title: 'Mathematics 101',
          description: 'Basic mathematics course',
          price: 100,
          module: 'MATH',
          level: 'Beginner'
        },
        {
          cid: 'course_2',
          title: 'Physics 101',
          description: 'Basic physics course',
          price: 150,
          module: 'PHYS',
          level: 'Intermediate'
        }
      ];

      const mockDocumentsData = [
        { title: 'Lesson 1', uri: 'doc_1', cid: 'course_1' },
        { title: 'Lesson 2', uri: 'doc_2', cid: 'course_1' },
        { title: 'Physics Intro', uri: 'doc_3', cid: 'course_2' }
      ];

      const mockEnrolledStudents = [
        { cid: 'course_1', studentsCount: '25' },
        { cid: 'course_2', studentsCount: '18' }
      ];

      mockSql
        .mockResolvedValueOnce(mockCoursesData)      // coursesDataSegments
        .mockResolvedValueOnce(mockDocumentsData)    // documentsData
        .mockResolvedValueOnce(mockEnrolledStudents); // enrolledStudentsCountArray

      const result = await getTeacherCourses(mockTeacherEmail);

      expect(result).toEqual([
        {
          cid: 'course_1',
          title: 'Mathematics 101',
          description: 'Basic mathematics course',
          price: 100,
          module: 'MATH',
          level: 'Beginner',
          documents: [
            { title: 'Lesson 1', uri: 'doc_1', cid: 'course_1' },
            { title: 'Lesson 2', uri: 'doc_2', cid: 'course_1' }
          ],
          enrolledStudentsNumber: 25
        },
        {
          cid: 'course_2',
          title: 'Physics 101',
          description: 'Basic physics course',
          price: 150,
          module: 'PHYS',
          level: 'Intermediate',
          documents: [
            { title: 'Physics Intro', uri: 'doc_3', cid: 'course_2' }
          ],
          enrolledStudentsNumber: 18
        }
      ]);
    });

    it('should return null when teacher has no courses', async () => {
      mockSql.mockResolvedValueOnce([]); // Empty courses

      const result = await getTeacherCourses(mockTeacherEmail);

      expect(result).toBeNull();
    });

    it('should handle courses with no documents', async () => {
      const mockCoursesData = [
        {
          cid: 'course_1',
          title: 'Mathematics 101',
          description: 'Basic mathematics course',
          price: 100,
          module: 'MATH',
          level: 'Beginner'
        }
      ];

      mockSql
        .mockResolvedValueOnce(mockCoursesData)
        .mockResolvedValueOnce([]) // No documents
        .mockResolvedValueOnce([{ cid: 'course_1', studentsCount: '10' }]);

      const result = await getTeacherCourses(mockTeacherEmail);

      expect(console.warn).toHaveBeenCalledWith(
        'All courses by this teacher have no documents!'
      );
      expect(result![0].documents).toEqual([]);
    });

    it('should handle courses with no enrolled students', async () => {
      const mockCoursesData = [
        {
          cid: 'course_1',
          title: 'Mathematics 101',
          description: 'Basic mathematics course',
          price: 100,
          module: 'MATH',
          level: 'Beginner'
        }
      ];

      mockSql
        .mockResolvedValueOnce(mockCoursesData)
        .mockResolvedValueOnce([{ title: 'Doc 1', uri: 'doc_1', cid: 'course_1' }])
        .mockResolvedValueOnce([]); // No enrolled students

      const result = await getTeacherCourses(mockTeacherEmail);

      expect(result![0].enrolledStudentsNumber).toBeUndefined();
    });

    it('should handle partial document matches', async () => {
      const mockCoursesData = [
        { cid: 'course_1', title: 'Math 101', description: 'Math', price: 100, module: 'MATH', level: 'Beginner' },
        { cid: 'course_2', title: 'Physics 101', description: 'Physics', price: 150, module: 'PHYS', level: 'Intermediate' }
      ];

      const mockDocumentsData = [
        { title: 'Math Doc', uri: 'doc_1', cid: 'course_1' }
        // Note: no documents for course_2
      ];

      const mockEnrolledStudents = [
        { cid: 'course_1', studentsCount: '10' },
        { cid: 'course_2', studentsCount: '5' }
      ];

      mockSql
        .mockResolvedValueOnce(mockCoursesData)
        .mockResolvedValueOnce(mockDocumentsData)
        .mockResolvedValueOnce(mockEnrolledStudents);

      const result = await getTeacherCourses(mockTeacherEmail);

      expect(result![0].documents).toHaveLength(1);
      expect(result![1].documents).toHaveLength(0);
    });

    it('should throw error when database query fails', async () => {
      const mockError = new Error('Database query failed');
      mockError.routine = 'query_execution';
      mockError.hint = 'Check SQL syntax';
      
      mockSql.mockRejectedValueOnce(mockError);

      await expect(getTeacherCourses(mockTeacherEmail)).rejects.toThrow(
        '[getTeacherCourses]: Failed to get teacher courses.'
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[Database error]:')
      );
    });

    it('should handle null/undefined courses data', async () => {
      mockSql.mockResolvedValueOnce(null);

      const result = await getTeacherCourses(mockTeacherEmail);

      expect(result).toBeNull();
    });

    it('should handle empty teacher email', async () => {
      mockSql.mockResolvedValueOnce([]);

      const result = await getTeacherCourses('');

      expect(result).toBeNull();
    });

    it('should handle courses with zero enrolled students', async () => {
      const mockCoursesData = [
        {
          cid: 'course_1',
          title: 'New Course',
          description: 'Brand new course',
          price: 200,
          module: 'NEW',
          level: 'Advanced'
        }
      ];

      mockSql
        .mockResolvedValueOnce(mockCoursesData)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ cid: 'course_1', studentsCount: '0' }]);

      const result = await getTeacherCourses(mockTeacherEmail);

      expect(result![0].enrolledStudentsNumber).toBe(0);
    });

    it('should preserve original error in thrown error', async () => {
      const originalError = new Error('Network timeout');
      mockSql.mockRejectedValueOnce(originalError);

      try {
        await getTeacherCourses(mockTeacherEmail);
      } catch (error: any) {
        expect(error.cause).toBe(originalError);
      }
    });

    it('should handle malformed student count data', async () => {
      const mockCoursesData = [
        {
          cid: 'course_1',
          title: 'Test Course',
          description: 'Test',
          price: 100,
          module: 'TEST',
          level: 'Beginner'
        }
      ];

      mockSql
        .mockResolvedValueOnce(mockCoursesData)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ cid: 'course_1', studentsCount: 'invalid' }]);

      const result = await getTeacherCourses(mockTeacherEmail);

      expect(result![0].enrolledStudentsNumber).toBe(NaN);
    });

    it('should handle courses with special characters in data', async () => {
      const mockCoursesData = [
        {
          cid: 'course_1',
          title: 'Math & Physics 101',
          description: 'Course with "quotes" and special chars',
          price: 100,
          module: 'MATH&PHYS',
          level: 'Beginner'
        }
      ];

      mockSql
        .mockResolvedValueOnce(mockCoursesData)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ cid: 'course_1', studentsCount: '15' }]);

      const result = await getTeacherCourses(mockTeacherEmail);

      expect(result![0].title).toBe('Math & Physics 101');
      expect(result![0].description).toBe('Course with "quotes" and special chars');
    });
  });

  describe('Error handling edge cases', () => {
    it('should handle database errors with missing error properties', async () => {
      const mockError = new Error('Generic error');
      // No routine or hint properties
      
      const mockSql = vi.fn().mockRejectedValueOnce(mockError);
      const { neon } = require('@neondatabase/serverless');
      neon.mockReturnValue(mockSql);

      await expect(getPaymentsInfo('test@example.com')).rejects.toThrow();
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('msg: Generic error')
      );
    });

    it('should handle SQL injection attempts gracefully', async () => {
      const maliciousEmail = "'; DROP TABLE users; --";
      
      mockSql
        .mockResolvedValueOnce([{ count: null }])
        .mockResolvedValueOnce([{ count: null }])
        .mockResolvedValueOnce([]);

      const result = await getPaymentsInfo(maliciousEmail);

      expect(result).toEqual({
        coursesIncomeCount: 0,
        sessionsIncomeCount: 0,
        coursesIncome: null
      });
    });
  });
});