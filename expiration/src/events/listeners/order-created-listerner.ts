import { Listener, OrderCreatedEvent, Subjects } from "@edticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // enque the code and send is to redis server
    await expirationQueue.add({
      orderId: data.id, // fetched from the object from the order created event
    });

    msg.ack();
  }
}
