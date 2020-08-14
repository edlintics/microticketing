import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

function NewTicket() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  // using teh custom template function to make request to teh backend server
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => {
      Router.push("/"); // redirect back to the root route onSuccess of creating the ticket
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };

  const onBlur = () => {
    //automatic formating whne user click outside of the field
    const value = parseFloat(price);

    if (isNaN(value)) {
      // return empty if the input is not a number
      return;
    }

    setPrice(value.toFixed(2)); // automatically round up to 2 decimal
  };
  return (
    <div>
      <h1> Create a ticket </h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label> Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label> Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit </button>
      </form>
    </div>
  );
}

export default NewTicket;
