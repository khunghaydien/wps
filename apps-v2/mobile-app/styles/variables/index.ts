import unit from './_unit.scss';

unit.unit = (
  scale: number,
  base = Number(unit.baseSize?.replace(/[^0-9]/g, '') || 4)
): number => scale * base;

export { unit };
export { default as colors } from './_colors.scss';
export { default as font } from './_fonts.scss';
export { default as zindex } from './_zindex.scss';
