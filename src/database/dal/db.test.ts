import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { neon } from '@neondatabase/serverless';
import { 
  getUserId, 
  isUserExistsWith, 
  getUserByEmail, 
  createUser, 
  getPostgresVersion, 
  initializeDatabase 
} from './db';
import { Student, Teacher, Moderator } from '../definitions';

// Mock the neon database client
vi.mock('@neondatabase/serverless');

const mockSql = vi.fn();
const mockedNeon = neon as Mock;

// Mock console methods to avoid noise in test output
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('Database DAL Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedNeon.mockReturnValue(mockSql);
    // Setup default transaction behavior for initializeDatabase tests
    mockSql.transaction = vi.fn().mockResolvedValue([{}, {}]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserId', () => {
    it('should return user ID when user exists', async () => {
      const mockResult = [{ id: 'test-user-id-123' }];
      mockSql.mockResolvedValue(mockResult);

      const result = await getUserId('test@example.com');

      expect(result).toBe('test-user-id-123');
      expect(mockSql).toHaveBeenCalledWith(['SELECT id FROM users WHERE email = ', ''], 'test@example.com');
    });

    it('should throw error when no user found', async () => {
      mockSql.mockResolvedValue([]);

      await expect(getUserId('nonexistent@example.com'))
        .rejects
        .toThrow('[getUserId]: No user ID found for this email.');
    });

    it('should throw error when result is null', async () => {
      mockSql.mockResolvedValue(null);

      await expect(getUserId('test@example.com'))
        .rejects
        .toThrow('[getUserId]: No user ID found for this email.');
    });

    it('should handle database errors and log them', async () => {
      const dbError = {
        message: 'Connection failed',
        routine: 'postgres_connect',
        hint: 'Check connection string'
      };
      mockSql.mockRejectedValue(dbError);

      await expect(getUserId('test@example.com'))
        .rejects
        .toThrow('[getUserId]: Failed to get user ID.');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Connection failed')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('postgres_connect')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Check connection string')
      );
    });

    it('should handle empty email input', async () => {
      mockSql.mockResolvedValue([]);

      await expect(getUserId(''))
        .rejects
        .toThrow('[getUserId]: No user ID found for this email.');
    });

    it('should handle special characters in email', async () => {
      const mockResult = [{ id: 'user-with-special-chars' }];
      mockSql.mockResolvedValue(mockResult);

      const result = await getUserId('user+test@example-domain.co.uk');

      expect(result).toBe('user-with-special-chars');
    });

    it('should handle SQL injection attempts safely', async () => {
      const mockResult = [{ id: 'safe-user-id' }];
      mockSql.mockResolvedValue(mockResult);

      const maliciousEmail = "'; DROP TABLE users; --";
      const result = await getUserId(maliciousEmail);

      expect(result).toBe('safe-user-id');
      expect(mockSql).toHaveBeenCalledWith(['SELECT id FROM users WHERE email = ', ''], maliciousEmail);
    });

    it('should handle very long email addresses', async () => {
      const longEmail = 'a'.repeat(200) + '@example.com';
      mockSql.mockResolvedValue([]);

      await expect(getUserId(longEmail))
        .rejects
        .toThrow('[getUserId]: No user ID found for this email.');
    });
  });

  describe('isUserExistsWith', () => {
    it('should return true when user exists', async () => {
      mockSql.mockResolvedValue([{ type: 'student' }]);

      const result = await isUserExistsWith('existing@example.com');

      expect(result).toBe(true);
      expect(mockSql).toHaveBeenCalledWith(['SELECT type FROM users WHERE email = ', ''], 'existing@example.com');
    });

    it('should return false when user does not exist', async () => {
      mockSql.mockResolvedValue([]);

      const result = await isUserExistsWith('nonexistent@example.com');

      expect(result).toBe(false);
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection lost');
      mockSql.mockRejectedValue(dbError);

      await expect(isUserExistsWith('test@example.com'))
        .rejects
        .toThrow('Could not search for user.');

      expect(consoleSpy).toHaveBeenCalledWith('Database connection lost');
    });

    it('should handle multiple results correctly', async () => {
      mockSql.mockResolvedValue([
        { type: 'student' },
        { type: 'teacher' }
      ]);

      const result = await isUserExistsWith('duplicate@example.com');

      expect(result).toBe(true);
    });

    it('should handle null result', async () => {
      mockSql.mockResolvedValue(null);

      const result = await isUserExistsWith('test@example.com');

      expect(result).toBe(false);
    });

    it('should handle undefined result', async () => {
      mockSql.mockResolvedValue(undefined);

      const result = await isUserExistsWith('test@example.com');

      expect(result).toBe(false);
    });
  });

  describe('getUserByEmail', () => {
    const mockUserData = {
      first_name: 'John',
      last_name: 'Doe',
      type: 'student',
      birth_date: '1990-01-01',
      phone_number: '+1234567890',
      profile_pic: 'profile.jpg',
      pwd: 'hashedpassword',
      bio: 'Student bio',
      address: '123 Main St',
      cv: null,
      diploma: null,
      email: 'john@example.com'
    };

    it('should return user data when user exists', async () => {
      mockSql.mockResolvedValue([mockUserData]);

      const result = await getUserByEmail('john@example.com');

      expect(result).toEqual(mockUserData);
      expect(mockSql).toHaveBeenCalledWith(
        expect.arrayContaining([
          'SELECT first_name, last_name, type, birth_date, phone_number, profile_pic, pwd, bio, address, cv, diploma, email FROM users WHERE email = ',
          ' '
        ]),
        'john@example.com'
      );
    });

    it('should return undefined when no user found', async () => {
      mockSql.mockResolvedValue([]);

      const result = await getUserByEmail('nonexistent@example.com');

      expect(result).toBeUndefined();
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Query failed');
      mockSql.mockRejectedValue(dbError);

      await expect(getUserByEmail('test@example.com'))
        .rejects
        .toThrow('Could not search for user.');

      expect(consoleSpy).toHaveBeenCalledWith('Query failed');
    });

    it('should return first result when multiple users found', async () => {
      const mockUsers = [mockUserData, { ...mockUserData, first_name: 'Jane' }];
      mockSql.mockResolvedValue(mockUsers);

      const result = await getUserByEmail('test@example.com');

      expect(result).toEqual(mockUserData);
    });

    it('should handle null database result', async () => {
      mockSql.mockResolvedValue(null);

      const result = await getUserByEmail('test@example.com');

      expect(result).toBeUndefined();
    });

    it('should handle user data with all fields populated', async () => {
      const fullUserData = {
        ...mockUserData,
        cv: 'resume.pdf',
        diploma: 'degree.pdf',
        address: 'Full Address'
      };
      mockSql.mockResolvedValue([fullUserData]);

      const result = await getUserByEmail('full@example.com');

      expect(result).toEqual(fullUserData);
    });
  });

  describe('createUser', () => {
    const mockStudent: Student = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      birthDate: '1995-05-15',
      phoneNumber: '+1987654321',
      profilePic: 'alice.jpg',
      pwd: 'hashedpwd',
      refreshToken: 'refresh123',
      bio: 'I am a student'
    };

    const mockTeacher: Teacher = {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      birthDate: '1980-03-20',
      phoneNumber: '+1555000111',
      profilePic: 'bob.jpg',
      pwd: 'hashedpwd',
      refreshToken: 'refresh456',
      bio: 'I am a teacher',
      address: '456 Oak St',
      cv: 'cv.pdf',
      diploma: 'diploma.pdf'
    };

    const mockModerator: Moderator = {
      firstName: 'Carol',
      lastName: 'Wilson',
      email: 'carol@example.com',
      birthDate: '1985-12-10',
      phoneNumber: '+1444333222',
      profilePic: 'carol.jpg',
      pwd: 'hashedpwd',
      refreshToken: 'refresh789',
      bio: 'I am a moderator'
    };

    it('should create student when userType is student and user has bio', async () => {
      const mockResult = [{ id: 'new-student-id', ...mockStudent }];
      mockSql.mockResolvedValue(mockResult);

      const result = await createUser('student', mockStudent);

      expect(result).toEqual(mockResult);
      expect(mockSql).toHaveBeenCalledWith(
        expect.arrayContaining([
          'INSERT INTO users (first_name, last_name, email, type, birth_date, phone_number, profile_pic, pwd, refresh_token, bio, address, cv, diploma) VALUES (\n      ',
          ', ',
          ', ',
          ', \'student\', ',
          ', ',
          ', ',
          ', ',
          ', ',
          ', ',
          ', NULL, NULL, NULL \n      ) returning *'
        ]),
        mockStudent.firstName,
        mockStudent.lastName,
        mockStudent.email,
        mockStudent.birthDate,
        mockStudent.phoneNumber,
        mockStudent.profilePic,
        mockStudent.pwd,
        mockStudent.refreshToken,
        mockStudent.bio
      );
    });

    it('should create teacher when userType is teacher and user has cv', async () => {
      const mockResult = [{ id: 'new-teacher-id', ...mockTeacher }];
      mockSql.mockResolvedValue(mockResult);

      const result = await createUser('teacher', mockTeacher);

      expect(result).toEqual(mockResult);
      expect(mockSql).toHaveBeenCalledWith(
        expect.arrayContaining([
          'INSERT INTO users (first_name, last_name, email, type, birth_date, phone_number, profile_pic, pwd, refresh_token, bio, address, cv, diploma) VALUES (\n        ',
          ', ',
          ', ',
          ', \'teacher\', ',
          ', ',
          ', ',
          ', ',
          ', ',
          ', ',
          ', ',
          ', ',
          ', ',
          '\n        ) returning *'
        ]),
        mockTeacher.firstName,
        mockTeacher.lastName,
        mockTeacher.email,
        mockTeacher.birthDate,
        mockTeacher.phoneNumber,
        mockTeacher.profilePic,
        mockTeacher.pwd,
        mockTeacher.refreshToken,
        mockTeacher.bio,
        mockTeacher.address,
        mockTeacher.cv,
        mockTeacher.diploma
      );
    });

    it('should create moderator when userType is moderator and user has no address', async () => {
      const mockResult = [{ id: 'new-moderator-id', ...mockModerator }];
      mockSql.mockResolvedValue(mockResult);

      const result = await createUser('moderator', mockModerator);

      expect(result).toEqual(mockResult);
      expect(mockSql).toHaveBeenCalledWith(
        expect.arrayContaining([
          'INSERT INTO users (first_name, last_name, email, type, birth_date, phone_number, profile_pic, pwd, refresh_token, bio, address, cv, diploma) VALUES ( \n      ',
          ', ',
          ', ',
          ', \'moderator\', ',
          ', ',
          ', ',
          ', ',
          ', ',
          ', ',
          ', NULL, NULL, NULL, NULL\n      ) returning *'
        ]),
        mockModerator.firstName,
        mockModerator.lastName,
        mockModerator.email,
        mockModerator.birthDate,
        mockModerator.phoneNumber,
        mockModerator.profilePic,
        mockModerator.pwd,
        mockModerator.refreshToken
      );
    });

    it('should throw error for invalid user type', async () => {
      const invalidUser = { firstName: 'Test' } as any;

      await expect(createUser('student' as any, invalidUser))
        .rejects
        .toThrow('Invalid user type or user object!');
    });

    it('should throw error when student user missing bio', async () => {
      const invalidStudent = { ...mockStudent };
      delete (invalidStudent as any).bio;

      await expect(createUser('student', invalidStudent as any))
        .rejects
        .toThrow('Invalid user type or user object!');
    });

    it('should throw error when teacher user missing cv', async () => {
      const invalidTeacher = { ...mockTeacher };
      delete (invalidTeacher as any).cv;

      await expect(createUser('teacher', invalidTeacher as any))
        .rejects
        .toThrow('Invalid user type or user object!');
    });

    it('should throw error when moderator user has address', async () => {
      const invalidModerator = { ...mockModerator, address: '123 Street' } as any;

      await expect(createUser('moderator', invalidModerator))
        .rejects
        .toThrow('Invalid user type or user object!');
    });

    it('should handle database errors during student creation', async () => {
      const dbError = new Error('Constraint violation');
      mockSql.mockRejectedValue(dbError);

      await expect(createUser('student', mockStudent))
        .rejects
        .toThrow('Database Error: could not create user!');

      expect(consoleSpy).toHaveBeenCalledWith(dbError);
    });

    it('should handle database errors during teacher creation', async () => {
      const dbError = new Error('Constraint violation');
      mockSql.mockRejectedValue(dbError);

      await expect(createUser('teacher', mockTeacher))
        .rejects
        .toThrow('Database Error: could not create user!');

      expect(consoleSpy).toHaveBeenCalledWith(dbError);
    });

    it('should handle database errors during moderator creation', async () => {
      const dbError = new Error('Constraint violation');
      mockSql.mockRejectedValue(dbError);

      await expect(createUser('moderator', mockModerator))
        .rejects
        .toThrow('Database Error: could not create user!');

      expect(consoleSpy).toHaveBeenCalledWith(dbError);
    });

    it('should handle unicode characters in user data', async () => {
      const unicodeStudent: Student = {
        firstName: '张三',
        lastName: 'González',
        email: 'test@münchen.de',
        birthDate: '1995-05-15',
        phoneNumber: '+1987654321',
        profilePic: 'profile.jpg',
        pwd: 'hashedpwd',
        refreshToken: 'refresh123',
        bio: 'Héllo wørld 🌍'
      };

      const mockResult = [{ id: 'unicode-user-id', ...unicodeStudent }];
      mockSql.mockResolvedValue(mockResult);

      const result = await createUser('student', unicodeStudent);

      expect(result).toEqual(mockResult);
    });

    it('should validate teacher has all required fields', async () => {
      const teacherWithoutBio = {
        firstName: 'Test',
        lastName: 'Teacher',
        email: 'teacher@example.com',
        birthDate: '1980-01-01',
        phoneNumber: '+1234567890',
        profilePic: 'pic.jpg',
        pwd: 'pwd',
        refreshToken: 'token',
        address: 'Address',
        cv: 'cv.pdf',
        diploma: 'diploma.pdf'
      } as any;

      await expect(createUser('teacher', teacherWithoutBio))
        .rejects
        .toThrow('Invalid user type or user object!');
    });

    it('should handle empty string values in user data', async () => {
      const studentWithEmptyStrings: Student = {
        firstName: '',
        lastName: '',
        email: 'empty@example.com',
        birthDate: '1995-05-15',
        phoneNumber: '',
        profilePic: '',
        pwd: 'hashedpwd',
        refreshToken: 'refresh123',
        bio: ''
      };

      const mockResult = [{ id: 'empty-strings-id', ...studentWithEmptyStrings }];
      mockSql.mockResolvedValue(mockResult);

      const result = await createUser('student', studentWithEmptyStrings);

      expect(result).toEqual(mockResult);
    });
  });

  describe('getPostgresVersion', () => {
    it('should query and log postgres version', async () => {
      const mockVersion = [{ version: 'PostgreSQL 14.0' }];
      mockSql.mockResolvedValue(mockVersion);

      await getPostgresVersion();

      expect(mockSql).toHaveBeenCalledWith(['SELECT version();']);
      expect(consoleLogSpy).toHaveBeenCalledWith(mockVersion);
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Connection failed');
      mockSql.mockRejectedValue(dbError);

      await expect(getPostgresVersion()).rejects.toThrow('Connection failed');
    });

    it('should handle empty version result', async () => {
      mockSql.mockResolvedValue([]);

      await getPostgresVersion();

      expect(consoleLogSpy).toHaveBeenCalledWith([]);
    });

    it('should handle null version result', async () => {
      mockSql.mockResolvedValue(null);

      await getPostgresVersion();

      expect(consoleLogSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('initializeDatabase', () => {
    it('should execute database initialization transaction', async () => {
      const mockResults = [{ success: true }, { success: true }];
      mockSql.transaction.mockResolvedValue(mockResults);

      await initializeDatabase();

      expect(mockSql.transaction).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.any(Object),
          expect.any(Object)
        ])
      );

      expect(consoleLogSpy).toHaveBeenCalledWith(mockResults[0], mockResults[1]);
    });

    it('should handle transaction failures', async () => {
      const transactionError = new Error('Transaction failed');
      mockSql.transaction.mockRejectedValue(transactionError);

      await expect(initializeDatabase()).rejects.toThrow('Transaction failed');
    });

    it('should create all required database objects', async () => {
      const mockResults = Array(11).fill({ success: true });
      mockSql.transaction.mockResolvedValue(mockResults);

      await initializeDatabase();

      expect(mockSql.transaction).toHaveBeenCalledTimes(1);
      const transactionArgs = mockSql.transaction.mock.calls[0][0];
      
      // Should have multiple SQL commands for creating types and tables
      expect(transactionArgs).toHaveLength(11);
    });

    it('should handle partial transaction success', async () => {
      const mixedResults = [
        { success: true },
        { error: 'Some error' }
      ];
      mockSql.transaction.mockResolvedValue(mixedResults);

      await initializeDatabase();

      expect(consoleLogSpy).toHaveBeenCalledWith(mixedResults[0], mixedResults[1]);
    });

    it('should handle empty transaction result', async () => {
      mockSql.transaction.mockResolvedValue([]);

      await initializeDatabase();

      expect(consoleLogSpy).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  describe('Integration and Edge Cases', () => {
    it('should handle concurrent database operations', async () => {
      const mockResult1 = [{ id: 'user1' }];
      const mockResult2 = [{ id: 'user2' }];
      
      mockSql
        .mockResolvedValueOnce(mockResult1)
        .mockResolvedValueOnce(mockResult2);

      const [result1, result2] = await Promise.all([
        getUserId('user1@example.com'),
        getUserId('user2@example.com')
      ]);

      expect(result1).toBe('user1');
      expect(result2).toBe('user2');
      expect(mockSql).toHaveBeenCalledTimes(2);
    });

    it('should handle database timeout errors', async () => {
      const timeoutError = new Error('Query timeout');
      timeoutError.name = 'TimeoutError';
      mockSql.mockRejectedValue(timeoutError);

      await expect(getUserId('test@example.com'))
        .rejects
        .toThrow('[getUserId]: Failed to get user ID.');
    });

    it('should handle connection pool exhaustion', async () => {
      const poolError = new Error('Connection pool exhausted');
      poolError.name = 'PoolError';
      mockSql.mockRejectedValue(poolError);

      await expect(isUserExistsWith('test@example.com'))
        .rejects
        .toThrow('Could not search for user.');
    });

    it('should handle malformed database responses', async () => {
      mockSql.mockResolvedValue('malformed response');

      await expect(getUserId('test@example.com'))
        .rejects
        .toThrow('[getUserId]: No user ID found for this email.');
    });

    it('should handle very large result sets', async () => {
      const largeResult = Array(10000).fill({ type: 'student' });
      mockSql.mockResolvedValue(largeResult);

      const result = await isUserExistsWith('popular@example.com');

      expect(result).toBe(true);
    });

    it('should properly handle environment variable edge cases', () => {
      // Test that the neon client is called with the environment variable
      expect(mockedNeon).toHaveBeenCalledWith(process.env.DATABASE_URL);
    });

    it('should handle type coercion in getUserId', async () => {
      const mockResult = [{ id: 123 }]; // Number instead of string
      mockSql.mockResolvedValue(mockResult);

      const result = await getUserId('test@example.com');

      expect(result).toBe('123'); // Should be coerced to string
    });

    it('should handle null/undefined values in user creation', async () => {
      const studentWithNulls: Student = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        birthDate: null as any,
        phoneNumber: undefined as any,
        profilePic: 'pic.jpg',
        pwd: 'pwd',
        refreshToken: 'token',
        bio: 'bio'
      };

      const mockResult = [{ id: 'null-user-id', ...studentWithNulls }];
      mockSql.mockResolvedValue(mockResult);

      const result = await createUser('student', studentWithNulls);

      expect(result).toEqual(mockResult);
    });
  });
});