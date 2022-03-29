export const filterByPrice = (priceStart?: number, priceEnd?: number) => {
  if (priceStart && priceEnd) {
    return {
      $and: [{ price: { $gte: priceStart } }, { price: { $lte: priceEnd } }],
    };
  }
  if (priceStart) {
    return {
      price: { $gte: priceStart },
    };
  }
  if (priceEnd) {
    return { price: { $lte: priceEnd } };
  }
};
