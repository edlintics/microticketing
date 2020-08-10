import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
}); // an instance to connect to nats sever ( can be refered as stan instead of client)

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }

  // const data = JSON.stringify({
  //   // have to convert into strig as the NATS only accept strings
  //   id: "123",
  //   title: "concert",
  //   price: 29,
  // });

  // stan.publish("ticket:created", data, () => {
  //   // subject in bus
  //   console.log("Events published");
  // });
});
