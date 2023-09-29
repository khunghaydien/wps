const routeList = [
  {
    place: '東京',
    transportationType: 'BULLET_TRAIN',
    transportationName: 'のぞみ49号(自由席)[博多行き]',
    price: 10000,
  },
  {
    place: '新大阪',
    transportationType: 'TRAIN',
    transportationName: '東海道本線(普通)[西有明行き]',
    price: 3600,
  },
  {
    place: '梅田',
    transportationType: 'WALK',
    transportationName: '徒歩',
    price: 0,
  },
  {
    place: '大阪',
  },
];

const attentionIcon = {
  yasui: true,
  hayai: true,
  raku: true,
};

const routeInfo = {
  from: '東京',
  to: '大阪',
  roundTrip: false,
  attentionIcon,
  routeList,
};

export default routeInfo;
