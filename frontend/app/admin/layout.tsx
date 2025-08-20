import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SidebarNavMenu } from "@/components/admin-dashboard/SidebarNavMenu";
import { SidebarUserFooter } from "@/components/admin-dashboard/SidebarUserFooter";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h2 className="text-lg font-semibold text-center uppercase tracking-wider">
            Holy Trinity
          </h2>
        </SidebarHeader>

        <SidebarContent>
          <SidebarNavMenu />
        </SidebarContent>

        <SidebarFooter>
          <SidebarUserFooter />
        </SidebarFooter>
      </Sidebar>

      {children}
    </SidebarProvider>
  );
};

export default AdminLayout;
