export const utilCropUsername = (username: string, length: number) => {
  if (username.length > length) {
    return username.toString().slice(0, length) + "...";
  } else {
    return username;
  }
};
