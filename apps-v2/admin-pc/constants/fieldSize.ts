// NOTE: Label.js のlabelColsを3（デフォルト）としたうえで、入力フィールドの大きさを変えている

export type FieldSize = Readonly<{
  SIZE_SMALL: 2;
  SIZE_MEDIUM: 5;
  SIZE_LARGE: 8;
}>;

const fieldSize: FieldSize = {
  SIZE_SMALL: 2,
  SIZE_MEDIUM: 5,
  SIZE_LARGE: 8,
};

export default fieldSize;
