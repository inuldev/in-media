"use client";

import Link from "next/link";
import { Bookmark, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

import MessagesButton from "./MessagesButton";
import NotificationsButton from "./NotificationsButton";
import UserButtonNew from "@/components/UserButtonNew";

interface MenuBarProps {
  className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
  // Untuk sementara, gunakan nilai statis
  const unreadMessagesCount = 0;
  const unreadNotificationsCount = 0;

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
      <UserButtonNew />
    </div>
  );
}
