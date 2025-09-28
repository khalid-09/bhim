import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="lg:peer-data-[variant=inset]:my-4 lg:peer-data-[variant=inset]:mr-4 lg:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0">
        <div className="w-full">
          <Navbar />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
