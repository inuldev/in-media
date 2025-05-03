import { StreamChat } from "stream-chat";

// Buat mock client untuk menghindari error
const mockClient = {
  upsertUser: async () => {
    console.log("Mock Stream Chat: upsertUser called");
    return { users: {} };
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
