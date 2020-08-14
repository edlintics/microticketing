// make a fake copy of stripe environment

export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({}),
  },
};
