import React from "react";

export default function ShowPaymentInfo({ order }) {
  return (
    <div>
      <p>
        <span>Order Id:{order.paymentIntent.id}</span>{" "}
        <span>
          Amount:
          {(order.paymentIntent.amount / 100).toLocaleString("en-AU", {
            style: "currency",
            currency: "AUD",
          })}
        </span>{" "}
        <span>Currency:{order.paymentIntent.currency.toUpperCase()}</span>{" "}
        <span>
          Method:{order.paymentIntent.payment_method_types[0].toUpperCase()}
        </span>{" "}
        <span>Payment:{order.paymentIntent.status.toUpperCase()}</span>{" "}
        <span>
          Ordered on:
          {new Date(order.paymentIntent.created * 1000).toLocaleString()}
        </span>{" "}
        <span className="badge bg-primary text-white">STATUS: {order.orderStatus}</span>{" "}
      </p>
    </div>
  );
}
