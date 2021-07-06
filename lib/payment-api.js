import {
  performApplePayPayment,
  isApplePayJsAvailable,
} from "./apple-pay-js-handler";
import {
  performApplePayPayment as performApplePayPaymentPaymentRequest,
  isPaymentRequestAvailable,
} from "./payment-request-handler";
import { paymentRequestApi } from "./payment-config";

export { PaymentStatus } from "./payment-status";

console.log(
  `Using ${paymentRequestApi ? "Payment Request" : "Apple Pay JS"} API!`
);

export const isApplePayAvailable = () => {
  console.log("isApplePayAvailable");
  return paymentRequestApi
    ? isPaymentRequestAvailable()
    : isApplePayJsAvailable();
};

export const performPayment = (currencyCode, items, label, amount) => {
  return paymentRequestApi
    ? performApplePayPaymentPaymentRequest(currencyCode, items, label, amount)
    : performApplePayPayment(currencyCode, items, label, amount);
};
