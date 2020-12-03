
export const padLeft = ( number ) => {
  return number < 10 ? '0'+ number : String(number)
}

export const parseToYearsAndMonth = (str) => {
  const date = str ? new Date(str) : new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1
  }
}

export const makeArrByRange = (size, startAt) => {
  let arr = [];
  for(let i = 0; i<size; i++) {
    arr[i] = startAt + i;
  }
  return arr;
}