import Queue from "bull";
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher'
import { natsWrapper } from '../nats-wrapper'

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
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
});

export { expirationQueue };
