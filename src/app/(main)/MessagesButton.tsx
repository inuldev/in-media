"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import kyInstance from "@/lib/ky";
import { MessageCountInfo } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface MessagesButtonProps {
  initialState: MessageCountInfo;
}

export default function MessagesButton({ initialState }: MessagesButtonProps) {
  // Gunakan initialState langsung tanpa query untuk sementara
  const data = initialState;

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Pesan"
      asChild
    >
      <Link href="/messages">
        <div className="relative">
          <Mail />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Pesan</span>
      </Link>
    </Button>
  );
}
