export const formatMoney = (money: number): string => {
  const fixedMoney = parseFloat(money.toString());
  const fixed = fixedMoney.toFixed(2).toString().replace(".", ",");

  if (fixed.length > 6) {
    const cem = fixed.substring(fixed.length - 6, fixed.length);
    const mil = fixed.substring(0, fixed.length - 6);

    if (mil.length > 3) {
      const milion = mil.substring(0, mil.length - 3);
      const newMil = mil.substring(mil.length - 3, mil.length);
      return `${milion}.${newMil}.${cem}`;
    }

    return `${mil}.${cem}`;
  }

  return fixed;
};
