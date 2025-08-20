"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { User, HelpCircle, BookOpen } from "lucide-react";

const menuItems = [
  { title: "Instructors", icon: <User />, url: "/admin/dashboard" },
  { title: "Questions", icon: <HelpCircle />, url: "/admin/questions" },
  { title: "Subjects", icon: <BookOpen />, url: "/admin/subjects" },
];

export const SidebarNavMenu = () => {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <Link href={item.url}>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={pathname === item.url}
            >
              {item.icon}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
