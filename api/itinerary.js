// api/itinerary.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const itinerary = await kv.get('itineraryData');
    res.status(200).json({ itinerary: itinerary || [] });
  } else if (req.method === 'POST') {
    const { itinerary } = req.body;
    await kv.set('itineraryData', itinerary);
    res.status(200).json({ ok: true });
  } else {
    res.status(405).end();
  }
}
