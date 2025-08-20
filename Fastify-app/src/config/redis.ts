import { createClient } from 'redis';

const redisClient = createClient({
  //url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || '6379'}`,
  url: `redis://127.0.0.1:6379`,
  password: "",
});

redisClient.on('error', (err:any) => {
  console.error('Redis Client Error', err);
});

redisClient.connect();

export default redisClient;
