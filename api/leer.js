import { redis } from '../lib/redis.js'

const ITINERARIO_PREDEFINIDO = [
  {
    day: 1,
    fecha: "Mié, 16 jul",
    ciudad: "Milán",
    actividades: [
      "Llegada 12:25 PM a Milán.",
      "Tarde: Duomo, terrazas y Galería Vittorio Emanuele II.",
      "Noche: Navigli (canales).",
      "Dormir: Milán (1/3)."
    ],
    parte: "Italia y Alsacia"
  },
  {
    day: 2,
    fecha: "Jue, 17 jul",
    ciudad: "Estrasburgo",
    actividades: [
      "Mañana: Tren Milán → Estrasburgo (≈ 8 h, vía Suiza).",
      "Tarde-noche: Petite France; cena alsaciana.",
      "Dormir: Estrasburgo (2/3)."
    ],
    parte: "Italia y Alsacia"
  },
  {
    day: 3,
    fecha: "Vie, 18 jul",
    ciudad: "Estrasburgo",
    actividades: [
      "Día completo en Estrasburgo: Catedral, paseo en barco, Parlamento Europeo.",
      "Dormir: Estrasburgo (3/3)."
    ],
    parte: "Italia y Alsacia"
  },
  {
    day: 4,
    fecha: "Sáb, 19 jul",
    ciudad: "Colmar/Estrasburgo",
    actividades: [
      "Excursión a Colmar (30 min en tren).",
      "Regreso y noche en Estrasburgo."
    ],
    parte: "Italia y Alsacia"
  },
  {
    day: 5,
    fecha: "Dom, 20 jul",
    ciudad: "Bruselas",
    actividades: [
      "Tren Estrasburgo → Bruselas (≈ 3½ h).",
      "Tarde: Grand-Place, Manneken Pis, moules-frites.",
      "Dormir: Bruselas (1/3)."
    ],
    parte: "Bélgica y reunión"
  },
  {
    day: 6,
    fecha: "Lun, 21 jul",
    ciudad: "Bruselas/Brujas/Gante",
    actividades: [
      "Mañana: recogida en Zaventem (10:00 h).",
      "Mediodía: tren a Brujas (1 h) – Markt, Grote Kerk.",
      "Tarde: Gante (30 min) – Graslei, Castillo.",
      "Noche: regreso a Bruselas.",
      "Dormir: Bruselas (2/3)."
    ],
    parte: "Bélgica y reunión"
  },
  {
    day: 7,
    fecha: "Mar, 22 jul",
    ciudad: "Ámsterdam",
    actividades: [
      "Thalys Bruselas → Ámsterdam (≈ 2 h).",
      "Tarde-noche: canales, Jordaan, De Pijp.",
      "Dormir: Ámsterdam (1/2)."
    ],
    parte: "Bélgica y reunión"
  },
  {
    day: 8,
    fecha: "Mié, 23 jul",
    ciudad: "Ámsterdam",
    actividades: [
      "Día completo en Ámsterdam: Van Gogh/Rijksmuseum, Vondelpark, paseo en barco.",
      "Dormir: Ámsterdam (2/2)."
    ],
    parte: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 9,
    fecha: "Jue, 24 jul",
    ciudad: "Berlín",
    actividades: [
      "Tren diurno Ámsterdam → Berlín (cambio en Hannover, salida 08:00, llegada 16:30).",
      "Noche: Alexanderplatz y Nikolaiviertel.",
      "Dormir: Berlín (1/3)."
    ],
    parte: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 10,
    fecha: "Vie, 25 jul",
    ciudad: "Berlín",
    actividades: [
      "Día completo en Berlín: Brandeburgo, Reichstag, Memorial del Holocausto.",
      "Dormir: Berlín (2/3)."
    ],
    parte: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 11,
    fecha: "Sáb, 26 jul",
    ciudad: "Berlín",
    actividades: [
      "Día completo en Berlín: East Side Gallery, Checkpoint Charlie, Isla de los Museos.",
      "Dormir: Berlín (3/3)."
    ],
    parte: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 12,
    fecha: "Dom, 27 jul",
    ciudad: "Praga",
    actividades: [
      "Tren Berlín → Praga (11:16 AM–15:24 PM).",
      "Tarde-noche: Ciudad Vieja y Reloj Astronómico.",
      "Dormir: Praga (1/2)."
    ],
    parte: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 13,
    fecha: "Lun, 28 jul",
    ciudad: "Praga",
    actividades: [
      "Día completo en Praga: Castillo, Puente de Carlos, Malá Strana.",
      "Dormir: Praga (2/2)."
    ],
    parte: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 14,
    fecha: "Mar, 29 jul",
    ciudad: "Budapest",
    actividades: [
      "Tren Praga → Budapest (10:44 AM–18:49 PM).",
      "Noche: Bastión de los Pescadores.",
      "Dormir: Budapest (1/2)."
    ],
    parte: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 15,
    fecha: "Mié, 30 jul",
    ciudad: "Budapest",
    actividades: [
      "Día completo en Budapest: Parlamento, baños Széchenyi, ruin bars.",
      "Dormir: Budapest (2/2)."
    ],
    parte: "Países Bajos, Alemania y Europa del Este"
  },
  {
    day: 16,
    fecha: "Jue, 31 jul",
    ciudad: "Budapest",
    actividades: [
      "Mañana libre según hora de tu vuelo.",
      "Traslado al aeropuerto y vuelo de regreso."
    ],
    parte: "Países Bajos, Alemania y Europa del Este"
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
