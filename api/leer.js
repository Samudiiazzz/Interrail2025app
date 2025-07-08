import { redis } from '../lib/redis.js'

export default async function handler(req, res) {
  try {
    const data = await redis.get("itinerario_global");
    console.log("Dato crudo de Redis:", data); // <--- Agrega este log
    let itinerary = [];
    if (data) {
      try {
        itinerary = JSON.parse(data);
      } catch (e) {
        console.error("Error al parsear:", e);
        return res.status(500).json({ error: "Datos corruptos en Redis", itinerary: [] });
      }
    }
    res.status(200).json({ itinerary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo leer el itinerario", itinerary: [] });
  }
}
