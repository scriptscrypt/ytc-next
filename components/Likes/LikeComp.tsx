"use client";

import { useState } from "react";
import axios from "axios";
import { envYTAPIKEY, envYTCLIENTID } from "@/config/envVars";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Spinner } from "@nextui-org/spinner";
import Image from "next/image";
import Link from "next/link";
import { gapi } from "gapi-script";
import useGoogle from "@/hooks/useGoogle";

const LikeComp = () => {
  const [comments, setComments] = useState([]);
  const [videoId, setVideoId] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const ytAPIKey = envYTAPIKEY;

  const fetchVideoId = (url: string) => {
    // Regular expression to match various YouTube URL formats, including shorts and live
    const regExp =
      /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;

    const match = url.match(regExp);

    console.log(match && match[1]);
    setVideoId(match && match[1].length === 11 ? match[1] : "");
    return match && match[1].length === 11 ? match[1] : null;
  };

  const apiFetchComments = async (apiKey: string, videoId: string) => {
    setLoadingComments(true);
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/commentThreads?key=${apiKey}&videoId=${videoId}&part=snippet`
    );
    setLoadingComments(false);
    return response.data.items;
  };

  const apiReplyComment = async (commentId: string): Promise<void> => {
    await axios.post(
      `https://www.googleapis.com/youtube/v3/comments?part=id,snippet&key=${ytAPIKey}`,
      {
        // id: commentId,
        snippet: {
          parentId: commentId,
          textOriginal: "Thank you",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken || ""}`,
        },
      }
    );
  };

  const fnFetchAllComments = async () => {
    try {
      const comments = await apiFetchComments(ytAPIKey || "", videoId);
      setComments(comments);
    } catch (error) {
      console.error("Error liking comments:", error);
    }
  };

  const fnExtractCommentId = (comment: any) => {
    return comment.snippet.topLevelComment.id;
  };

  const fnExecuteComments = async () => {
    console.log("execute");
    console.log(comments);
    // likeComment();
    await authenticateWithGoogle();
    await apiReplyComment(await fnExtractCommentId(comments[4]));
  };

  useGoogle();
  const authenticateWithGoogle = async () => {
    await gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(() => {
        console.log(
          "Sign-in successful",
          gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse()
            .access_token
        );
        setAccessToken(
          gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse()
            .access_token
        );
      })
      .catch((err: any) => console.error("Error signing in", err));
  };

  return (
    <>
      <div className="flex flex-col gap-8 mt-4">
        <div className="flex justify-between gap-4 mt-4">
          <Input
            isClearable
            onChange={(e) => fetchVideoId(e.target.value)}
            size="sm"
            type="text"
            label="Youtube Video Link"
            className="text-left"
            description={`Currently supporting Video & Shorts. Live videos are under development.`}
            errorMessage="Invalid URL"
            isInvalid={!videoId && !(comments?.length == 0)}
          />
          <Button
            isDisabled={!videoId}
            color="primary"
            size="lg"
            onClick={() => fnFetchAllComments()}
          >
            Fetch
          </Button>
        </div>
        <div>
          {/* <p>videoId : {videoId}</p> */}
          {/* <Divider /> */}
          {loadingComments && <Spinner />}
          {!loadingComments && comments && comments.length > 0 && (
            <>
              <Link
                target="_blank"
                href={`https://www.youtube.com/watch?v=${videoId}`}
              >
                {" "}
                Go to Video{" "}
              </Link>
              {comments.map((comment: any) => (
                <>
                  <div
                    key={comment.id}
                    className="flex justify-between p-2 gap-4 rounded-md"
                  >
                    <div className="text-md text-left">
                      {comment.snippet.topLevelComment.snippet.textOriginal}
                    </div>
                    <Link
                      target="_blank"
                      href={`https://www.youtube.com/${comment.snippet.topLevelComment.snippet.authorDisplayName}`}
                    >
                      <div className="flex items-center gap-1">
                        <Image
                          src={
                            comment.snippet.topLevelComment.snippet
                              .authorProfileImageUrl
                          }
                          alt="Profile Image"
                          width={16}
                          height={16}
                          className="rounded-full w-4 h-4"
                        />
                        <div className="text-sm text-slate-500 hover:opacity-80">
                          {
                            comment.snippet.topLevelComment.snippet
                              .authorDisplayName
                          }
                        </div>
                      </div>
                    </Link>
                  </div>
                  <Divider />
                </>
              ))}
            </>
          )}
        </div>
        <Divider />

        {/* <Button onClick={() => authenticateWithGoogle()} color="success" size="lg">
          authenticateWithGoogle
        </Button> */}
        <Button onClick={() => fnExecuteComments()} color="success" size="lg">
          Reply with Thank you
        </Button>

        {/* <button onClick={() => authenticateWithGoogle().then(loadClient)}>
          Authorize and Load
        </button>
        <button onClick={execute}>Execute</button> */}
      </div>
    </>
  );
};

export default LikeComp;
