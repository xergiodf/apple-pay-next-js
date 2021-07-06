import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { merchantIdentifier } from "../lib/payment-config";
import { performPayment, PaymentStatus } from "../lib/payment-api";
import * as cartData from "../lib/cart-data";
import { ApplePayButton } from "../components/apple-pay-button";

const CHECKOUT_STATUS = {
  READY: 0,
  PAYMENT_IN_PROGRESS: 1,
  PAYMENT_SUCCESS: 2,
  PAYMENT_FAILURE: 3,
  PAYMENT_CANCEL: 4,
};

const CURRENCY_CODE = "USD";

const NoSSRApplePayButton = dynamic(
  () => import("../components/apple-pay-button"),
  { ssr: false }
);

export default function IndexPage() {
  const [state, setState] = React.useState({
    checkoutStatus: CHECKOUT_STATUS.READY,
  });

  const onClick = () => {
    setState((oldState) => ({
      ...oldState,
      checkoutStatus: CHECKOUT_STATUS.PAYMENT_IN_PROGRESS,
    }));
    performPayment(
      CURRENCY_CODE,
      cartData.products.map((item) => {
        return { label: item.name, amount: item.amount };
      }),
      "Testing",
      100
    )
      .then((paymentStatus) => {
        switch (paymentStatus) {
          case PaymentStatus.CANCEL:
            setState({
              shoppingCardStatus: CHECKOUT_STATUS.PAYMENT_CANCEL,
            });
            break;
          case PaymentStatus.SUCCESS:
            setState({
              shoppingCardStatus: CHECKOUT_STATUS.PAYMENT_SUCCESS,
            });
            break;
          default:
            setState({
              shoppingCardStatus: CHECKOUT_STATUS.PAYMENT_FAILURE,
            });
        }
      })
      .catch((err) => {
        this.setState({
          shoppingCardStatus: CHECKOUT_STATUS.PAYMENT_FAILURE,
        });
      });
  };

  const AlertMessage = () => {
    switch (state.checkoutStatus) {
      case CHECKOUT_STATUS.PAYMENT_IN_PROGRESS:
        return <h1>Payment in progress...</h1>;
      case CHECKOUT_STATUS.PAYMENT_SUCCESS:
        return <h1>Payment successful</h1>;
      case CHECKOUT_STATUS.PAYMENT_CANCEL:
        return <h1>Payment cancelled</h1>;
      case CHECKOUT_STATUS.PAYMENT_FAILURE:
        return <h1>Payment failed</h1>;
      default:
        return null;
    }
  };

  return (
    <div>
      <Head>
        <script src="https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js"></script>
      </Head>
      <AlertMessage />
      {state.checkoutStatus !== CHECKOUT_STATUS.PAYMENT_SUCCESS && (
        <>
          <h3>CHECKOUT</h3>
          {state.checkoutStatus === CHECKOUT_STATUS.READY && (
            <NoSSRApplePayButton
              merchantIdentifier={merchantIdentifier}
              onClick={onClick}
            />
          )}
        </>
      )}
    </div>
  );
}
