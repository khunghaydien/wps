import configureStore from '../../../store/configureStore';
import defaultState from './state';

export const state = defaultState;

// @ts-ignore
export default (s = defaultState) => configureStore(s);
