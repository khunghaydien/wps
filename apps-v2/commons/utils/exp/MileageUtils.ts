import {
  MileageDestinationInfo,
  MileageUnit,
} from '@apps/domain/models/exp/Mileage';

export const getDistanceInUnit = (
  distance: number | string,
  unit: MileageUnit
): string => {
  if (!isValidDistance(distance)) return '';
  const distanceInteger = parseInt(distance as string);
  let distanceInUnit = distanceInteger;
  if (unit === MileageUnit.KILOMETER) {
    distanceInUnit = distanceInteger / 1000;
  }
  if (unit === MileageUnit.MILE) {
    distanceInUnit = distanceInteger * 0.000621371192;
  }
  return distanceInUnit.toFixed(2);
};

export const isValidDistance = (distance: number | string): boolean => {
  const fractionDigits = 2;
  return new RegExp(
    `^(([0-9|０-９]{1}[0-9|０-９]{0,11})|0|０)?(\\.|(\\.[0-9０-９]{0,${fractionDigits}}))?$`
  ).test(String(distance));
};

const getDirectionConditions = (
  destinations: Array<MileageDestinationInfo>
): google.maps.DirectionsRequest | undefined => {
  if (!destinations) return undefined;
  const origin = destinations[0].name;
  const destination = destinations[destinations.length - 1].name;
  const conditions: google.maps.DirectionsRequest = {
    destination: destination,
    origin: origin,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
  };
  if (destinations.length > 2) {
    const waypoints = destinations.slice(1, -1).map((l) => ({
      location: l.name,
    }));
    conditions.waypoints = waypoints;
  }
  return conditions;
};

export default { getDistanceInUnit, isValidDistance, getDirectionConditions };
