import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Briefcase,
  Globe,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  X,
} from "lucide-react";
import { Logo } from "../layout/Logo";

export type AdminTab =
  | "overview"
  | "courses"
  | "countries"
  | "apprenticeships"
  | "messages"
  | "seo"
  | "settings";

interface AdminTabDef {
  key: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Heading the item sits under. */
  group: "Overview" | "Manage" | "Site";
}

export const ADMIN_TABS: AdminTabDef[] = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { key: "courses", label: "Courses", icon: BookOpen, group: "Manage" },
  { key: "countries", label: "Destinations", icon: Globe, group: "Manage" },
  { key: "apprenticeships", label: "Apprenticeships", icon: Briefcase, group: "Manage" },
  { key: "messages", label: "Messages", icon: MessageSquare, group: "Manage" },
  { key: "seo", label: "SEO", icon: Search, group: "Site" },
  { key: "settings", label: "Settings", icon: Settings, group: "Site" },
];

const GROUP_ORDER: AdminTabDef["group"][] = ["Overview", "Manage", "Site"];

interface AdminSidebarProps {
  tab: AdminTab;
  onSelect: (tab: AdminTab) => void;
  /** Mobile drawer state; the desktop sidebar is always visible. */
  open: boolean;
  onClose: () => void;
  unreadCount?: number;
}

const SidebarBody: React.FC<AdminSidebarProps & { onNavigate?: () => void }> = ({
  tab,
  onSelect,
  unreadCount = 0,
  onNavigate,
}) => {
  return (
    <div className="flex h-full flex-col bg-white text-slate-600">
      <div className="border-b border-slate-200 px-5 py-5">
        <Link to="/" aria-label="WisdomLingo home">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Dashboard sections">
        {GROUP_ORDER.map((group) => {
          const items = ADMIN_TABS.filter((item) => item.group === group);
          if (items.length === 0) return null;

          return (
            <div key={group}>
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                {group}
              </p>
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = item.key === tab;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => {
                        onSelect(item.key);
                        onNavigate?.();
                      }}
                      className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                        isActive
                          ? "bg-primary text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <item.icon
                        className={`h-[18px] w-[18px] shrink-0 ${
                          isActive ? "text-white" : "text-slate-400"
                        }`}
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                        {item.label}
                      </span>
                      {item.key === "messages" && unreadCount > 0 && (
                        <span className="badge shrink-0 bg-accent px-2 py-0.5 text-[10px] text-white">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

/** Fixed sidebar on desktop, slide-in drawer below `lg`. */
export const AdminSidebar: React.FC<AdminSidebarProps> = (props) => {
  const { open, onClose } = props;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 lg:block">
        <SidebarBody {...props} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col shadow-2xl">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="absolute right-3 top-4 z-10 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarBody {...props} onNavigate={onClose} />
          </div>
        </div>
      )}
    </>
  );
};
