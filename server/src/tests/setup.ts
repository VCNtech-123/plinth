import mongoose from "mongoose";

jest.setTimeout(20000);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});