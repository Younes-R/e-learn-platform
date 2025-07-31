export interface MockPaymentData {
  totalPaid?: number;
  pendingPayments?: number;
  paymentHistory?: Array<{
    id: number;
    amount: number;
    date: string;
    status: string;
  }>;
}

export interface MockErrorData {
  message: string;
  cause?: string;
  code?: string;
}

export function createMockPaymentData(overrides: Partial<MockPaymentData> = {}): MockPaymentData {
  return {
    totalPaid: 100.00,
    pendingPayments: 25.00,
    paymentHistory: [
      { id: 1, amount: 50.00, date: '2024-01-15', status: 'paid' },
      { id: 2, amount: 50.00, date: '2024-01-20', status: 'paid' }
    ],
    ...overrides
  };
}

export function createMockError(message: string, cause?: string): Error {
  const error = new Error(message);
  if (cause) {
    (error as any).cause = cause;
  }
  return error;
}

export function createMockRequest(url = 'http://localhost:3000/test', options: RequestInit = {}): Request {
  return new Request(url, {
    method: 'GET',
    ...options
  });
}

export async function assertValidApiResponse(response: Response): Promise<void> {
  expect(response).toBeInstanceOf(Response);
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('application/json');
  
  const data = await response.json();
  expect(data).toBeDefined();
}

export async function assertValidErrorResponse(response: Response): Promise<void> {
  expect(response).toBeInstanceOf(Response);
  expect(response.status).toBe(200);
  
  const data = await response.json();
  expect(data).toHaveProperty('err_msg');
  expect(data.err_msg).toBe("Something wrong happened. Try again later!");
  expect(data).toHaveProperty('err_cause');
}

export async function assertNothingReturnedResponse(response: Response): Promise<void> {
  expect(response).toBeInstanceOf(Response);
  expect(response.status).toBe(200);
  
  const data = await response.json();
  expect(data).toEqual({ msg: "nothing returned" });
}

export const TestDataGenerators = {
  largePaymentArray: (size: number) => ({
    payments: Array.from({ length: size }, (_, i) => ({
      id: `payment_${i}`,
      amount: Math.round((Math.random() * 1000 + 10) * 100) / 100,
      date: `2024-01-${String((i % 30) + 1).padStart(2, '0')}`
    }))
  }),

  unicodeData: () => ({
    studentName: 'José María González-Pérez',
    courseName: 'Математика для начинающих',
    currency: '€',
    description: 'Payment for "Advanced Course" 🎓',
    amount: 299.99
  }),

  extremeNumbers: () => ({
    maxSafeInteger: Number.MAX_SAFE_INTEGER,
    minSafeInteger: Number.MIN_SAFE_INTEGER,
    negativeAmount: -150.75,
    zeroAmount: 0,
    floatingPoint: 123.456789
  })
};

export default {
  createMockPaymentData,
  createMockError,
  createMockRequest,
  assertValidApiResponse,
  assertValidErrorResponse,
  assertNothingReturnedResponse,
  TestDataGenerators
};