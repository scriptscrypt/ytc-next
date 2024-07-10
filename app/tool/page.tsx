"use client";

import dynamic from "next/dynamic";
import { title } from "@/components/primitives";
// import LikeComp from "@/components/Likes/LikeComp";

// LikeComp - to be rendered on the client
// Fix: Hydration error
const ClientToolComp = dynamic(
  () => import("@/components/Likes/ToolComp").then((mod) => mod.ToolComp),
  { ssr: false }
);

export default function ToolPage() {
  return (
    <div>
      <h1 className={title()}>The Tool</h1>
      <ClientToolComp />
    </div>
  );
}
