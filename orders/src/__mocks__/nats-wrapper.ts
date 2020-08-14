// fake implemenation of nats wrapper that used for unit test

export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation(
      // this function should be called as away to prove that the vent is publushed successfully
      (subject: string, data: string, callback: () => void) => {
        callback();
      }
    ),
  },
};

// provide a mock function, in order to test if the event is actually published

// to create a mock function: jest.fn

// mockImplemntation allow to call another function
