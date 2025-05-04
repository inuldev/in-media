import { StreamChat } from "stream-chat";

// Buat mock client untuk menghindari error
const mockClient = {
  upsertUser: async () => {
    console.log("Mock Stream Chat: upsertUser called");
    return { users: {} };
  },
  getUnreadCount: async () => {
    console.log("Mock Stream Chat: getUnreadCount called");
    return { total_unread_count: 0 };
  },
  queryChannels: async () => {
    console.log("Mock Stream Chat: queryChannels called");
    return [];
  },
  disconnectUser: async () => {
    console.log("Mock Stream Chat: disconnectUser called");
    return {};
  },
  connectUser: async () => {
    console.log("Mock Stream Chat: connectUser called");
    return {};
  },
  partialUpdateUser: async (data: any) => {
    console.log("Mock Stream Chat: partialUpdateUser called", data);
    return { users: { [data.id]: { id: data.id, ...data.set } } };
  },
  createToken: (userId: string, expiresAt: number, issuedAt: number) => {
    console.log("Mock Stream Chat: createToken called", userId);
    // Return a dummy token
    return "mock_token_" + userId + "_" + Date.now();
  },
  // Tambahkan method lain yang mungkin digunakan
};

// Gunakan mock client jika di production atau jika environment variables tidak tersedia
const useRealClient =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_STREAM_KEY &&
  process.env.STREAM_SECRET;

const streamServerClient = useRealClient
  ? StreamChat.getInstance(
      process.env.NEXT_PUBLIC_STREAM_KEY!,
      process.env.STREAM_SECRET,
    )
  : mockClient;

export default streamServerClient;
