export const padLeft = (number) => {
  return number < 10 ? '0' + number : String(number);
};

export const parseToYearsAndMonth = (str) => {
  const date = str ? new Date(str) : new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
};

export const makeArrByRange = (size, startAt) => {
  let arr = [];
  for (let i = 0; i < size; i++) {
    arr[i] = startAt + i;
  }
  return arr;
};

export const flattenArr = (arr) => {
  return arr.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {});
};

export const makeID = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

export const Color = {
  blue: '#347eff',
  deepBlue: '#61dafb',
  green: '#28a745',
  red: '#dc3545',
  gray: '#555',
  lightGray: '#efefef',
  white: '#fff',
};

export const PieColor = {
  // orange: '#FF8863',
  // yellow: '#FFF961',
  // green: '#4BAD6B',
  // blue: '#528ECB',
  // purple: '#9F61C2'
  orange: '#F5A536',
  yellow: '#F7D674',
  green: '#4BAD6B',
  blue: '#22A2F2',
  purple: '#57D6F2',
};
