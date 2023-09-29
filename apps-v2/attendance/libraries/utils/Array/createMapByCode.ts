import createMap from './createMap';

export default <T extends { code: unknown }>(records: T[]) =>
  createMap(records)('code');
