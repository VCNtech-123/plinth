import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI as string,
  jwt: process.env.JWT_SECRET as string,
  expdate: process.env.JWT_EXPIRES_IN as string,
  clientUrl: process.env.CLIENT_URL as string
};