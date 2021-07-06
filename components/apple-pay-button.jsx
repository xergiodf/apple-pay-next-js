import React, { Component } from "react";
import PropTypes from "prop-types";
import { isApplePayAvailable } from "../lib/payment-api";

const ApplePayButtonStatus = { UNKNOWN: 0, AVAILABLE: 1, NOT_AVAILABLE: 2 };

const useComponentWillMount = (func) => {
  console.log("will mount");
  const willMount = React.useRef(true);

  if (willMount.current) func();

  willMount.current = false;
};

export const ApplePayButton = ({ onClick }) => {
  const [state, setState] = React.useState({
    applePayButtonStatus: ApplePayButtonStatus.UNKNOWN,
  });

  useComponentWillMount(() =>
    isApplePayAvailable()
      .then((canMakePayments) => {
        console.log(canMakePayments);
        setState({
          applePayButtonStatus: canMakePayments
            ? ApplePayButtonStatus.AVAILABLE
            : ApplePayButtonStatus.NOT_AVAILABLE,
        });
      })
      .catch((err) => {
        console.log(err);
        setState({
          applePayButtonStatus: ApplePayButtonStatus.NOT_AVAILABLE,
        });
      })
  );

  const Button = () => {
    switch (state.applePayButtonStatus) {
      case ApplePayButtonStatus.UNKNOWN:
        return <div>Checking Apple Pay... </div>;
      case ApplePayButtonStatus.AVAILABLE:
        return (
          <div>
            <div
              className="apple-pay-button apple-pay-button-black"
              id="apple-pay"
              onClick={onClick}
            ></div>
          </div>
        );
      case ApplePayButtonStatus.NOT_AVAILABLE:
        return (
          <div id="apple-pay-activation">
            Apple Pay inactive on your device.
          </div>
        );
      default:
        return <div> Invalid status!!! </div>;
    }
  };

  return (
    <div>
      <Button onClick={onClick} />
      <hr />
      <apple-pay-button
        buttonstyle="black"
        type="checkout"
        locale="en-EN"
      ></apple-pay-button>
    </div>
  );
};

ApplePayButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ApplePayButton;
