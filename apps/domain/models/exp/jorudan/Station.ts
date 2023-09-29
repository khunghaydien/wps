import Api from '../../../../commons/api';

export type StationInfo = {
  // 会社名称（バス会社など）
  category: string; // 候補の名前
  company: string;
  name: string; //	候補の区分
};

export type StationList = Array<StationInfo>;

export type Station = {
  num: number; // 候補数
  stationList: StationList;
};

export const initialStateStation = {
  num: 0,
  stationList: [],
};

export type SuggestionsItem = {
  category: string;
  suggestions: StationList;
};

export type Suggestions = Array<SuggestionsItem>;

export const makeSuggestion = (data: Station) => {
  if (data.num === 0) {
    return [];
  }
  const stationList = data.stationList;
  const categoryList = {};
  stationList.forEach((station) => {
    if (!categoryList[station.category]) {
      categoryList[station.category] = [];
    }
    const { name, company, category } = station;
    categoryList[station.category].push({ name, company, category });
  });

  const suggestions = [];
  Object.keys(categoryList).forEach((key) => {
    suggestions.push({ category: key, suggestions: categoryList[key] });
  });

  return suggestions;
};

// eslint-disable-next-line import/prefer-default-export
export const searchStation = (
  searchString: string,
  targetDate: string,
  category: string = null
): Promise<Station> =>
  Api.invoke({
    path: '/exp/jorudan/station/search',
    param: {
      searchString,
      targetDate,
      category,
    },
  }).then((result) => result.data);

export const getSuggestion = (
  searchString: string,
  targetDate: string,
  category: string = null
): Promise<Station> =>
  Api.invoke({
    path: '/exp/jorudan/station/search',
    param: {
      searchString,
      targetDate,
      category,
    },
  }).then((result) => makeSuggestion(result.data));
