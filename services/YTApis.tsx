import { envYTAPIKEY } from "@/config/envVars";
import axios from "axios";

export const apiFetchComments = async (videoId: string) => {
  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/commentThreads?key=${envYTAPIKEY}&videoId=${videoId}&part=snippet`
  );
  return response.data.items;
};

export const apiReplyComment = async (
  commentId: string,
  commentIpTxt: string
) => {
  await axios.post(
    `https://www.googleapis.com/youtube/v3/comments?part=id,snippet`,
    {
      snippet: {
        parentId: commentId,
        textOriginal: commentIpTxt,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
};

export const apiGetVideoDetails = async (videoId: string) => {
  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos?key=${envYTAPIKEY}&part=snippet&id=${videoId}&`
  );
  return response.data.items;
};
