function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function sameDay(d1: Date, d2: Date) {
    console.log(d1, d2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

type Coords = {
  latitude: number;
  longitude: number;
};

function calcDistance(coords1: Coords, coords2: Coords) {
  // var R = 6.371; // km
  var R = 6371000;
  var dLat = toRad(coords2.latitude - coords1.latitude);
  var dLon = toRad(coords2.longitude - coords1.longitude);
  var lat1 = toRad(coords1.latitude);
  var lat2 = toRad(coords2.latitude);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return Math.abs(d);
}

export const findDrivers = (current: any, drivers: any) => {
  return drivers
    .filter(
      (c: any) =>
        calcDistance(c.fromAddress, current.fromAddress) < 100 &&
        calcDistance(c.toAddress, current.toAddress) < 100 &&
        sameDay(new Date(c.startDate), current.startDate)
    )
    .map((driver: any) => ({
      ...driver,
    }));
};
