import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    await redis.set("foo", "bar");
    const value = await redis.get("foo");
    res.status(200).json({ value });
  } catch (error) {
    console.error("ERROR EN TEST:", error);
    res.status(500).json({ error: "Error conectando a Redis" });
  }
}