import mongoose from "mongoose";
import { TicketCreatedEvent } from "@edticketing/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setUp = async () => {
  // create an instance of a listerner
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(), // we call ack and invoke the mock funtion
  };

  return { listener, data, msg };
};

it("creates and save a ticket", async () => {
  const { listener, data, msg } = await setUp();

  // call the onMessage function iwth the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it("ack the message", async () => {
  const { listener, data, msg } = await setUp();

  // call the onMessage fundyion iwth the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
