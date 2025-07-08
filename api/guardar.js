import { redis } from '../lib/redis.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  try {
    // Si el body no está parseado, parsea manualmente
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    console.log('BODY RECIBIDO:', body);
    const itinerario = body.itinerario;
    if (!Array.isArray(itinerario) || !itinerario.length) {
      return res.status(400).json({ error: 'El itinerario debe ser un array no vacío' });
    }
    await redis.set("itinerario_global", JSON.stringify(itinerario));
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo guardar el itinerario" });
  }
}
