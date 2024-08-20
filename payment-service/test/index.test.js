const paypal = require('@paypal/checkout-server-sdk');
const { handler } = require('../index.js');

jest.mock('@paypal/checkout-server-sdk');

describe('PayPal Lambda Function', () => {
    let mockExecute;

    beforeEach(() => {
        mockExecute = jest.fn();
        
        paypal.core.SandboxEnvironment = jest.fn();
        paypal.core.PayPalHttpClient = jest.fn().mockImplementation(() => {
            return { execute: mockExecute };
        });

        // Reset process.env before each test
        process.env.PAYPAL_CLIENT_ID = 'fake-client-id';
        process.env.PAYPAL_CLIENT_SECRET = 'fake-client-secret';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create an order successfully', async () => {
        const event = {
            action: 'create',
        };

        const mockResponse = {
            result: {
                id: 'ORDER-ID',
                status: 'CREATED'
            }
        };

        mockExecute.mockResolvedValueOnce(mockResponse);

        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual(mockResponse.result);
        expect(paypal.core.SandboxEnvironment).toHaveBeenCalledWith('fake-client-id', 'fake-client-secret');
        expect(mockExecute).toHaveBeenCalled();
    });

    test('should capture an order successfully', async () => {
        const event = {
            action: 'capture',
            orderId: 'ORDER-ID'
        };

        const mockResponse = {
            result: {
                id: 'ORDER-ID',
                status: 'COMPLETED'
            }
        };

        mockExecute.mockResolvedValueOnce(mockResponse);

        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual(mockResponse.result);
        expect(paypal.core.SandboxEnvironment).toHaveBeenCalledWith('fake-client-id', 'fake-client-secret');
        expect(mockExecute).toHaveBeenCalled();
    });

    test('should return an error if action is invalid', async () => {
        const event = {
            action: 'invalid_action',
        };

        const result = await handler(event);

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toEqual({ error: 'Invalid action. Use "create" or "capture".' });
        expect(mockExecute).not.toHaveBeenCalled();
    });

    test('should return an error if orderId is missing for capture', async () => {
        const event = {
            action: 'capture',
        };

        const result = await handler(event);

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toEqual({ error: 'Order ID is required for capture' });
        expect(mockExecute).not.toHaveBeenCalled();
    });

    test('should handle errors from PayPal API', async () => {
        const event = {
            action: 'create',
        };

        mockExecute.mockRejectedValueOnce(new Error('Something went wrong'));

        const result = await handler(event);

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toEqual({ error: 'Something went wrong' });
        expect(mockExecute).toHaveBeenCalled();
    });
});
