export interface GpsResult {
  latitude: string;
  longitude: string;
  success: boolean;
  message: string;
}

export function parseGmapsUrlOrCoords(input: string): GpsResult {
  const cleanInput = input.trim();
  if (!cleanInput) {
    return { latitude: "", longitude: "", success: false, message: "Empty input" };
  }

  // 1. Try to extract from standard google maps URL format:
  // e.g., .../@12.9730556,77.5958333,17z...
  const atMatch = cleanInput.match(/@([0-9.-]+),([0-9.-]+)/);
  if (atMatch) {
    return {
      latitude: parseFloat(atMatch[1]).toFixed(6),
      longitude: parseFloat(atMatch[2]).toFixed(6),
      success: true,
      message: "Successfully extracted coordinates from map URL location.",
    };
  }

  // Decode URL encoding (e.g. %2C for commas, %20 for spaces, etc.)
  let decodedInput = cleanInput;
  try {
    decodedInput = decodeURIComponent(cleanInput);
  } catch (e) {
    // ignore
  }

  // e.g. q=12.9730556,77.5958333
  const qMatch = decodedInput.match(/[?&]q=([0-9.-]+),([0-9.-]+)/);
  if (qMatch) {
    return {
      latitude: parseFloat(qMatch[1]).toFixed(6),
      longitude: parseFloat(qMatch[2]).toFixed(6),
      success: true,
      message: "Successfully extracted coordinates from query parameter.",
    };
  }

  // e.g. ll=12.9730556,77.5958333
  const llMatch = decodedInput.match(/[?&]ll=([0-9.-]+),([0-9.-]+)/);
  if (llMatch) {
    return {
      latitude: parseFloat(llMatch[1]).toFixed(6),
      longitude: parseFloat(llMatch[2]).toFixed(6),
      success: true,
      message: "Successfully extracted coordinates from location parameter.",
    };
  }

  // 2. Try to parse DMS (Degrees Minutes Seconds)
  // Format: 12°58'23.0"N 77°35'45.0"E
  // Regex matches: 12°58'23.0"N or 12d58'23"N etc.
  const dmsRegex = /(\d+)[°d\s]+(\d+)[‘'\s]+([\d.]+)[”"\s]+([NnSs])\s*,?\s*(\d+)[°d\s]+(\d+)[‘'\s]+([\d.]+)[”"\s]+([EeWw])/;
  const dmsMatch = decodedInput.match(dmsRegex);
  if (dmsMatch) {
    const latDeg = parseInt(dmsMatch[1], 10);
    const latMin = parseInt(dmsMatch[2], 10);
    const latSec = parseFloat(dmsMatch[3]);
    const latDir = dmsMatch[4].toUpperCase();

    const lngDeg = parseInt(dmsMatch[5], 10);
    const lngMin = parseInt(dmsMatch[6], 10);
    const lngSec = parseFloat(dmsMatch[7]);
    const lngDir = dmsMatch[8].toUpperCase();

    let lat = latDeg + latMin / 60 + latSec / 3600;
    if (latDir === "S") lat = -lat;

    let lng = lngDeg + lngMin / 60 + lngSec / 3600;
    if (lngDir === "W") lng = -lng;

    return {
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
      success: true,
      message: "Successfully parsed DMS coordinates.",
    };
  }

  // 3. Try to parse plain decimal coordinate pair
  // e.g. "12.973056, 77.595833" or "12.973056 77.595833"
  const plainCoordsRegex = /^\s*([+-]?\d+(?:\.\d+)?)\s*[, \s]\s*([+-]?\d+(?:\.\d+)?)\s*$/;
  const plainMatch = decodedInput.match(plainCoordsRegex);
  if (plainMatch) {
    return {
      latitude: parseFloat(plainMatch[1]).toFixed(6),
      longitude: parseFloat(plainMatch[2]).toFixed(6),
      success: true,
      message: "Successfully parsed plain coordinates.",
    };
  }

  // If it is a maps.app.goo.gl link, tell user to use the long URL or copy the coordinates
  if (cleanInput.includes("maps.app.goo.gl") || cleanInput.includes("goo.gl/maps")) {
    return {
      latitude: "",
      longitude: "",
      success: false,
      message: "Short Google Maps URLs are restricted. Please copy the coordinates from your Google Maps search bar or use the full browser URL.",
    };
  }

  return {
    latitude: "",
    longitude: "",
    success: false,
    message: "Could not parse coordinates. Try copy-pasting the full location URL or simple decimal coordinates (e.g. 12.97, 77.59).",
  };
}
