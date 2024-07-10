export const utilCropUsername = (username: string) => {
  if (username.length > 8) {
    return username.toString().slice(0, 8) + "...";
  } else {
    return username;
  }
};
