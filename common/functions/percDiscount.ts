const percentDiscount = (current: number, old: number) => {
  return ((old - current) / old) * 100;
};

export default percentDiscount;
