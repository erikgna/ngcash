export const hasNumber = (str: string): boolean => {
  return /\d/.test(str);
};

export const hasUppercase = (str: string): boolean => {
  const list: string[] = str.split("");

  let result: boolean = false;
  for (const char of list) {
    if (char === char.toUpperCase() && !hasNumber(char)) {
      result = true;
      break;
    }
  }

  return result;
};
