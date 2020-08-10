//This index file ise used to indicate teh app will started on post 3000

import { OrderCreatedListener } from "./events/listeners/order-created-listerner";

import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  //CHECK IF ENVIRONMENT VARIABLE IS AVAILABLE

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined ");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined ");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined ");
  }

  // connect to mongodb
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
};

start(); // run start function
