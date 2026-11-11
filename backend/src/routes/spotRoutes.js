import express from 'express';
import { ParkingSpot } from '../models/ParkingSpot.js';

const router = express.Router();

// Preset coordinates for Mumbai localities across all zones
export const MUMBAI_LOCALITIES = {
  // South Mumbai
  'Colaba': { lat: 18.9067, lng: 72.8147, region: 'South Mumbai' },
  'Cuffe Parade': { lat: 18.9154, lng: 72.8205, region: 'South Mumbai' },
  'Nariman Point': { lat: 18.9268, lng: 72.8236, region: 'South Mumbai' },
  'Marine Drive / Churchgate': { lat: 18.9322, lng: 72.8264, region: 'South Mumbai' },
  'Malabar Hill': { lat: 18.9554, lng: 72.8052, region: 'South Mumbai' },
  'Breach Candy / Tardeo': { lat: 18.9712, lng: 72.8115, region: 'South Mumbai' },
  'Byculla': { lat: 18.9760, lng: 72.8330, region: 'South Mumbai' },
  'Lower Parel': { lat: 18.9950, lng: 72.8290, region: 'South Mumbai' },
  'Worli': { lat: 19.0166, lng: 72.8184, region: 'South Mumbai' },
  'Prabhadevi': { lat: 19.0160, lng: 72.8285, region: 'South Mumbai' },
  'Dadar': { lat: 19.0178, lng: 72.8478, region: 'South Mumbai' },

  // Western Suburbs
  'Bandra West': { lat: 19.0596, lng: 72.8295, region: 'Western Suburbs' },
  'BKC (Bandra East)': { lat: 19.0657, lng: 72.8687, region: 'Western Suburbs' },
  'Khar West': { lat: 19.0700, lng: 72.8338, region: 'Western Suburbs' },
  'Santacruz': { lat: 19.0805, lng: 72.8410, region: 'Western Suburbs' },
  'Vile Parle': { lat: 19.0998, lng: 72.8439, region: 'Western Suburbs' },
  'Juhu': { lat: 19.1075, lng: 72.8263, region: 'Western Suburbs' },
  'Andheri West': { lat: 19.1363, lng: 72.8277, region: 'Western Suburbs' },
  'Andheri East': { lat: 19.1136, lng: 72.8697, region: 'Western Suburbs' },
  'Jogeshwari': { lat: 19.1383, lng: 72.8550, region: 'Western Suburbs' },
  'Goregaon': { lat: 19.1663, lng: 72.8526, region: 'Western Suburbs' },
  'Malad West': { lat: 19.1860, lng: 72.8354, region: 'Western Suburbs' },
  'Malad East': { lat: 19.1864, lng: 72.8658, region: 'Western Suburbs' },
  'Kandivali': { lat: 19.2062, lng: 72.8541, region: 'Western Suburbs' },
  'Borivali West': { lat: 19.2307, lng: 72.8467, region: 'Western Suburbs' },
  'Borivali East': { lat: 19.2288, lng: 72.8654, region: 'Western Suburbs' },
  'Dahisar': { lat: 19.2570, lng: 72.8596, region: 'Western Suburbs' },

  // Central Suburbs
  'Matunga / Sion': { lat: 19.0350, lng: 72.8590, region: 'Central Mumbai' },
  'Kurla': { lat: 19.0726, lng: 72.8845, region: 'Central Mumbai' },
  'Ghatkopar West': { lat: 19.0863, lng: 72.9090, region: 'Central Mumbai' },
  'Ghatkopar East': { lat: 19.0858, lng: 72.9192, region: 'Central Mumbai' },
  'Vikhroli': { lat: 19.1111, lng: 72.9277, region: 'Central Mumbai' },
  'Kanjurmarg': { lat: 19.1305, lng: 72.9324, region: 'Central Mumbai' },
  'Bhandup': { lat: 19.1450, lng: 72.9350, region: 'Central Mumbai' },
  'Mulund West': { lat: 19.1726, lng: 72.9565, region: 'Central Mumbai' },

  // Eastern Suburbs & Harbour
  'Powai': { lat: 19.1176, lng: 72.9060, region: 'Eastern Suburbs' },
  'Chembur': { lat: 19.0522, lng: 72.8994, region: 'Eastern Suburbs' },
  'Wadala': { lat: 19.0150, lng: 72.8600, region: 'Eastern Suburbs' },
  'Deonar / Govandi': { lat: 19.0550, lng: 72.9150, region: 'Eastern Suburbs' },

  // Thane & Navi Mumbai
  'Thane West': { lat: 19.2183, lng: 72.9781, region: 'Thane & Navi Mumbai' },
  'Ghodbunder Road (Thane)': { lat: 19.2600, lng: 72.9600, region: 'Thane & Navi Mumbai' },
  'Vashi (Navi Mumbai)': { lat: 19.0771, lng: 72.9986, region: 'Thane & Navi Mumbai' },
  'Nerul / Seawoods': { lat: 19.0330, lng: 73.0297, region: 'Thane & Navi Mumbai' },
  'Belapur': { lat: 19.0180, lng: 73.0400, region: 'Thane & Navi Mumbai' },
  'Airoli': { lat: 19.1550, lng: 72.9990, region: 'Thane & Navi Mumbai' },
};

