"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Spinner } from "@nextui-org/spinner";
import Image from "next/image";
import Link from "next/link";
import { utilExtractCommentId } from "@/utils/functions/utilExtractCommentId";
import { useDisclosure } from "@nextui-org/modal";
import { useIsClient } from "@/contexts/IsClientCtx";
import { Tabs, Tab } from "@nextui-org/tabs";
import {
  apiFetchComments,
  apiGetVideoDetails,
  apiReplyComment,
} from "@/services/YTApis";
import { useGoogleAuth } from "@/services/GoogleAuth";
import { utilFetchVideoId } from "@/utils/functions/utilFetchVideoId";
import { utilCropUsername } from "@/utils/functions/utilCropUsername";

export const ToolComp = () => {
  const [comments, setComments] = useState([]);
  const [videoDetails, setVideoDetails] = useState({
    videoId: "",
    videoThumbnail: "",
    videoTitle: "",
    videoDescription: "",
  });
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState({
    comments: false,
    videoDetails: false,
  });
  const [replyingTo, setReplyingTo] = useState({
    commentId: "",
    commentText: "",
  });
  const [replyCount, setReplyCount] = useState({
    totalComments: 0,
    currentComment: 0,
  });
  const [commentIpTxt, setCommentIpTxt] = useState("");
  const [currentTab, setCurrentTab] = useState<SetStateAction<string>>("All");

  const isClient = useIsClient();

  const { authenticateWithGoogle } = useGoogleAuth();

  const fnFetchAllComments = async () => {
    setLoading({
      ...loading,
      comments: true,
    });
    try {
      const comments = await apiFetchComments(videoId);
      setComments(comments);
    } catch (error) {
      console.error("Error liking comments:", error);
    }
    setLoading({
      ...loading,
      comments: false,
    });
  };

  const fnExecuteComments = async () => {
    console.log("Execute function called");
    console.log(comments);
    // likeComment();
    // if(localStorage.getItem("access_token") === null){
    await authenticateWithGoogle();
    // }
    await apiReplyComment(
      utilExtractCommentId(comments[4]),
      commentIpTxt || ""
    );

    // For all comments :
    // onOpen();
    // setReplyCount({ totalComments: comments.length, currentComment: 0 });
    // for (let i = 0; i < comments.length; i++) {
    //   // setReplyCount({ ...replyCount, currentComment: i + 1 });
    //   // setReplyingTo({
    //   //   ...replyingTo,
    //   //   commentId: await utilExtractCommentId(comments[i]),
    //   //   commentText:
    //   //     (comments &&
    //   //       comments[i]) ||
    //   //     "",
    //   // });
    //   await apiReplyComment(await utilExtractCommentId(comments[i]));
    // }
  };

  const fnFetchVideoDetails = () => {
    setLoading({
      ...loading,
      videoDetails: true,
    });
    if (videoId) {
      apiGetVideoDetails(videoId)
        .then((res) => {
          console.log(res);

          setVideoDetails({
            ...videoDetails,
            videoId: res[0].id,
            videoThumbnail: res[0].snippet.thumbnails.high.url,
            videoTitle: res[0].snippet.title,
            videoDescription: res[0].snippet.description,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setLoading({
      ...loading,
      videoDetails: false,
    });
  };

  let tabs = [
    {
      id: "All",
      label: "All Comments",
      content: "Test",
    },
    {
      id: "Interact",
      label: "Interact",
      content: "Test",
    },
  ];

  useEffect(() => {
    if (!videoId) return;
    fnFetchVideoDetails();
    fnFetchAllComments();
    console.log(currentTab);
  }, [videoId]);

  useEffect(() => {
    console.log("commentIpTxt", commentIpTxt);
  }, [commentIpTxt]);

  return (
    <>
      <div className="flex flex-col gap-8 mt-4">
        <div className="flex justify-between gap-4 mt-2">
          <Input
            isClearable
            onChange={(e) => setVideoId(utilFetchVideoId(e.target.value) || "")}
            size="sm"
            type="text"
            label="Youtube Video Link"
            className="text-left"
            description={`Currently supporting Video & Shorts. Live videos are under development.`}
            errorMessage="Invalid URL"
            isInvalid={!videoId && !(comments?.length == 0)}
          />
          <Button
            size="lg"
            radius="sm"
            // className="rounded-small"
            isDisabled={!videoId}
            color="primary"
            onClick={() => fnFetchAllComments()}
          >
            Fetch
          </Button>
        </div>
        <div>
          {videoId && (
            <div className="flex flex-col gap-4">
              {videoId && (
                <div
                  className="cursor-pointer w-full"
                  onClick={() =>
                    isClient &&
                    window.open(
                      `https://www.youtube.com/watch?v=${videoId}`,
                      "_blank"
                    )
                  }
                >
                  {videoDetails && (
                    <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full bg-default-100 p-4 rounded-xl hover:shadow-md">
                      <Image
                        className="rounded-lg shadow-inner hover:shadow-lg"
                        src={videoDetails?.videoThumbnail.toString()}
                        alt={videoDetails?.videoTitle}
                        // width={`${videoDetails?.videoThumbnail.width}`}
                        width={240}
                        height={80}
                      />

                      <div className="flex flex-col gap-2">
                        <div className="font-semibold text-left">
                          {videoDetails?.videoTitle}
                        </div>

                        <div className="text-sm text-left">
                          {utilCropUsername(
                            videoDetails?.videoDescription,
                            144
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <Tabs
                selectedKey={currentTab.toString() || tabs[0]?.id}
                onSelectionChange={(e) => setCurrentTab(e.toString())}
                aria-label="Comment Actions Tab"
                items={tabs}
              >
                {(item) => (
                  <Tab key={item.id} title={item.label}>
                    {currentTab == "All" && (
                      <>
                        {loading?.comments && <Spinner />}
                        {!loading?.comments &&
                          comments &&
                          comments.length > 0 && (
                            <>
                              {/* <Divider /> */}
                              {comments.map((comment: any) => (
                                <div
                                  key={comment?.snippet?.topLevelComment?.id}
                                >
                                  <div className="flex justify-between w-full p-2 gap-4 rounded-md">
                                    <div className="text-md text-left">
                                      {
                                        comment.snippet.topLevelComment.snippet
                                          .textOriginal
                                      }
                                    </div>
                                    <div className="">
                                      <Link
                                        target="_blank"
                                        href={`https://www.youtube.com/${comment.snippet.topLevelComment.snippet.authorDisplayName}`}
                                      >
                                        <div className="flex items-center gap-1">
                                          <Image
                                            src={
                                              comment.snippet.topLevelComment
                                                .snippet.authorProfileImageUrl
                                            }
                                            alt="Profile Image"
                                            width={16}
                                            height={16}
                                            className="rounded-full w-4 h-4"
                                          />
                                          <div className="text-sm text-slate-500 hover:opacity-80">
                                            {utilCropUsername(
                                              comment.snippet.topLevelComment
                                                .snippet.authorDisplayName,
                                              8
                                            )}
                                          </div>
                                        </div>
                                      </Link>
                                    </div>{" "}
                                  </div>

                                  <Divider />
                                </div>
                              ))}
                            </>
                          )}
                      </>
                    )}

                    {currentTab == "Interact" && (
                      <>
                        {loading?.videoDetails && <Spinner />}
                        {!loading?.videoDetails && (
                          <div className=" flex w-full flex-col justify-between items-center gap-2 pb-4">
                            <div className="flex w-full gap-2">
                              <Input
                                className="w-full text-left"
                                label="Enter your Reply text"
                                description="Enter your reply text to reply to all the comments"
                                onChange={(e) =>
                                  setCommentIpTxt(e.target.value)
                                }
                                size="sm"
                              />
                              <Button
                                onClick={() => fnExecuteComments()}
                                color="default"
                                size="lg"
                                radius="md"
                              >
                                Reply
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </Tab>
                )}
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// export default LikeComp;
