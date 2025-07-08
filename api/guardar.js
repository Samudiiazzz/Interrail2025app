import { redis } from '../lib/redis.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('Método no permitido:', req.method);
    return res.status(405).json({ error: 'Método no permitido' });
  }
  try {
    let body = req.body;
    console.log('BODY RAW:', body);
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
        console.log('BODY PARSEADO:', body);
      } catch (e) {
        console.log('Error al parsear body:', e);
        return res.status(400).json({ error: 'Body inválido' });
      }
    }
    if (!body || typeof body !== 'object') {
      console.log('Body ausente o no es objeto:', body);
      return res.status(400).json({ error: 'Body ausente o no válido' });
    }
    const itinerario = body.itinerario;
    console.log('ITINERARIO RECIBIDO:', itinerario);
    if (!Array.isArray(itinerario) || !itinerario.length) {
      return res.status(400).json({ error: 'El itinerario debe ser un array no vacío' });
    }
    await redis.set("itinerario_global", JSON.stringify(itinerario));
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('ERROR EN HANDLER:', error);
    res.status(500).json({ error: "No se pudo guardar el itinerario" });
  }
}