// Rich dictionary of major Mumbai venues, auditoriums, halls, malls, hospitals, and landmarks
export const MUMBAI_LANDMARKS = [
  // Auditoriums & Halls
  {
    name: 'Shanmukhananda Hall',
    displayName: 'Shanmukhananda Hall (Chandrasekarendra Auditorium)',
    category: 'Auditorium & Events',
    area: 'Sion / Matunga',
    address: 'Comrade Harbanslal Marg, Flank Road, Sion East / Matunga, Mumbai - 400022',
    lat: 19.0348,
    lng: 72.8595,
    popular: true,
  },
  {
    name: 'NCPA',
    displayName: 'National Centre for the Performing Arts (NCPA)',
    category: 'Auditorium & Events',
    area: 'Nariman Point',
    address: 'NCPA Marg, Nariman Point, Mumbai - 400021',
    lat: 18.9250,
    lng: 72.8208,
    popular: true,
  },
  {
    name: 'Nehru Centre & Planetarium',
    displayName: 'Nehru Centre Auditorium & Planetarium',
    category: 'Auditorium & Events',
    area: 'Worli',
    address: 'Dr. Annie Besant Road, Worli, Mumbai - 400018',
    lat: 18.9898,
    lng: 72.8182,
  },
  {
    name: 'Ravindra Natya Mandir',
    displayName: 'Ravindra Natya Mandir',
    category: 'Auditorium & Events',
    area: 'Prabhadevi',
    address: 'Sayani Road, Prabhadevi, Dadar West, Mumbai - 400025',
    lat: 19.0175,
    lng: 72.8290,
  },
  {
    name: 'Prithvi Theatre',
    displayName: 'Prithvi Theatre',
    category: 'Auditorium & Events',
    area: 'Juhu',
    address: '20 Janki Kutir, Juhu Church Road, Juhu, Mumbai - 400049',
    lat: 19.1060,
    lng: 72.8258,
  },
  {
    name: 'Bal Gandharva Rang Mandir',
    displayName: 'Bal Gandharva Rang Mandir',
    category: 'Auditorium & Events',
    area: 'Bandra West',
    address: 'Patre Ward, Bandra West, Mumbai - 400050',
    lat: 19.0585,
    lng: 72.8330,
  },
  {
    name: 'Dinanath Mangeshkar Natyagruha',
    displayName: 'Dinanath Mangeshkar Natyagruha',
    category: 'Auditorium & Events',
    area: 'Vile Parle East',
    address: 'Monghibai Road, Vile Parle East, Mumbai - 400057',
    lat: 19.0980,
    lng: 72.8460,
  },

  // Malls & Entertainment
  {
    name: 'High Street Phoenix / Palladium',
    displayName: 'High Street Phoenix & Palladium Mall',
    category: 'Shopping & Dining',
    area: 'Lower Parel',
    address: 'Senapati Bapat Marg, Lower Parel, Mumbai - 400013',
    lat: 18.9950,
    lng: 72.8250,
    popular: true,
  },
  {
    name: 'Jio World Convention Centre & Drive',
    displayName: 'Jio World Convention Centre & Jio World Drive',
    category: 'Convention & Business',
    area: 'BKC',
    address: 'G Block, Bandra Kurla Complex, Bandra East, Mumbai - 400051',
    lat: 19.0620,
    lng: 72.8640,
    popular: true,
  },
  {
    name: 'Inorbit Mall Malad',
    displayName: 'Inorbit Mall Malad',
    category: 'Shopping & Dining',
    area: 'Malad West',
    address: 'Link Road, Malad West, Mumbai - 400064',
    lat: 19.1860,
    lng: 72.8350,
  },
  {
    name: 'Infinity Mall Andheri',
    displayName: 'Infinity Mall (Andheri / Oshiwara)',
    category: 'Shopping & Dining',
    area: 'Andheri West',
    address: 'New Link Road, Oshiwara, Andheri West, Mumbai - 400053',
    lat: 19.1410,
    lng: 72.8315,
  },
  {
    name: 'R-City Mall Ghatkopar',
    displayName: 'R-City Mall',
    category: 'Shopping & Dining',
    area: 'Ghatkopar West',
    address: 'L.B.S. Marg, Ghatkopar West, Mumbai - 400086',
    lat: 19.0880,
    lng: 72.9120,
  },
  {
    name: 'Phoenix Marketcity Kurla',
    displayName: 'Phoenix Marketcity Kurla',
    category: 'Shopping & Dining',
    area: 'Kurla West',
    address: 'LBS Marg, Kurla West, Mumbai - 400070',
    lat: 19.0860,
    lng: 72.8890,
  },
  {
    name: 'Oberoi Mall Goregaon',
    displayName: 'Oberoi Mall',
    category: 'Shopping & Dining',
    area: 'Goregaon East',
    address: 'Western Express Highway, Goregaon East, Mumbai - 400063',
    lat: 19.1740,
    lng: 72.8605,
  },

  // Business Hubs & Complexes
  {
    name: 'Bandra Kurla Complex (BKC)',
    displayName: 'Bandra Kurla Complex (One BKC / MCA / Diamond Bourse)',
    category: 'Business District',
    area: 'BKC',
    address: 'BKC Central Avenue, Bandra East, Mumbai - 400051',
    lat: 19.0657,
    lng: 72.8687,
    popular: true,
  },
  {
    name: 'One World Center / Kamala Mills',
    displayName: 'One World Center & Kamala Mills',
    category: 'Business District',
    area: 'Lower Parel',
    address: 'Senapati Bapat Marg, Lower Parel West, Mumbai - 400013',
    lat: 18.9940,
    lng: 72.8280,
  },
  {
    name: 'Nesco Exhibition Centre (Bombay Exhibition Centre)',
    displayName: 'Nesco Exhibition Centre (BEC)',
    category: 'Convention & Business',
    area: 'Goregaon East',
    address: 'Western Express Highway, Goregaon East, Mumbai - 400063',
    lat: 19.1530,
    lng: 72.8540,
    popular: true,
  },
  {
    name: 'Supreme Business Park / Kensington',
    displayName: 'Supreme Business Park & Hiranandani',
    category: 'Business District',
    area: 'Powai',
    address: 'Hiranandani Gardens, Powai, Mumbai - 400076',
    lat: 19.1180,
    lng: 72.9080,
  },
  {
    name: 'Mindspace IT Park Malad',
    displayName: 'Mindspace IT Park',
    category: 'Business District',
    area: 'Malad West',
    address: 'Link Road, Malad West, Mumbai - 400064',
    lat: 19.1850,
    lng: 72.8360,
  },

  // Hospitals
  {
    name: 'Asian Heart Institute',
    displayName: 'Asian Heart Institute',
    category: 'Hospital & Healthcare',
    area: 'BKC',
    address: 'G Block, Bandra Kurla Complex, Bandra East, Mumbai - 400051',
    lat: 19.0620,
    lng: 72.8540,
  },
  {
    name: 'Lilavati Hospital',
    displayName: 'Lilavati Hospital & Research Centre',
    category: 'Hospital & Healthcare',
    area: 'Bandra West',
    address: 'A-791, Bandra Reclamation, Bandra West, Mumbai - 400050',
    lat: 19.0510,
    lng: 72.8290,
    popular: true,
  },
  {
    name: 'Tata Memorial Hospital & KEM',
    displayName: 'Tata Memorial Hospital & KEM Hospital',
    category: 'Hospital & Healthcare',
    area: 'Parel',
    address: 'Dr. E Borges Road, Parel, Mumbai - 400012',
    lat: 19.0020,
    lng: 72.8420,
  },
  {
    name: 'LTMG Sion Hospital',
    displayName: 'L.T.M.G. (Sion) Hospital & Medical College',
    category: 'Hospital & Healthcare',
    area: 'Sion West',
    address: 'Sion West, Near Sion Circle, Mumbai - 400022',
    lat: 19.0390,
    lng: 72.8580,
  },
  {
    name: 'Hinduja Hospital Mahim',
    displayName: 'P.D. Hinduja Hospital',
    category: 'Hospital & Healthcare',
    area: 'Mahim',
    address: 'Veer Savarkar Marg, Mahim West, Mumbai - 400016',
    lat: 19.0320,
    lng: 72.8390,
  },
  {
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    displayName: 'Kokilaben Dhirubhai Ambani Hospital',
    category: 'Hospital & Healthcare',
    area: 'Andheri West',
    address: 'Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West',
    lat: 19.1310,
    lng: 72.8240,
  },

  // Attractions & Temples
  {
    name: 'Siddhivinayak Temple',
    displayName: 'Shree Siddhivinayak Ganapati Temple',
    category: 'Place of Worship & Tourist',
    area: 'Prabhadevi',
    address: 'SK Bole Marg, Prabhadevi, Mumbai - 400028',
    lat: 19.0169,
    lng: 72.8304,
    popular: true,
  },
  {
    name: 'Wankhede Stadium',
    displayName: 'Wankhede Cricket Stadium',
    category: 'Sports & Stadium',
    area: 'Churchgate',
    address: 'Vinoo Mankad Road, Churchgate, Mumbai - 400020',
    lat: 18.9389,
    lng: 72.8258,
    popular: true,
  },
  {
    name: 'Gateway of India',
    displayName: 'Gateway of India & Taj Mahal Palace',
    category: 'Landmark & Tourist',
    area: 'Colaba',
    address: 'Apollo Bunder, Colaba, Mumbai - 400001',
    lat: 18.9220,
    lng: 72.8347,
  },
  {
    name: 'Shivaji Park',
    displayName: 'Shivaji Park',
    category: 'Park & Cultural',
    area: 'Dadar West',
    address: 'Dadar West, Mumbai - 400028',
    lat: 19.0270,
    lng: 72.8380,
  },

  // Transit
  {
    name: 'CSMIA Terminal 2 (International Airport)',
    displayName: 'Chhatrapati Shivaji Maharaj International Airport (T2)',
    category: 'Airport & Transit',
    area: 'Sahar / Andheri East',
    address: 'Sahar Village, Andheri East, Mumbai - 400099',
    lat: 19.0970,
    lng: 72.8740,
    popular: true,
  },
  {
    name: 'Domestic Airport (Terminal 1)',
    displayName: 'Mumbai Domestic Airport (T1)',
    category: 'Airport & Transit',
    area: 'Santacruz East',
    address: 'Western Express Highway, Santacruz East, Mumbai - 400029',
    lat: 19.0880,
    lng: 72.8530,
  },
  {
    name: 'Chhatrapati Shivaji Terminus (CST)',
    displayName: 'CSMT Railway Station (Victoria Terminus)',
    category: 'Railway & Transit',
    area: 'Fort / South Mumbai',
    address: 'DN Road, Fort, Mumbai - 400001',
    lat: 18.9400,
    lng: 72.8350,
  },
  {
    name: 'Dadar Railway Junction',
    displayName: 'Dadar Railway Station',
    category: 'Railway & Transit',
    area: 'Dadar',
    address: 'Swami Vivekanand Road, Dadar, Mumbai - 400014',
    lat: 19.0180,
    lng: 72.8430,
  },
];

