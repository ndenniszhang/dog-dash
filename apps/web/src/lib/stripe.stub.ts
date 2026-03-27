/**
 * Stripe stub.
 * Simulates payment processing with realistic delays and responses.
 * Replace with: loadStripe() from '@stripe/stripe-js' + server-side stripe SDK
 */

const log = (method: string, ...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[stripe stub] ${method}`, ...args);
  }
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

let paymentCounter = 1000;

export interface PaymentResult {
  success: boolean;
  paymentIntentId: string;
  last4?: string;
  error?: string;
}

export interface PaymentMethodResult {
  success: boolean;
  paymentMethodId: string;
  last4: string;
  brand: string;
  error?: string;
}

export interface PayoutAccountResult {
  success: boolean;
  accountId: string;
  error?: string;
}

/** Simulate charging a card for a walk booking */
export async function simulatePayment(amountCents: number): Promise<PaymentResult> {
  log('simulatePayment', amountCents);
  await delay(1200);
  const id = `pi_mock_${++paymentCounter}_${Date.now()}`;
  return { success: true, paymentIntentId: id, last4: '4242' };
}

/** Simulate saving a payment method during onboarding */
export async function savePaymentMethod(
  cardNumber: string,
  _expiry: string,
  _cvv: string,
): Promise<PaymentMethodResult> {
  log('savePaymentMethod', cardNumber.slice(-4));
  await delay(1500);
  const last4 = cardNumber.replace(/\s/g, '').slice(-4);
  return {
    success: true,
    paymentMethodId: `pm_mock_${Date.now()}`,
    last4,
    brand: 'visa',
  };
}

/** Simulate connecting a payout bank account for walkers */
export async function connectPayoutAccount(
  routingNumber: string,
  _accountNumber: string,
): Promise<PayoutAccountResult> {
  log('connectPayoutAccount', routingNumber);
  await delay(2000);
  return { success: true, accountId: `acct_mock_${Date.now()}` };
}

/** Simulate refunding a payment */
export async function simulateRefund(paymentIntentId: string): Promise<{ success: boolean }> {
  log('simulateRefund', paymentIntentId);
  await delay(800);
  return { success: true };
}
