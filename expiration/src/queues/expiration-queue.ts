import Queue from "bull";

interface Payload {
  // the strcuture of job event transmit between file to redis server
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  // this order:expiration is like channel in nats
  redis: {
    host: process.env.REDIS_HOST,
  },
});

//processing the job and respond back to the server
expirationQueue.process(async (job) => {
  console.log(
    "I want to publish an expiration: complete event for orderId",
    job.data.orderId
  );
});

export { expirationQueue };
