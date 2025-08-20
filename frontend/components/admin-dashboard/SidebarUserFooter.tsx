"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

type StoredUser = { name: string };

export const SidebarUserFooter = () => {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    router.push("/auth");
  };

  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex items-center gap-3 p-2 border-t border-border/20">
      <Avatar className="h-9 w-9">
        <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-semibold truncate">
          {user?.name || "Admin User"}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="p-2 rounded-lg hover:bg-muted"
        title="Logout"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  );
};
