import { redis } from '../../lib/redis'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permite POST' });
  }
  try {
    const data = req.body;
    // Opcional: valida que sea un array
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'El itinerario debe ser un array' });
    }
    await redis.set("itinerario_global", JSON.stringify(data));
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "No se pudo guardar el itinerario" });
  }
}
