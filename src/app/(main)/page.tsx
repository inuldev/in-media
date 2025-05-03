import { Suspense } from "react";

import TrendsSidebar from "@/components/TrendsSidebar";
import PostEditor from "@/components/posts/editor/PostEditor";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ForYouFeed from "./ForYouFeed";
import FollowingFeed from "./FollowingFeed";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">Untuk Anda</TabsTrigger>
            <TabsTrigger value="following">Mengikuti</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <Suspense fallback={<PostsLoadingSkeleton />}>
              <ForYouFeed />
            </Suspense>
          </TabsContent>
          <TabsContent value="following">
            <Suspense fallback={<PostsLoadingSkeleton />}>
              <FollowingFeed />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}
