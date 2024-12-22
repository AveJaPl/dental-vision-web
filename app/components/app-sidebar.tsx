import { FaTooth } from "react-icons/fa"; // Import ikony z react-icons
import { FolderSearch, Users, Settings, CreditCard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./theme-toggler";
import Logout from "./logout";
import Link from "next/link";

const menuItems = [
  {
    title: "Dashboard",
    icon: FaTooth, // Ikona z react-icons
    url: "/dashboard",
  },
  {
    title: "Patient Cases",
    icon: FolderSearch,
    url: "/patient-cases",
  },
  {
    title: "Team",
    icon: Users,
    url: "/team",
  },
  {
    title: "Subscriptions",
    icon: CreditCard,
    url: "/subscriptions",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
  },
];

export function DentalAssistantSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center py-4">
          <h1 className="text-xl font-semibold">Dental Vision</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className="flex items-center space-x-3 p-2 rounded-md"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-row justify-between p-4 items-center">
        <Logout />
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
