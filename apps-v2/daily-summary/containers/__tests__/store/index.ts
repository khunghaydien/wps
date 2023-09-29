import configureStore from '../../../store/configureStore';
import state from './state';

export default (initialState = state) => configureStore(initialState);
