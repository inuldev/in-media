"use client";

import Link from "next/link";
import { Bookmark, Home } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";

import MessagesButton from "./MessagesButton";
import NotificationsButton from "./NotificationsButton";
import UserMenu from "./UserMenu";

interface MenuBarProps {
  className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
  const { data: session, status } = useSession();

  // Ambil jumlah notifikasi yang belum dibaca (sementara gunakan nilai statis)
  const notificationsData = { count: 0 };

  // Untuk sementara, nonaktifkan fitur unread messages count
  const unreadMessagesCount = 0;
  const unreadNotificationsCount = notificationsData?.count || 0;

  if (status !== "authenticated") return null;

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Beranda"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Beranda</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Tersimpan"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Tersimpan</span>
        </Link>
      </Button>
      <UserMenu />
    </div>
  );
}
