import { GET_STATION_HISTORY } from '../actions/route';

export default function stationHistoryListReducer(state = [], action) {
  switch (action.type) {
    case GET_STATION_HISTORY:
      const jorudanList = action.payload.jorudanList;
      const stationHistoryList = jorudanList.map((station) => {
        return { category: station.category, suggestions: [station] };
      });
      return stationHistoryList;
    default:
      return state;
  }
}
