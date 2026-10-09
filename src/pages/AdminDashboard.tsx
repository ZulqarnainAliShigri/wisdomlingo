import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ChevronDown, ExternalLink, LogOut, Menu, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { ADMIN_EMAIL, isSupabaseConfigured, supabase } from "../lib/supabase";
import { errorMessage } from "../lib/utils";
import { ADMIN_TABS, AdminSidebar, AdminTab } from "../components/admin/AdminSidebar";
import { ProfileModal, avatarUrl, displayName } from "../components/admin/ProfileModal";
import { Avatar } from "../components/ui/Avatar";
import { Spinner } from "../components/ui/Loader";
import { ApprenticeshipsTab } from "../components/admin/ApprenticeshipsTab";
import { ArticlesTab } from "../components/admin/ArticlesTab";
import { CountriesTab } from "../components/admin/CountriesTab";
import { CoursesTab } from "../components/admin/CoursesTab";
import { MessagesTab } from "../components/admin/MessagesTab";
import { OverviewTab } from "../components/admin/OverviewTab";
import { SeoTab } from "../components/admin/SeoTab";
import { SettingsTab } from "../components/admin/SettingsTab";
import { StoriesTab } from "../components/admin/StoriesTab";

/** Page title shown in the dashboard header. */
const HEADINGS: Record<AdminTab, string> = {
  overview: "Dashboard",
  courses: "Courses",
  countries: "Study destinations",
  apprenticeships: "Ausbildung",
  stories: "Success Stories",
  articles: "Articles & News",
  messages: "Messages",
  seo: "SEO",
  settings: "Settings",
};

export const AdminDashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Escape and outside clicks close the account menu.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [menuOpen]);

  // Refreshed on every tab change so the badge settles after reading messages.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false)
      .then(({ count }) => {
        if (active) setUnread(count ?? 0);
      });
    return () => {
      active = false;
    };
  }, [tab]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      toast.success("Signed out.");
      navigate("/admin", { replace: true });
    } catch (error) {
      toast.error(errorMessage(error, "Could not sign out."));
    } finally {
      setSigningOut(false);
    }
  };

  const tabStripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tabStripRef.current) return;
    const activeButton = tabStripRef.current.querySelector<HTMLButtonElement>('[aria-current="page"]');
    if (activeButton) {
      activeButton.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [tab]);

  const address = user?.email || ADMIN_EMAIL;
  const name = displayName(user);
  const photo = avatarUrl(user);
  const headingTitle = HEADINGS[tab];
  const activeTab = ADMIN_TABS.find((item) => item.key === tab);

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar
        tab={tab}
        onSelect={setTab}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        unreadCount={unread}
      />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="flex h-14 sm:h-16 items-center gap-2.5 px-3.5 sm:px-6">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-primary hover:bg-primary hover:text-white active:scale-95 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex min-w-0 items-center gap-2">
              {activeTab && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                  <activeTab.icon className="h-4 w-4" />
                </span>
              )}
              <h1 className="truncate text-sm sm:text-base font-black text-slate-900">
                {headingTitle}
              </h1>
            </div>

            {/* Account controls */}
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:border-primary hover:bg-primary-50 hover:text-primary active:scale-95"
                title="View website"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden sm:inline">View website</span>
              </Link>

              <span aria-hidden="true" className="hidden h-6 w-px bg-slate-200 sm:block" />

              {/* The photo is the menu trigger - profile and sign out live inside it. */}
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((value) => !value)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label="Account menu"
                  className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-slate-100"
                >
                  <Avatar src={photo} name={name} className="h-8 w-8 sm:h-9 sm:w-9 text-xs sm:text-sm ring-1 ring-slate-200" />
                  <span className="hidden min-w-0 text-left md:block">
                    <span className="block max-w-[12rem] truncate text-xs font-bold text-slate-800">
                      {name}
                    </span>
                    <span className="block max-w-[12rem] truncate text-[10px] text-slate-400">
                      {address}
                    </span>
                  </span>
                  <ChevronDown
                    className={`hidden h-3.5 w-3.5 shrink-0 text-slate-400 transition md:block ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-30 mt-2 w-60 animate-fade-in-up overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-2xl"
                  >
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="truncate text-sm font-bold text-slate-900">{name}</p>
                      <p className="truncate text-xs text-slate-500">{address}</p>
                    </div>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        setProfileOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <UserRound className="h-4 w-4 text-slate-400" /> Your profile
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        handleSignOut();
                      }}
                      disabled={signingOut}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-accent transition hover:bg-accent-50 disabled:opacity-50"
                    >
                      {signingOut ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Fast-Switch Tab Strip (Swipeable) */}
          <div
            ref={tabStripRef}
            className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-1.5 bg-slate-50/80 no-scrollbar scroll-smooth lg:hidden"
          >
            {ADMIN_TABS.map((item) => {
              const isActive = item.key === tab;
              return (
                <button
                  key={item.key}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setTab(item.key)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition active:scale-95 ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                  }`}
                >
                  <item.icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.key === "messages" && unread > 0 && (
                    <span
                      className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                        isActive ? "bg-white text-primary" : "bg-accent text-white"
                      }`}
                    >
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </header>

        <main className="px-3 py-4 sm:px-6 sm:py-8">
          {!isSupabaseConfigured && (
            <div className="mb-4 sm:mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 sm:p-4 text-xs sm:text-sm text-amber-900 shadow-2xs">
              <AlertTriangle className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-amber-600" />
              <p>
                Supabase is in read-only demo mode. Add{" "}
                <code className="font-mono text-[11px] bg-amber-100/80 px-1 py-0.5 rounded">REACT_APP_SUPABASE_URL</code> to enable live updates.
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:p-7">
            {tab === "overview" && <OverviewTab onNavigate={setTab} />}
            {tab === "courses" && <CoursesTab onBack={() => setTab("overview")} />}
            {tab === "countries" && <CountriesTab onBack={() => setTab("overview")} />}
            {tab === "apprenticeships" && <ApprenticeshipsTab onBack={() => setTab("overview")} />}
            {tab === "stories" && <StoriesTab onBack={() => setTab("overview")} />}
            {tab === "articles" && <ArticlesTab onBack={() => setTab("overview")} />}
            {tab === "messages" && <MessagesTab onUnreadCountChange={setUnread} onBack={() => setTab("overview")} />}
            {tab === "seo" && <SeoTab onBack={() => setTab("overview")} />}
            {tab === "settings" && <SettingsTab onEditProfile={() => setProfileOpen(true)} onBack={() => setTab("overview")} />}
          </div>
        </main>
      </div>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
};
