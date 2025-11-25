"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import {
  UsersIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { ClipboardIcon, Cog8ToothIcon, HomeModernIcon, SpeakerWaveIcon, UserCircleIcon, UserIcon } from "@heroicons/react/20/solid";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { CreditCard, LucideCreditCard, SettingsIcon } from "lucide-react";

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const NavItem = ({
    href,
    label,
    icon: Icon,
    active,
  }: {
    href: string;
    label: string;
    icon: any;
    active: boolean;
  }) => (
    <Link
      href={href}
      className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl text-sm font-semibold transition
        ${
          active
            ? "bg-purple-200 text-purple-800"
            : "text-[#9185d8] hover:bg-purple-100 hover:text-purple-800"
        }`}
    >
      <Icon className="h-5 w-5" />
      <div className={active ? 'text-purple-800' : 'text-black'}>
        {label}
      </div>
    </Link>
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <nav className="fixed px-4 bg-white border-r border-gray-200 h-screen w-64 flex flex-col py-8">

      {/* Brand Logo */}
      <div className="flex justify-center gap-2 items-center mb-10">
        {/* <Image
          src="/images/tenangin-logo.png" 
          alt="Tenangin Logo"
          width={90}
          height={90}
          className="rounded-full shadow-md"
        /> */}
        <UserCircleIcon width={50} color="#9185d8"/>
        <div className="font-semibold text-[20px] px-1">Tenangin Admin</div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col flex-1 space-y-4 px-3">

        <NavItem
          href="/dashboard"
          label="Dashboard"
          icon={HomeModernIcon}
          active={pathname === "/dashboard"}
        />

        <NavItem
          href="/chat"
          label="Obrolan Pengguna"
          icon={ChatBubbleLeftEllipsisIcon}
          active={pathname.startsWith("/chat")}
        />

        <NavItem
          href="/active-users"
          label="Pengguna Aktif"
          icon={UserCircleIcon}
          active={pathname.startsWith("/active-users")}
        />

        <NavItem
          href="/payments"
          label="Pembayaran"
          icon={ClipboardIcon}
          active={pathname.startsWith("/payments")}
        />

        <NavItem
          href="/announcements"
          label="Berita & Pengumuman"
          icon={SpeakerWaveIcon}
          active={pathname.startsWith("/announcements")}
        />

        <NavItem
          href="/settings"
          label="Pengaturan Tampilan"
          icon={Cog8ToothIcon}
          active={pathname.startsWith("/settings")}
        />
      </div>

      {/* Profile & Logout */}
      <div className="mt-auto flex flex-col px-4 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-purple-600 hover:text-purple-800 hover:bg-purple-100 px-4 py-2 rounded-xl transition mt-3"
        >
          <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default memo(Sidebar);