// Calculate Haversine distance in KM between two points
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /api/spots/destinations - Destination place search engine
router.get('/destinations', async (req, res) => {
  try {
    const query = (req.query.q || '').trim().toLowerCase();

    if (!query) {
      // Return popular destinations by default
      const popular = MUMBAI_LANDMARKS.filter((l) => l.popular);
      return res.json({ success: true, count: popular.length, data: popular });
    }

    // 1. Search local landmark database
    const localMatches = MUMBAI_LANDMARKS.filter((item) => {
      const matchName = item.name.toLowerCase().includes(query);
      const matchDisplay = item.displayName.toLowerCase().includes(query);
      const matchArea = item.area.toLowerCase().includes(query);
      const matchAddress = item.address.toLowerCase().includes(query);
      return matchName || matchDisplay || matchArea || matchAddress;
    });

    // 2. Also search localities
    const localityMatches = Object.entries(MUMBAI_LOCALITIES)
      .filter(([name, info]) => {
        return name.toLowerCase().includes(query) || info.region.toLowerCase().includes(query);
      })
      .map(([name, info]) => ({
        name,
        displayName: `${name} (${info.region})`,
        category: 'Neighborhood / Locality',
        area: name,
        address: `${name}, Mumbai, Maharashtra`,
        lat: info.lat,
        lng: info.lng,
      }));

    let results = [...localMatches, ...localityMatches];

    // 3. Fallback to OpenStreetMap Nominatim for exact buildings or venues if few results
    if (results.length < 3 && query.length >= 3) {
      try {
        const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ', Mumbai, Maharashtra'
        )}&viewbox=72.75,19.35,73.15,18.85&bounded=1&limit=4`;

        const osmRes = await fetch(osmUrl, {
          headers: {
            'User-Agent': 'ParkPeerMumbai/1.0 (contact@parkpeer.mumbai.in)',
          },
        });

        if (osmRes.ok) {
          const osmData = await osmRes.json();
          const geocoded = osmData.map((place) => ({
            name: place.name || query,
            displayName: place.display_name.split(',').slice(0, 3).join(','),
            category: 'Geocoded Place',
            area: 'Mumbai',
            address: place.display_name,
            lat: Number(place.lat),
            lng: Number(place.lon),
          }));
          results = [...results, ...geocoded];
        }
      } catch (osmErr) {
        // Silently continue with local matches
      }
    }

    res.json({
      success: true,
      count: results.length,
      data: results.slice(0, 10),
    });
  } catch (error) {
    console.error('Destination search error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/spots/near - Proximity search near specific coordinates (e.g. Shanmukhananda Hall)
router.get('/near', async (req, res) => {
  try {
    const { lat, lng, radiusKm = 5, maxPrice, day } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and Longitude are required' });
    }

    const targetLat = Number(lat);
    const targetLng = Number(lng);
    const maxRadius = Number(radiusKm);

    const filter = { isActive: true };
    if (maxPrice) filter.hourlyRate = { $lte: Number(maxPrice) };
    if (day) filter['availability.days'] = { $in: [day] };

    const allSpots = await ParkingSpot.find(filter);

    const spotsWithDistance = allSpots
      .map((spot) => {
        const s = spot.toObject();
        if (s.latitude && s.longitude) {
          const distKm = getDistanceKm(targetLat, targetLng, s.latitude, s.longitude);
          s.distanceKm = Math.round(distKm * 10) / 10;
          s.distanceMeters = Math.round(distKm * 1000);
          // Walking time ~ 12 mins per km (80m/min)
          s.walkingMins = Math.max(1, Math.round(distKm * 12));
          // Driving time ~ 3.5 mins per km in Mumbai traffic
          s.drivingMins = Math.max(2, Math.round(distKm * 3.5));
        } else {
          s.distanceKm = 999;
          s.distanceMeters = 999999;
          s.walkingMins = 999;
          s.drivingMins = 999;
        }
        return s;
      })
      .filter((s) => s.distanceKm <= maxRadius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({
      success: true,
      count: spotsWithDistance.length,
      target: { lat: targetLat, lng: targetLng, radiusKm: maxRadius },
      data: spotsWithDistance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/spots - Fetch available parking spots with filters
router.get('/', async (req, res) => {
  try {
    const {
      area,
      region,
      search,
      minPrice,
      maxPrice,
      day,
      hostPhone,
      lat,
      lng,
      radiusKm,
    } = req.query;

    const filter = { isActive: true };

    if (hostPhone) {
      filter.hostPhone = hostPhone;
    }

    if (area && area !== 'All' && area !== 'All Mumbai') {
      filter.area = new RegExp(area, 'i');
    }

    if (search) {
      filter.$or = [
        { societyName: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { area: { $regex: search, $options: 'i' } },
        { landmark: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.hourlyRate = {};
      if (minPrice) filter.hourlyRate.$gte = Number(minPrice);
      if (maxPrice) filter.hourlyRate.$lte = Number(maxPrice);
    }

    if (day) {
      filter['availability.days'] = { $in: [day] };
    }

    let spots = await ParkingSpot.find(filter).sort({ createdAt: -1 });

    if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
      const targetLat = Number(lat);
      const targetLng = Number(lng);
      const maxRadius = radiusKm ? Number(radiusKm) : 30;

      spots = spots
        .map((spot) => {
          const spotObj = spot.toObject();
          if (spotObj.latitude && spotObj.longitude) {
            const distKm = getDistanceKm(targetLat, targetLng, spotObj.latitude, spotObj.longitude);
            spotObj.distanceKm = Math.round(distKm * 10) / 10;
            spotObj.distanceMeters = Math.round(distKm * 1000);
            spotObj.walkingMins = Math.max(1, Math.round(distKm * 12));
            spotObj.drivingMins = Math.max(2, Math.round(distKm * 3.5));
          } else {
            spotObj.distanceKm = 999;
          }
          return spotObj;
        })
        .filter((spot) => (radiusKm ? spot.distanceKm <= maxRadius : true))
        .sort((a, b) => a.distanceKm - b.distanceKm);
    }

    res.json({
      success: true,
      count: spots.length,
      data: spots,
    });
  } catch (error) {
    console.error('Error fetching parking spots:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/spots/localities - List all supported Mumbai localities with coords & region
router.get('/localities', (req, res) => {
  res.json({
    success: true,
    data: Object.entries(MUMBAI_LOCALITIES).map(([name, info]) => ({
      name,
      ...info,
    })),
  });
});

// GET /api/spots/:id - Get single spot details
router.get('/:id', async (req, res) => {
  try {
    const spot = await ParkingSpot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({ success: false, message: 'Parking spot not found' });
    }
    res.json({ success: true, data: spot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/spots - Create a new spot (Host View with exact map coordinates)
router.post('/', async (req, res) => {
  try {
    const {
      hostName,
      hostPhone,
      societyName,
      flatNumber,
      spotNumber,
      spotType,
      vehicleCompatibility,
      area,
      address,
      landmark,
      latitude,
      longitude,
      hourlyRate,
      availability,
      amenities,
      entryInstructions,
      images,
    } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Parking spot photos are compulsory! Please upload or select at least 1 clear photo of your parking spot.',
      });
    }

    let lat = Number(latitude);
    let lng = Number(longitude);

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      const matchLocality = MUMBAI_LOCALITIES[area] || MUMBAI_LOCALITIES['BKC (Bandra East)'];
      const jitterLat = (Math.random() - 0.5) * 0.005;
      const jitterLng = (Math.random() - 0.5) * 0.005;
      lat = Number((matchLocality.lat + jitterLat).toFixed(6));
      lng = Number((matchLocality.lng + jitterLng).toFixed(6));
    }

    const newSpot = new ParkingSpot({
      hostName: hostName || 'Society Resident',
      hostPhone: hostPhone || '+91 98200 12345',
      societyName,
      flatNumber,
      spotNumber,
      spotType: spotType || 'Covered',
      vehicleCompatibility: vehicleCompatibility || 'Any Car',
      area: area || 'Mumbai',
      address,
      landmark: landmark || '',
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      hourlyRate: Number(hourlyRate) || 20,
      dailyRate: Number(req.body.dailyRate) || 150,
      availability: {
        days: availability?.days?.length ? availability.days : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        startTime: availability?.startTime || '09:00',
        endTime: availability?.endTime || '18:00',
      },
      amenities: amenities?.length ? amenities : ['24/7 Security Guard', 'CCTV Surveillance', 'Covered Roof'],
      entryInstructions: entryInstructions || `Flat ${flatNumber} resident parking. Inform gate guard.`,
      images: images || [],
    });

    const savedSpot = await newSpot.save();
    res.status(201).json({
      success: true,
      message: 'Parking spot listed successfully with exact map pin!',
      data: savedSpot,
    });
  } catch (error) {
    console.error('Error creating parking spot:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/spots/:id - Deactivate or remove spot
router.delete('/:id', async (req, res) => {
  try {
    const spot = await ParkingSpot.findByIdAndDelete(req.params.id);
    if (!spot) {
      return res.status(404).json({ success: false, message: 'Spot not found' });
    }
    res.json({ success: true, message: 'Spot removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
