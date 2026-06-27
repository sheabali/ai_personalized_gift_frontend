"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/src/assets/logo.png";
import {
  BarChart3,
  Gift,
  Home,
  LayoutDashboard,
  Package,
  ShoppingBag,
  User,
  Users,
  Palette,
  CalendarHeart,
  Ticket,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  user: {
    navMain: [
      {
        title: "Order History",
        url: "/user",
        icon: ShoppingBag,
      },
      {
        title: "Wishlist",
        url: "/user/wishlist",
        icon: Gift,
      },
      {
        title: "AI Designs",
        url: "/user/ai-designs",
        icon: Palette,
      },
      {
        title: "Gift Reminders",
        url: "/user/reminders",
        icon: CalendarHeart,
      },
      {
        title: "Referral & Earn",
        url: "/user/referrals",
        icon: Users,
      },
      {
        title: "Profile Settings",
        url: "/user/profile",
        icon: User,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
  admin: {
    navMain: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Products",
        url: "/admin/products",
        icon: Package,
      },
      {
        title: "Orders",
        url: "/admin/orders",
        icon: ShoppingBag,
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "Coupons",
        url: "/admin/coupons",
        icon: Ticket,
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
        icon: BarChart3,
      },
      {
        title: "Blogs",
        url: "/admin/blogs",
        icon: FileText,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
};

interface AppSidebarProps {
  role: string;
}

export default function AppSidebar({ role, ...props }: AppSidebarProps) {
  const sidebarData = data[role?.toLowerCase() as keyof typeof data];

  return (
    <Sidebar
      collapsible="icon"
      className="w-64 bg-white border-r border-neutral-100"
      {...props}
    >
      <SidebarHeader>
        <Link
          href={"/"}
          className="flex items-center w-full max-h-40 justify-center"
        >
          <Image
            src={Logo.src}
            alt="GiftAI Logo"
            width={300}
            height={300}
            className="size-auto"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData?.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
