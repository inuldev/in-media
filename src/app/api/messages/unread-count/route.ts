import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";
import { MessageCountInfo } from "@/lib/types";

export async function GET() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Tidak diizinkan" }, { status: 401 });
    }

    // Nonaktifkan fitur unread messages count untuk sementara
    // Ini akan menghindari error di production
    const data: MessageCountInfo = {
      unreadCount: 0,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
