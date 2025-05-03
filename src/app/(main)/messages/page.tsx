import { Metadata } from "next";

import Chat from "./Chat";

export const metadata: Metadata = {
  title: "Pesan",
};

export default function Page() {
  return <Chat />;
}
