import { redis } from '../lib/redis.js'

export default async function handler(req, res) {
  try {
    // Imprime las variables de entorno
    console.log("URL:", process.env.UPSTASH_REDIS_REST_URL);
    console.log("TOKEN:", process.env.UPSTASH_REDIS_REST_TOKEN);

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
    console.error("ERROR EN HANDLER:", error);
    res.status(500).json({ error: "No se pudo leer el itinerario", itinerary: [] });
  }
}
