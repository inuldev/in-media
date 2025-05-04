"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import kyInstance from "@/lib/ky";
import { Button } from "@/components/ui/button";
import { NotificationCountInfo } from "@/lib/types";

interface NotificationsButtonProps {
  initialState: NotificationCountInfo;
}

export default function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {
  // Gunakan initialState langsung tanpa query untuk sementara
  const data = initialState;

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Notifikasi"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <Bell />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Notifikasi</span>
      </Link>
    </Button>
  );
}
