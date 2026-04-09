const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

async function reverseGeocode(latitude, longitude) {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(latitude),
    lon: String(longitude),
    zoom: '18',
    addressdetails: '1',
  });

  const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Unable to look up your address right now.');
  }

  const data = await response.json();
  return data.display_name || '';
}

export async function fetchCurrentLocationAddress() {
  const position = await getCurrentPosition();
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  try {
    const address = await reverseGeocode(latitude, longitude);

    return {
      address: address || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
      lat: latitude,
      lng: longitude,
    };
  } catch {
    return {
      address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
      lat: latitude,
      lng: longitude,
    };
  }
}
