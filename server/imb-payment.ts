import axios from 'axios';
import crypto from 'crypto';

export interface IMBPaymentRequest {
  orderId: string;
  amount: number;
  productName: string;
  customerEmail?: string;
  customerName?: string;
  returnUrl: string;
  callbackUrl: string;
}

export interface IMBPaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  message: string;
  error?: string;
}

export interface IMBPaymentStatus {
  orderId: string;
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  timestamp: string;
}

export class IMBPaymentGateway {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.IMB_API_KEY || '';
    this.baseUrl = 'https://api.imbpayments.com/v1'; // Replace with actual IMB API URL
    
    if (!this.apiKey) {
      throw new Error('IMB_API_KEY is required');
    }
  }

  private generateSignature(data: any): string {
    const sortedData = Object.keys(data)
      .sort()
      .reduce((result: any, key: string) => {
        result[key] = data[key];
        return result;
      }, {});
    
    const dataString = Object.values(sortedData).join('|');
    return crypto
      .createHmac('sha256', this.apiKey)
      .update(dataString)
      .digest('hex');
  }

  async createPayment(request: IMBPaymentRequest): Promise<IMBPaymentResponse> {
    try {
      const payload = {
        order_id: request.orderId,
        amount: request.amount,
        product_name: request.productName,
        customer_email: request.customerEmail,
        customer_name: request.customerName,
        return_url: request.returnUrl,
        callback_url: request.callbackUrl,
        timestamp: new Date().toISOString(),
      };

      const signature = this.generateSignature(payload);

      const response = await axios.post(
        `${this.baseUrl}/payments/create`,
        {
          ...payload,
          signature,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      if (response.data.success) {
        return {
          success: true,
          paymentUrl: response.data.payment_url,
          transactionId: response.data.transaction_id,
          message: 'Payment created successfully',
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Payment creation failed',
          error: response.data.error,
        };
      }
    } catch (error: any) {
      console.error('IMB Payment creation error:', error);
      
      if (error.response) {
        return {
          success: false,
          message: 'Payment gateway error',
          error: error.response.data?.message || error.message,
        };
      } else if (error.request) {
        return {
          success: false,
          message: 'Unable to connect to payment gateway',
          error: 'Network error',
        };
      } else {
        return {
          success: false,
          message: 'Payment processing failed',
          error: error.message,
        };
      }
    }
  }

  async getPaymentStatus(transactionId: string): Promise<IMBPaymentStatus | null> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/payments/status/${transactionId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 15000, // 15 seconds timeout
        }
      );

      if (response.data.success) {
        return {
          orderId: response.data.order_id,
          transactionId: response.data.transaction_id,
          status: response.data.status,
          amount: response.data.amount,
          timestamp: response.data.timestamp,
        };
      }

      return null;
    } catch (error: any) {
      console.error('IMB Payment status check error:', error);
      return null;
    }
  }

  async verifyCallback(callbackData: any, signature: string): Promise<boolean> {
    try {
      const expectedSignature = this.generateSignature(callbackData);
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  // Fallback method for when IMB API is not available
  async createMockPayment(request: IMBPaymentRequest): Promise<IMBPaymentResponse> {
    // This is a development/testing fallback
    const mockTransactionId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      paymentUrl: `${request.returnUrl}?transaction_id=${mockTransactionId}&status=completed&order_id=${request.orderId}`,
      transactionId: mockTransactionId,
      message: 'Mock payment created successfully (Development Mode)',
    };
  }
}

export const imbPayment = new IMBPaymentGateway();