# Payment Integration Setup - Razorpay

## Overview
This application now includes a payment system where users need to pay ₹10 to download any question paper. The integration uses Razorpay as the payment gateway.

## Setup Instructions

### 1. Create Razorpay Account
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Generate API keys from Settings > API Keys

### 2. Configure Environment Variables
Update your `.env.local` file with your Razorpay credentials:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
```

### 3. Test Payment Flow
1. Start the development server: `npm run dev`
2. Sign in to your account
3. Go to Question Papers page
4. Click "Pay ₹10 & Download" on any paper
5. Use Razorpay test card details:
   - Card: 4111 1111 1111 1111
   - CVV: 123
   - Expiry: Any future date

## Features Implemented

### 1. Payment Gateway Integration
- ✅ Razorpay SDK integration
- ✅ Order creation API endpoint
- ✅ Payment verification API endpoint
- ✅ Secure signature validation

### 2. User Interface Updates
- ✅ Payment buttons with ₹10 pricing display
- ✅ Processing states and loading indicators
- ✅ Payment confirmation page
- ✅ Error handling and user feedback

### 3. Security Features
- ✅ Authentication required for payments
- ✅ Payment signature verification
- ✅ Server-side validation
- ✅ Secure API endpoints

## Payment Flow

1. **User clicks "Pay ₹10 & Download"**
   - Creates order via `/api/create-order`
   - Opens Razorpay payment modal

2. **Payment Processing**
   - User completes payment via Razorpay
   - Payment response sent to confirmation page

3. **Payment Verification**
   - Server verifies payment signature via `/api/verify-payment`
   - Returns download URL on successful verification

4. **Download Access**
   - User can download the question paper
   - Payment is logged for reference

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── create-order/route.ts     # Creates Razorpay order
│   │   └── verify-payment/route.ts   # Verifies payment
│   ├── payment/
│   │   └── confirmation/page.tsx     # Payment confirmation page
│   └── question-papers/page.tsx      # Updated with payment integration
├── lib/
│   └── auth.ts                       # Authentication configuration
└── .env.local                        # Environment variables
```

## Testing Checklist

- [ ] Payment modal opens correctly
- [ ] Test payment with Razorpay test cards
- [ ] Payment verification works
- [ ] Download URL is provided after successful payment
- [ ] Error handling for failed payments
- [ ] Authentication required for payment flow
- [ ] Payment confirmation page displays correctly

## Production Deployment Notes

1. **Replace test keys with live keys** in production
2. **Set up webhooks** for payment status updates (optional)
3. **Implement payment logging** in database
4. **Add payment history** for users
5. **Set up proper error monitoring**

## Security Considerations

- All API routes require authentication
- Payment signatures are verified server-side
- Environment variables store sensitive keys
- No payment details stored in frontend
- Razorpay handles PCI compliance