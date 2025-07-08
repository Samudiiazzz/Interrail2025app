import { redis } from '../lib/redis.js'

const ITINERARIO_PREDEFINIDO = [
  {
    day: 1,
    startDate: "2025-07-16",
    city: "Milán",
    activities: [
      "Llegada 12:25 PM a Milán.",
      "Tarde: Duomo, terrazas y Galería Vittorio Emanuele II.",
      "Noche: Navigli (canales).",
      "Dormir: Milán (1/3)."
    ],
    part: "Italia y Alsacia"
  },
  {
    day: 2,
    startDate: "2025-07-17",
    city: "Estrasburgo",
    activities: [
      "Mañana: Tren Milán → Estrasburgo (≈ 8 h, vía Suiza).",
      "Tarde-noche: Petite France; cena alsaciana.",
      "Dormir: Estrasburgo (2/3)."
    ],
    part: "Italia y Alsacia"
  },
  {
    day: 3,
    startDate: "2025-07-18",
    city: "Estrasburgo",
    activities: [
      "Día completo en Estrasburgo: Catedral, paseo en barco, Parlamento Europeo.",
      "Dormir: Estrasburgo (3/3)."
    ],
    part: "Italia y Alsacia"
  },
  {
    day: 4,
    startDate: "2025-07-19",
    city: "Colmar/Estrasburgo",
    activities: [
      "Excursión a Colmar (30 min en tren).",
      "Regreso y noche en Estrasburgo."
    ],
    part: "Italia y Alsacia"
  },
  {
    day: 5,
    startDate: "2025-07-20",
    city: "Bruselas",
    activities: [
      "Tren Estrasburgo → Bruselas (≈ 3½ h).",
      "Tarde: Grand-Place, Manneken Pis, moules-frites.",
      "Dormir: Bruselas (1/3)."
    ],
    part: "Bélgica y reunión"
  },
  {
    day: 6,
    startDate: "2025-07-21",
    city: "Bruselas/Brujas/Gante",
    activities: [
      "Mañana: recogida en Zaventem (10:00 h).",
      "Mediodía: tren a Brujas (1 h) – Markt, Grote Kerk.",
      "Tarde: Gante (30 min) – Graslei, Castillo.",
      "Noche: regreso a Bruselas.",
      "Dormir: Bruselas (2/3)."
    ],
    part: "Bélgica y reunión"
  },
  {
    day: 7,
    startDate: "2025-07-22",
    city: "Ámsterdam",
    activities: [
      "Thalys Bruselas → Ámsterdam (≈ 2 h).",
      "Tarde-noche: canales, Jordaan, De Pijp.",
      "Dormir: Ámsterdam (1/2)."
    ],
    part: "Bélgica y reunión"
  },
  {
    day: 8,
    startDate: "2025-07-23",
    city: "Ámsterdam",
    activities: [
      "Día completo en Ámsterdam: Van Gogh/Rijksmuseum, Vondelpark, paseo en barco.",
      "Dormir: Ámsterdam (2/2)."
    ],
    part: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 9,
    startDate: "2025-07-24",
    city: "Berlín",
    activities: [
      "Tren diurno Ámsterdam → Berlín (cambio en Hannover, salida 08:00, llegada 16:30).",
      "Noche: Alexanderplatz y Nikolaiviertel.",
      "Dormir: Berlín (1/3)."
    ],
    part: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 10,
    startDate: "2025-07-25",
    city: "Berlín",
    activities: [
      "Día completo en Berlín: Brandeburgo, Reichstag, Memorial del Holocausto.",
      "Dormir: Berlín (2/3)."
    ],
    part: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 11,
    startDate: "2025-07-26",
    city: "Berlín",
    activities: [
      "Día completo en Berlín: East Side Gallery, Checkpoint Charlie, Isla de los Museos.",
      "Dormir: Berlín (3/3)."
    ],
    part: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 12,
    startDate: "2025-07-27",
    city: "Praga",
    activities: [
      "Tren Berlín → Praga (11:16 AM–15:24 PM).",
      "Tarde-noche: Ciudad Vieja y Reloj Astronómico.",
      "Dormir: Praga (1/2)."
    ],
    part: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 13,
    startDate: "2025-07-28",
    city: "Praga",
    activities: [
      "Día completo en Praga: Castillo, Puente de Carlos, Malá Strana.",
      "Dormir: Praga (2/2)."
    ],
    part: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 14,
    startDate: "2025-07-29",
    city: "Budapest",
    activities: [
      "Tren Praga → Budapest (10:44 AM–18:49 PM).",
      "Noche: Bastión de los Pescadores.",
      "Dormir: Budapest (1/2)."
    ],
    part: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 15,
    startDate: "2025-07-30",
    city: "Budapest",
    activities: [
      "Día completo en Budapest: Parlamento, baños Széchenyi, ruin bars.",
      "Dormir: Budapest (2/2)."
    ],
    part: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 16,
    startDate: "2025-07-31",
    city: "Budapest",
    activities: [
      "Mañana libre según hora de tu vuelo.",
      "Traslado al aeropuerto y vuelo de regreso."
    ],
    part: "Países Bajos, Alemania y Europa del Este"
  }
];

export default async function handler(req, res) {
  try {
    // Imprime las variables de entorno
    console.log("URL:", process.env.UPSTASH_REDIS_REST_URL);
    console.log("TOKEN:", process.env.UPSTASH_REDIS_REST_TOKEN);

    const data = await redis.get("itinerario_global");
    let itinerary = [];
    if (data) {
      try {
        itinerary = JSON.parse(typeof data === "string" ? data : JSON.stringify(data));
      } catch (e) {
        return res.status(500).json({ error: "Datos corruptos en Redis", itinerary: [] });
      }
    } else {
      itinerary = ITINERARIO_PREDEFINIDO;
    }
    res.status(200).json({ itinerary });
  } catch (error) {
    console.error("ERROR EN HANDLER:", error);
    res.status(500).json({ error: "No se pudo leer el itinerario", itinerary: [] });
  }
}
