const MAX_RESULTS = 6;

function normalizeLocation(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9,\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCity(value = '') {
  return normalizeLocation(value).split(',')[0]?.trim() || '';
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const values = [lat1, lng1, lat2, lng2];
  if (values.some((value) => typeof value !== 'number' || Number.isNaN(value))) {
    return null;
  }

  const earthRadiusKm = 6371;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function getLocationSignals(user, provider) {
  const userLocation = normalizeLocation(user?.location);
  const providerLocation = normalizeLocation(provider?.location);
  const userCity = extractCity(user?.location);
  const providerCity = extractCity(provider?.location);
  const distanceKm = getDistanceKm(user?.lat, user?.lng, provider?.lat, provider?.lng);

  let score = 0;
  let label = '';

  if (userLocation && providerLocation && userLocation === providerLocation) {
    score += 16;
    label = provider?.location || 'Same location';
  } else if (userCity && providerCity && userCity === providerCity) {
    score += 12;
    label = provider?.location || 'Same city';
  }

  if (distanceKm !== null) {
    if (distanceKm <= 5) {
      score += 10;
      label = label || 'Near you';
    } else if (distanceKm <= 15) {
      score += 7;
      label = label || 'Within your area';
    } else if (distanceKm <= 35) {
      score += 4;
      label = label || 'Within your city';
    } else if (distanceKm <= 60) {
      score += 2;
      label = label || 'Regional match';
    }
  }

  return {
    distanceKm,
    label,
    score,
    matched: score > 0,
  };
}

function compareRecommendations(a, b) {
  return (
    b.recommendationScore - a.recommendationScore ||
    (b.avgRating || 0) - (a.avgRating || 0) ||
    (b.totalRatings || 0) - (a.totalRatings || 0)
  );
}

function buildRecommendationMetadata({ basis, userLocation, items, bookedCategories }) {
  if (basis === 'location') {
    return {
      basis,
      basisLabel: 'Based on your location',
      basisDescription: userLocation
        ? `Providers serving ${userLocation} are being shown first.`
        : 'Nearby providers are being shown first.',
      userLocation: userLocation || '',
      matchedCount: items.length,
      bookedCategories,
    };
  }

  if (basis === 'activity') {
    return {
      basis,
      basisLabel: 'Based on your recent activity',
      basisDescription: 'We could not find enough nearby matches, so we prioritized categories you booked before.',
      userLocation: userLocation || '',
      matchedCount: items.length,
      bookedCategories,
    };
  }

  return {
    basis,
    basisLabel: 'Popular on Fixify',
    basisDescription: 'These top-rated services are shown while we wait for more nearby recommendation signals.',
    userLocation: userLocation || '',
    matchedCount: items.length,
    bookedCategories,
  };
}

function stripInternalFields(service) {
  const {
    recommendationScore,
    recommendationMeta,
    ...serviceData
  } = service;

  return serviceData;
}

function buildLocationRecommendations({ services, user, bookedCategories = [], excludeServiceIds = [] }) {
  const excluded = new Set(excludeServiceIds.map((id) => String(id)));
  const enrichedServices = services
    .filter((service) => !excluded.has(String(service._id)))
    .map((service) => {
      const provider = service.providerId || {};
      const locationMeta = getLocationSignals(user, provider);
      const activityBonus = bookedCategories.includes(service.category) ? 3 : 0;
      const ratingBonus = (service.avgRating || 0) * 1.2 + Math.min((service.totalRatings || 0) / 12, 4);

      return {
        ...service,
        recommendationMeta: locationMeta,
        recommendationScore: locationMeta.score + activityBonus + ratingBonus,
      };
    })
    .sort(compareRecommendations);

  const locationMatches = enrichedServices.filter((service) => service.recommendationMeta.matched);

  let basis = 'popular';
  let selected = [];

  if (locationMatches.length > 0) {
    basis = 'location';
    selected = locationMatches.slice(0, MAX_RESULTS);
  } else if (bookedCategories.length > 0) {
    basis = 'activity';
    selected = enrichedServices
      .filter((service) => bookedCategories.includes(service.category))
      .slice(0, MAX_RESULTS);
  }

  if (selected.length < MAX_RESULTS) {
    const existingIds = new Set(selected.map((service) => String(service._id)));
    const fallback = enrichedServices
      .filter((service) => !existingIds.has(String(service._id)))
      .slice(0, MAX_RESULTS - selected.length);

    selected = [...selected, ...fallback];
  }

  return {
    ...buildRecommendationMetadata({
      basis,
      userLocation: user?.location,
      items: selected,
      bookedCategories,
    }),
    items: selected.map(stripInternalFields),
  };
}

module.exports = {
  buildLocationRecommendations,
};
