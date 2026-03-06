/**
 * @desc    Create Razorpay Order
 * @route   POST /api/payment/order
 * @access  Private
 */
export declare const createPaymentOrder: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * @desc    Verify Razorpay Payment and Create Final Order
 * @route   POST /api/payment/verify
 * @access  Private
 */
export declare const verifyPayment: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=paymentController.d.ts.map