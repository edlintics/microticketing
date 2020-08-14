import useRequest from "../../hooks/use-request";
import Router from "next/router";

function TicketShow({ ticket }) {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      console.log(order);
      Router.push("/orders/[orderId]", `/orders/${order.id}`); // router to the order created file params(layoutDirectoryInPage, RealLink)
    },
  });

  return (
    <div>
      <h1> {ticket.title}</h1>
      <h4> Price: {ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
}

export default TicketShow;

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query; // pulling out the id as teh name of the file we router to [ticketId]

  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};
