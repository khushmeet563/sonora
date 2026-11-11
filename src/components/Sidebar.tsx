"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/library", label: "Your Library", icon: Library },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-line bg-panel transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed && (
          <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-xl font-semibold tracking-[0.25em] text-transparent">
            SONORA
          </span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="rounded-md p-1 text-muted hover:text-soft"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active ? "bg-line text-soft" : "text-muted hover:text-soft"
              }`}
            >
              <Icon size={18} className={active ? "text-cyan" : ""} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
