"use client";

import { useState } from "react";
import axios from "axios";
import { envYTAPIKEY, envYTCLIENTID } from "@/config/envVars";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import {Spinner} from "@nextui-org/spinner";
import Image from "next/image";
import Link from "next/link";
import { gapi } from "gapi-script";

const LikeComp = () => {
  const [comments, setComments] = useState([]);
  const [videoId, setVideoId] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const ytAPIKey = envYTAPIKEY;
  // const videoId = "GzW4qSM2bbk";

  const fetchVideoId = (url: string) => {
    // Regular expression to match various YouTube URL formats, including shorts and live
    const regExp =
      /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;

    const match = url.match(regExp);

    console.log(match && match[1]);
    setVideoId(match && match[1].length === 11 ? match[1] : "");
    return match && match[1].length === 11 ? match[1] : null;
  };

  const fetchComments = async (apiKey: string, videoId: string) => {
    setLoadingComments(true);
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/commentThreads?key=${apiKey}&videoId=${videoId}&part=snippet`
    );
    setLoadingComments(false);
    return response.data.items;
  };

  const extractAndSetComments = (comments: any) => {
    // const commentTexts = comments.map(
    //   (item: any) => item.snippet.topLevelComment.snippet.textOriginal
    // );
    setComments(comments.items);
  };

  const likeComment = async (apiKey: string, commentId: string) => {
    await axios.post(
      `https://www.googleapis.com/youtube/v3/comments?part=snippet&key=${apiKey}`,
      {
        id: commentId,
        snippet: {
          textOriginal: "Thank you",
        },
      },
      {
        headers: {
          key: apiKey,
        },
      }
    );
  };

  const likeAllComments = async () => {
    try {
      const comments = await fetchComments(ytAPIKey || "", videoId);
      console.log(comments?.items);
      setComments(comments);
      // extractAndSetComments(comments);

      // for (const commentThread of comments) {
      //   const commentId = commentThread.id;
      //   console.log(commentThread);

      //   await likeComment(ytAPIKey || "", commentId);
      // }
    } catch (error) {
      console.error("Error liking comments:", error);
    }
  };

  // const loadClient = () => {
  //   const start = () =>
  //     gapi.client.init({
  //       apiKey: ytAPIKey || "",
  //       clientId: envYTCLIENTID,
  //       discoveryDocs: [
  //         "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
  //       ],
  //       scope: "https://www.googleapis.com/auth/youtube.force-ssl",
  //     });

  //   gapi.load("client:auth2", start);
  // };

  // const authenticate = async () => {
  //   await gapi.auth2
  //     .getAuthInstance()
  //     .signIn()
  //     .then(() => console.log("Sign-in successful"))
  //     .catch((err: any) => console.error("Error signing in", err));
  // };

  // const execute = () => {
  //   gapi.client.youtube.commentThreads
  //     .insert({
  //       part: ["snippet"],
  //       resource: {
  //         snippet: {
  //           videoId: videoId,
  //           topLevelComment: {
  //             snippet: {
  //               textOriginal: "This is a test comment - <>",
  //             },
  //           },
  //         },
  //       },
  //     })
  //     .then((response: any) => console.log("Response", response))
  //     .catch((err: any) => console.error("Execute error", err));
  // };

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
            onClick={() => likeAllComments()}
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
        {/* <button onClick={() => authenticate().then(loadClient)}>
          Authorize and Load
        </button>
        <button onClick={execute}>Execute</button> */}
      </div>
    </>
  );
};

export default LikeComp;
