export const xTicks = (d) => new Date(d.date);
export const yTicks = (d) => d.value;

export const getClassByNumber = (perRow) => {
  const classes = {
    2: "is-one-third-desktop is-one-third-tablet",
    3: "is-one-fourth-desktop is-one-third-tablet",
    4: "is-one-fifth-desktop is-one-third-tablet",
    5: "is-one-sixth-desktop is-one-third-tablet",
  };
  return classes[perRow];
};

export const getIndexOf = (array, criteria) =>
  array.reduce((lastIndex, v, i) => {
    if (lastIndex > -1) {
      return lastIndex;
    }
    return criteria(v) ? i : lastIndex;
  }, -1);
