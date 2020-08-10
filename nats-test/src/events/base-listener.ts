import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  // refer as type T in event
  abstract subject: T["subject"]; // name of the channel this listener is going to listen to
  abstract queueGroupName: string; // Name of the queue group this listerner will join
  abstract onMessage(data: T["data"], msg: Message): void; // funcion to run when a message is received

  private client: Stan; // pre initiallized NATS client
  protected ackWait = 5 * 1000; // Number of seconds this listerner has to ack a message

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    // deafault subscription options
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // upload all events have been recorded(hellping for durable subscription later) (only happen in the first time when we created a new service)
      .setManualAckMode(true) // enable us to manually decide how to process with the event, avoid the lost ofevents in case server down
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName); // store a record of processed and non preocessed event in database in NATS file event, thus, this help to proceed events if the service is down
  }

  listen() {
    // every 30 seconds wil send to diffrent instance of the service until the event is processed

    // code to set up the subscription
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName, // use to manage instance of the same class, enable when service down doents wipe out teh durable subscription
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      // message is the same thinga as event in microservice

      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    // helper function to parse a message
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data) // hadnle a string
      : JSON.parse(data.toString("utf8")); // handle a buffer
  }
}
