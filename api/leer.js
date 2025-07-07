import { redis } from '../../lib/redis'

export default async function handler(req, res) {
  const data = await redis.get("itinerario_global");
  const itinerary = JSON.parse(data || "[]");
  res.status(200).json({ itinerary });
}
