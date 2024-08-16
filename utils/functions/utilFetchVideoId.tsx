export const utilFetchVideoId = (url: string) => {
  // Regular expression to match various YouTube URL formats, including shorts and live
  const regExp =
    /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;

  const match = url.match(regExp);
  // console.log(match && match[1]);
  return match && match[1].length === 11 ? match[1] : null;
};
