"use client";

import { useState } from "react";
import axios from "axios";
import { envYTAPIKEY, envYTCLIENTID } from "@/config/envVars";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import Image from "next/image";
import Link from "next/link";
import { gapi } from "gapi-script";

const LikeComp = () => {
  const [comments, setComments] = useState([]);
  const [videoId, setVideoId] = useState("");
  const ytAPIKey = envYTAPIKEY;
  // const videoId = "GzW4qSM2bbk";

  const fetchVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    console.log(match && match[2]);
    setVideoId(match && match[2].length === 11 ? match[2] : "");
    return match && match[2].length === 11 ? match[2] : null;
  };

  const fetchComments = async (apiKey: string, videoId: string) => {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/commentThreads?key=${apiKey}&videoId=${videoId}&part=snippet`
    );
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
        <div className="flex items-center justify-center gap-4 mt-4">
          <Input
            onChange={(e) => fetchVideoId(e.target.value)}
            size="sm"
            type="text"
            label="Youtube Video Link"
          />
          <Button size="lg" onClick={() => likeAllComments()}>
            Fetch
          </Button>
        </div>
        <div>
          <Link href={`https://www.youtube.com/watch?v=${videoId}`}>
            {" "}
            Go to Video{" "}
          </Link>
          {/* <p>videoId : {videoId}</p> */}
          {/* <Divider /> */}
          {comments &&
            comments.map((comment: any) => (
              <>
                <div
                  key={comment.id}
                  className="flex justify-between p-2 gap-2"
                >
                  <div className="text-md text-left">
                    {comment.snippet.topLevelComment.snippet.textOriginal}
                  </div>
                  <Link
                    target="_blank"
                    href={`https://www.youtube.com/${comment.snippet.topLevelComment.snippet.authorDisplayName}`}
                  >
                    <div className="flex">
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
                      <div className="ml-2 text-sm text-slate-500">
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
