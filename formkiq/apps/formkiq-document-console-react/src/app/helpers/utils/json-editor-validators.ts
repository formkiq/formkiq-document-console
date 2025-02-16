export const isValidString = (text: string) => {
  try {
    JSON.parse(text);
  } catch (e) {
    return false;
  }
  return true;
};

export const isValidJSON = (json: any) => {
  try {
    JSON.stringify(json);
  } catch (e) {
    return false;
  }
  return true;
};
