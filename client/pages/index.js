import Link from "next/link";

const LandingPage = function ({ currentUser, tickets }) {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/ticket/[ticketId" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

// This is the function run on serverside rendering, any data returned at here, we can use it in the function above

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets"); // making get request to the router fetch back the data of all the tickets

  return { tickets: data }; // making the data as tickets do it can be used in the page rendering in upper component
};

export default LandingPage;
