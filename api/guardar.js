import { redis } from '../../lib/redis'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permite POST' });
  }

  const data = req.body;
  await redis.set("itinerario_global", JSON.stringify(data));
  res.status(200).json({ ok: true });
}
