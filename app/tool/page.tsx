"use client";

import dynamic from "next/dynamic";
import { title } from "@/components/primitives";
// import LikeComp from "@/components/Likes/LikeComp";

// LikeComp - to be rendered on the client 
// Fix: Hydration error 
const ClientLikeComp = dynamic(
  () => import("@/components/Likes/LikeComp").then((mod) => mod.LikeComp),
  { ssr: false }
);

export default function DocsPage() {
  return (
    <div>
      <h1 className={title()}>The Tool</h1>
      <ClientLikeComp />
    </div>
  );
}
