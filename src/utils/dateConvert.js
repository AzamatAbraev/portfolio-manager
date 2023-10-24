export const longDate = (date) => {
  const givenTime = new Date(date);
  const dateConverted = givenTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return dateConverted;
};
