// Geolocation
// performs callback with geoinfo

// Sample output:
// ----------------
// coords: Coordinates
// accuracy: 27
// altitude: null
// altitudeAccuracy: null
// heading: null
// latitude: 37.7880148
// longitude: -122.41915270000001
// speed: null
// __proto__: Coordinates
// timestamp: 1538121778588

//request geolocation info
navigator.geolocation.getCurrentPosition((geoInfo) => {
  console.log(geoInfo);
});