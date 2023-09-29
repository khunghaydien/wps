import { AnyAction } from 'redux';

import { State } from '../../../modules';

import configureStore from '../../../store/configureStore';
import state from './state';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// @ts-ignore
export default (): Store<State, AnyAction> => configureStore(state);
