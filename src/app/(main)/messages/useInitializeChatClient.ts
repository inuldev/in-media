import { StreamChat } from "stream-chat";
import { useEffect, useState } from "react";

import kyInstance from "@/lib/ky";
import { useSession } from "next-auth/react";

export default function useInitializeChatClient() {
  const { data: session } = useSession();
  const user = session?.user;
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    if (!user) return;

    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

    client
      .connectUser(
        {
          id: user.id,
          username: user.name || user.email || user.id,
          name: user.name || "User",
          image: user.image || undefined,
        },
        async () =>
          kyInstance
            .get("/api/get-token")
            .json<{ token: string }>()
            .then((data) => data.token),
      )
      .catch((error) => console.error("Failed to connect user", error))
      .then(() => setChatClient(client));

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => console.error("Failed to disconnect user", error))
        .then(() => console.log("Connection closed"));
    };
  }, [user?.id, user?.name, user?.email, user?.image]);

  return chatClient;
}
