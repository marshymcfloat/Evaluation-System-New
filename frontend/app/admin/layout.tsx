import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Home, User, HelpCircle, BookOpen, LogOut } from "lucide-react";
import Link from "next/link";

const items = [
  { title: "Instructors", icon: <User />, url: "/dashboard" },
  { title: "Questions", icon: <HelpCircle />, url: "/questions" },
  { title: "Subjects", icon: <BookOpen />, url: "/subjects" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h2 className="text-lg font-semibold text-center uppercase">
            Holy Trinity
          </h2>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link href={`/admin/${item.url}`}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.title === "Home"}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {children}
    </SidebarProvider>
  );
};

export default AdminLayout;
