import { $Values } from 'utility-types';

export const order = {
  ASC: 'ASC',
  DESC: 'DESC',
};

export type Order = $Values<typeof order>;
