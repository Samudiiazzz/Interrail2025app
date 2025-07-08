import { redis } from '../../lib/redis'

export default async function handler(req, res) {
  try {
    const data = await redis.get("itinerario_global");
    let itinerary = [];
    if (data) {
      try {
        itinerary = JSON.parse(data);
      } catch (e) {
        return res.status(500).json({ error: "Datos corruptos en Redis", itinerary: [] });
      }
    }
    res.status(200).json({ itinerary });
  } catch (error) {
    res.status(500).json({ error: "No se pudo leer el itinerario", itinerary: [] });
  }
}
