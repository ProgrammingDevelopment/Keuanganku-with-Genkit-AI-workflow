"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarSeparator,
  SidebarContent as UiSidebarContent, // Renaming to avoid conflict
} from "@/components/ui/sidebar";
// import { AppLogo } from "./app-logo"; // AppLogo with text is handled differently now
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";
import { APP_ROUTES } from "@/lib/constants";
import {
  LayoutDashboard,
  ListPlus,
  ReceiptText,
  Lightbulb,
  Briefcase, 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: APP_ROUTES.DASHBOARD, label: "Dasbor", icon: LayoutDashboard },
  { href: APP_ROUTES.ENTRIES, label: "Catat Entri", icon: ListPlus },
  { href: APP_ROUTES.RECEIPTS, label: "Unggah Struk", icon: ReceiptText },
  { href: APP_ROUTES.TIPS, label: "Tips Keuangan", icon: Lightbulb },
];

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <UiSidebarContent className="flex flex-col">
      <SidebarHeader className="p-4">
        <Link href={APP_ROUTES.DASHBOARD} className="flex items-center gap-2" passHref>
            <Briefcase className="h-8 w-8 text-primary" /> 
            <span className="text-xl font-bold text-foreground group-data-[collapsible=icon]:hidden">
              KeuanganKu
            </span>
        </Link>
      </SidebarHeader>

      <SidebarMenu className="flex-1 px-2">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                className={cn(
                  "w-full justify-start",
                  pathname === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                )}
                isActive={pathname === item.href}
                tooltip={item.label}
                aria-label={item.label}
              >
                <item.icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      
      <SidebarSeparator />

      <SidebarFooter className="p-2">
        <SidebarGroup>
            <ThemeToggle />
        </SidebarGroup>
        <SidebarGroup>
            <UserNav />
        </SidebarGroup>
      </SidebarFooter>
    </UiSidebarContent>
  );
}
