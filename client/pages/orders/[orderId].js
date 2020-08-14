import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout"; // the template checkout libary for stripe
import useRequest from "../../hooks/use-request";
import Router from "next/router";

function OrderShow({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = useState("0");
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      // calculate the time left
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft(); // without calling this, we have to wait one second for the function to appear
    const timerId = setInterval(findTimeLeft, 1000); // call the function every second

    return () => {
      // when we return from useEffect, this is called when we naviate to other pages
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_uc6c2rQ1YTbSE2LNxwax0nRX00uzXmPkpk" //publishable key, should be refactored as env variable in prodction environment
        amount={order.ticket.price * 100} // cents multiply to 100  to dollars
        email={currentUser.email}
      />
      {errors}
    </div>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query; // pulling the orderId as the same as the file name
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};
export default OrderShow;
