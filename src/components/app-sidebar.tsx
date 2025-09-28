import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { auth } from "@/auth";
import { headers } from "next/headers";
import SidebarUserNav from "./sidebar-nav-user";
import SidebarNavigation from "./sidebar-navgation";
import SidebarWrapper from "./sidebar-wrapper";

const AppSidebar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <SidebarWrapper>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <SidebarTrigger className="max-lg:hidden" />
          <h1 className="group-data-[state=collapsed]:hidden">BHIM</h1>
        </div>
        <SidebarSeparator className="mt-1 -ml-[1px]" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNavigation />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {session?.user && (
        <SidebarFooter>
          <SidebarUserNav {...session.user} />
        </SidebarFooter>
      )}
    </SidebarWrapper>
  );
};

export default AppSidebar;
