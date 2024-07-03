import { title } from "@/components/primitives";
import LikeComp from "@/components/Likes/LikeComp";

export default function DocsPage() {
  return (
    <div>
      <h1 className={title()}>The Tool</h1>
      <LikeComp/>
    </div>
  );
}
