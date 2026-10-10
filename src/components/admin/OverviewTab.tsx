import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe,
  ImageOff,
  Layers,
  List,
  Mail,
  MessageSquare,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  SEED_APPRENTICESHIPS,
  SEED_ARTICLES,
  SEED_COUNTRIES,
  SEED_COURSES,
  SEED_STORIES,
} from "../../data/seed";
import { CATEGORY_TABS } from "../../data/content";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { formatDate } from "../../lib/utils";
import {
  RANGES,
  RangeKey,
  buildBuckets,
  countInPreviousWindow,
  daysSince,
  percentChange,
  tallyIntoBuckets,
  tallyLabels,
} from "../../lib/analytics";
import { ContactSubmission, CourseCategory, Row } from "../../types";
import { EmptyState } from "../ui/EmptyState";
import { FullPageLoader } from "../ui/Loader";
import {
  BarList,
  ChartCard,
  ColumnChart,
  Delta,
  Meter,
  StackedBars,
  Sparkline,
} from "../ui/charts";
import { useDashboardPrefs } from "../../hooks/useDashboardPrefs";
import { AdminTab } from "./AdminSidebar";

interface CourseRow {
  id: string;
  category: string;
  is_active: boolean;
  image_url: string | null;
}

interface DashboardData {
  courses: CourseRow[];
  countries: { id: string; is_active: boolean }[];
  apprenticeships: { id: string; is_active: boolean; field: string | null }[];
  stories: { id: string; is_active: boolean }[];
  articles: { id: string; is_active: boolean }[];
  messages: ContactSubmission[];
}

const EMPTY_DATA: DashboardData = {
  courses: [],
  countries: [],
  apprenticeships: [],
  stories: [],
  articles: [],
  messages: [],
};

/** Seed content stands in when Supabase is not connected, so the layout still reads. */
const demoData = (): DashboardData => ({
  courses: SEED_COURSES.map((course) => ({
    id: course.id,
    category: course.category,
    is_active: course.is_active,
    image_url: course.image_url,
  })),
  countries: SEED_COUNTRIES.map((country) => ({
    id: country.id,
    is_active: country.is_active,
  })),
  apprenticeships: SEED_APPRENTICESHIPS.map((item) => ({
    id: item.id,
    is_active: item.is_active,
    field: item.field,
  })),
  stories: SEED_STORIES.map((item) => ({
    id: item.id,
    is_active: item.is_active,
  })),
  articles: SEED_ARTICLES.map((item) => ({
    id: item.id,
    is_active: item.is_active,
  })),
  messages: [],
});

const toMessage = (row: Row): ContactSubmission => ({
  id: String(row.id),
  name: row.name ?? "",
  email: row.email ?? "",
  phone: row.phone ?? null,
  subject: row.subject ?? null,
  message: row.message ?? "",
  is_read: Boolean(row.is_read),
  created_at: row.created_at ?? new Date().toISOString(),
});

export const OverviewTab: React.FC<{ onNavigate: (tab: AdminTab) => void }> = ({ onNavigate }) => {
  const [data, setData] = useState<DashboardData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [prefs] = useDashboardPrefs();
  const [range, setRange] = useState<RangeKey>(prefs.defaultRange);
  const [contentView, setContentView] = useState<"visual" | "list">("visual");

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setData(demoData());
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [coursesRes, countriesRes, apprenticeshipsRes, storiesRes, articlesRes, submissionsRes] =
        await Promise.allSettled([
          supabase.from("courses").select("id, category, is_active, image_url"),
          supabase.from("study_countries").select("id, is_active"),
          supabase.from("apprenticeships").select("id, is_active, field"),
          supabase.from("success_stories").select("id, is_active"),
          supabase.from("articles").select("id, is_active"),
          supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
        ]);

      const getRows = (res: PromiseSettledResult<{ data: unknown; error: unknown }>, fallback: unknown[]) => {
        if (
          res.status === "fulfilled" &&
          !res.value.error &&
          Array.isArray(res.value.data) &&
          res.value.data.length > 0
        ) {
          return res.value.data as Row[];
        }
        return fallback as Row[];
      };

      const courseRows = getRows(coursesRes, SEED_COURSES);
      const countryRows = getRows(countriesRes, SEED_COUNTRIES);
      const apprenticeshipRows = getRows(apprenticeshipsRes, SEED_APPRENTICESHIPS);
      const storyRows = getRows(storiesRes, SEED_STORIES);
      const articleRows = getRows(articlesRes, SEED_ARTICLES);

      const messageRows =
        submissionsRes.status === "fulfilled" &&
          !submissionsRes.value.error &&
          Array.isArray(submissionsRes.value.data)
          ? (submissionsRes.value.data as Row[])
          : [];

      setData({
        courses: courseRows.map((row) => ({
          id: String(row.id),
          category: row.category ?? "",
          is_active: row.is_active !== false,
          image_url: row.image_url ?? null,
        })),
        countries: countryRows.map((row) => ({
          id: String(row.id),
          is_active: row.is_active !== false,
        })),
        apprenticeships: apprenticeshipRows.map((row) => ({
          id: String(row.id),
          is_active: row.is_active !== false,
          field: row.field ?? null,
        })),
        stories: storyRows.map((row) => ({
          id: String(row.id),
          is_active: row.is_active !== false,
        })),
        articles: articleRows.map((row) => ({
          id: String(row.id),
          is_active: row.is_active !== false,
        })),
        messages: messageRows.map(toMessage),
      });
    } catch (error) {
      console.warn("Could not load full dashboard summary from Supabase, using demo fallback:", error);
      setData(demoData());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const analytics = useMemo(() => {
    const { courses, countries, apprenticeships, stories, articles, messages } = data;
    const dates = messages.map((message) => message.created_at);

    const buckets = tallyIntoBuckets(buildBuckets(range), dates);
    const windowStart = buckets.length > 0 ? buckets[0].start.getTime() : 0;
    const windowEnd = buckets.length > 0 ? buckets[buckets.length - 1].end.getTime() : 0;
    const inWindow = messages.filter((message) => {
      const time = new Date(message.created_at).getTime();
      return !Number.isNaN(time) && time >= windowStart && time < windowEnd;
    });

    const unreadMessages = messages.filter((message) => !message.is_read);
    const stale = unreadMessages.filter(
      (message) => daysSince(message.created_at) >= prefs.staleAfterDays
    );
    const oldestUnread = unreadMessages.reduce<ContactSubmission | null>(
      (oldest, message) =>
        !oldest || new Date(message.created_at) < new Date(oldest.created_at) ? message : oldest,
      null
    );

    const byCategory = CATEGORY_TABS.map((tab) => ({
      label: tab.label,
      value: courses.filter((course) => course.category === (tab.key as CourseCategory)).length,
    }));

    const coursesWithoutImage = courses.filter((course) => !course.image_url);
    const hiddenCourses = courses.filter((course) => !course.is_active);
    const hiddenCountries = countries.filter((country) => !country.is_active);
    const hiddenApprenticeships = apprenticeships.filter((item) => !item.is_active);
    const hiddenStories = stories.filter((item) => !item.is_active);
    const hiddenArticles = articles.filter((item) => !item.is_active);

    const periodTotal = buckets.reduce((sum, bucket) => sum + bucket.value, 0);
    const previousTotal = countInPreviousWindow(buckets, dates);

    const fullContentSummary = [
      {
        name: "Courses",
        tab: "courses" as AdminTab,
        total: courses.length,
        published: courses.length - hiddenCourses.length,
        hidden: hiddenCourses.length,
        icon: BookOpen,
        color: "text-blue-600 bg-blue-50 border-blue-200",
      },
      {
        name: "Study Destinations",
        tab: "countries" as AdminTab,
        total: countries.length,
        published: countries.length - hiddenCountries.length,
        hidden: hiddenCountries.length,
        icon: Globe,
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      },
      {
        name: "Ausbildung Programs",
        tab: "apprenticeships" as AdminTab,
        total: apprenticeships.length,
        published: apprenticeships.length - hiddenApprenticeships.length,
        hidden: hiddenApprenticeships.length,
        icon: Briefcase,
        color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      },
      {
        name: "Success Stories",
        tab: "stories" as AdminTab,
        total: stories.length,
        published: stories.length - hiddenStories.length,
        hidden: hiddenStories.length,
        icon: Award,
        color: "text-amber-600 bg-amber-50 border-amber-200",
      },
      {
        name: "Articles & News",
        tab: "articles" as AdminTab,
        total: articles.length,
        published: articles.length - hiddenArticles.length,
        hidden: hiddenArticles.length,
        icon: FileText,
        color: "text-violet-600 bg-violet-50 border-violet-200",
      },
    ];

    return {
      buckets,
      periodTotal,
      previousTotal,
      delta: percentChange(periodTotal, previousTotal),
      subjects: tallyLabels(inWindow.map((message) => message.subject)),
      fields: tallyLabels(
        apprenticeships.map((item) => item.field),
        6,
        "Unassigned"
      ),
      byCategory,
      unread: unreadMessages.length,
      stale: stale.length,
      oldestUnread,
      recent: messages.slice(0, 5),
      totalMessages: messages.length,
      fullContentSummary,
      contentRows: [
        {
          label: "Courses",
          published: courses.length - hiddenCourses.length,
          hidden: hiddenCourses.length,
        },
        {
          label: "Destinations",
          published: countries.length - hiddenCountries.length,
          hidden: hiddenCountries.length,
        },
        {
          label: "Ausbildung",
          published: apprenticeships.length - hiddenApprenticeships.length,
          hidden: hiddenApprenticeships.length,
        },
        {
          label: "Stories",
          published: stories.length - hiddenStories.length,
          hidden: hiddenStories.length,
        },
        {
          label: "Articles",
          published: articles.length - hiddenArticles.length,
          hidden: hiddenArticles.length,
        },
      ],
      attention: [
        {
          count: stale.length,
          icon: AlertTriangle,
          text: `waiting more than ${prefs.staleAfterDays} days for a reply`,
          noun: ["enquiry", "enquiries"] as const,
          tab: "messages" as AdminTab,
        },
        {
          count: coursesWithoutImage.length,
          icon: ImageOff,
          text: "with no image uploaded",
          noun: ["course", "courses"] as const,
          tab: "courses" as AdminTab,
        },
        {
          count: hiddenCourses.length,
          icon: BookOpen,
          text: "hidden from the website",
          noun: ["course", "courses"] as const,
          tab: "courses" as AdminTab,
        },
        {
          count: hiddenCountries.length,
          icon: Globe,
          text: "hidden from the website",
          noun: ["destination", "destinations"] as const,
          tab: "countries" as AdminTab,
        },
        {
          count: hiddenApprenticeships.length,
          icon: Briefcase,
          text: "hidden from the website",
          noun: ["Ausbildung program", "Ausbildung programs"] as const,
          tab: "apprenticeships" as AdminTab,
        },
      ].filter((item) => item.count > 0),
      counts: {
        courses: courses.length,
        hiddenCourses: hiddenCourses.length,
        countries: countries.length,
        apprenticeships: apprenticeships.length,
        stories: stories.length,
        articles: articles.length,
      },
    };
  }, [data, range, prefs.staleAfterDays]);

  if (loading) return <FullPageLoader label="Loading summary..." />;

  const activeRange = RANGES.find((item) => item.key === range) ?? RANGES[0];

  const frontQuickActions = [
    {
      label: "Add Course",
      subtext: `${analytics.counts.courses} total`,
      tab: "courses" as AdminTab,
      icon: BookOpen,
      bgClass: "bg-blue-50 text-blue-600 border-blue-100",
      badge: `${analytics.counts.courses} items`,
    },
    {
      label: "Add Destination",
      subtext: `${analytics.counts.countries} countries`,
      tab: "countries" as AdminTab,
      icon: Globe,
      bgClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
      badge: `${analytics.counts.countries} items`,
    },
    {
      label: "Add Ausbildung",
      subtext: `${analytics.counts.apprenticeships} programs`,
      tab: "apprenticeships" as AdminTab,
      icon: Briefcase,
      bgClass: "bg-indigo-50 text-indigo-600 border-indigo-100",
      badge: `${analytics.counts.apprenticeships} items`,
    },
    {
      label: "Post Story",
      subtext: `${analytics.counts.stories} stories`,
      tab: "stories" as AdminTab,
      icon: Award,
      bgClass: "bg-amber-50 text-amber-600 border-amber-100",
      badge: `${analytics.counts.stories} items`,
    },
    {
      label: "New Article",
      subtext: `${analytics.counts.articles} posts`,
      tab: "articles" as AdminTab,
      icon: FileText,
      bgClass: "bg-violet-50 text-violet-600 border-violet-100",
      badge: `${analytics.counts.articles} items`,
    },
    {
      label: "View Messages",
      subtext: analytics.unread > 0 ? `${analytics.unread} unread` : "All read",
      tab: "messages" as AdminTab,
      icon: MessageSquare,
      bgClass: analytics.unread > 0 ? "bg-accent-50 text-accent border-accent-100" : "bg-slate-50 text-slate-600 border-slate-200",
      badge: analytics.unread > 0 ? `${analytics.unread} new` : undefined,
      badgeColor: analytics.unread > 0 ? "bg-accent text-white" : undefined,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ------------------------------------------------ FRONT QUICK ACTIONS */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary-50/70 via-white to-slate-50 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3 sm:pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-white text-xs font-black shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Quick Actions
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              One-click shortcuts to add items, publish programs, and check enquiries.
            </p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
            1-Tap Management
          </span>
        </div>

        <div className="mt-3.5 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {frontQuickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => onNavigate(action.tab)}
              className="group relative flex flex-col items-start justify-between rounded-xl border border-slate-200/90 bg-white p-3 sm:p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md active:translate-y-0 active:scale-98"
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border ${action.bgClass} transition group-hover:scale-110`}
                >
                  <action.icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </span>
                {action.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${action.badgeColor || "bg-slate-100 text-slate-600"
                      }`}
                  >
                    {action.badge}
                  </span>
                )}
              </div>
              <div className="mt-2.5 w-full">
                <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-primary transition leading-tight flex items-center justify-between">
                  <span>{action.label}</span>
                  <Plus className="h-3 w-3 text-slate-300 group-hover:text-primary transition shrink-0 ml-1" />
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
                  {action.subtext}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------- enquiries */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">Enquiries</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Everything in this section covers the last {activeRange.label.toLowerCase()}.
            </p>
          </div>
          <div
            role="group"
            aria-label="Date range"
            className="flex overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1 no-scrollbar w-full sm:w-auto"
          >
            {RANGES.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setRange(option.key)}
                aria-pressed={range === option.key}
                className={`flex-1 sm:flex-none whitespace-nowrap rounded-lg px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold transition text-center ${range === option.key
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 sm:mt-5 grid gap-4 sm:gap-6 lg:grid-cols-3">
          <ChartCard
            className="lg:col-span-2"
            title="Enquiries received"
            hint={`${analytics.periodTotal} in the last ${activeRange.label.toLowerCase()}`}
            action={
              analytics.totalMessages > 0 ? (
                <Delta percent={analytics.delta} baseline={activeRange.previousLabel} />
              ) : null
            }
            tableRows={analytics.buckets.map((bucket) => ({
              label: bucket.fullLabel,
              value: bucket.value,
            }))}
            tableHeaders={["Period Window", "Enquiries Count"]}
          >
            <ColumnChart buckets={analytics.buckets} />
          </ChartCard>

          <ChartCard
            title="Reply status"
            hint="Across every enquiry ever received"
            tableRows={[
              { label: "Unread Enquiries", value: analytics.unread },
              { label: "Read / Handled", value: Math.max(0, analytics.totalMessages - analytics.unread) },
              { label: "Total Received", value: analytics.totalMessages },
            ]}
            tableHeaders={["Status", "Total"]}
          >
            <div className="space-y-5">
              <Meter
                value={analytics.unread}
                total={analytics.totalMessages}
                label="Still unread"
                tone={analytics.unread > 0 ? "bad" : "series"}
              />

              <div className="rounded-xl bg-slate-50 p-4">
                {analytics.oldestUnread ? (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Longest wait
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-slate-900">
                      {daysSince(analytics.oldestUnread.created_at)}
                      <span className="ml-1 text-sm font-semibold text-slate-500">
                        {daysSince(analytics.oldestUnread.created_at) === 1 ? "day" : "days"}
                      </span>
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {analytics.oldestUnread.name} ·{" "}
                      {analytics.oldestUnread.subject || analytics.oldestUnread.email}
                    </p>
                  </>
                ) : (
                  <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> Every enquiry has been read.
                  </p>
                )}
              </div>

              {analytics.totalMessages > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Recent trend
                  </p>
                  <div className="mt-2">
                    <Sparkline values={analytics.buckets.map((bucket) => bucket.value)} />
                  </div>
                </div>
              )}
            </div>
          </ChartCard>

          <ChartCard
            title="What people ask about"
            hint={`Subject chosen on the contact form, last ${activeRange.label.toLowerCase()}`}
            tableRows={analytics.subjects.map((slice) => ({
              label: slice.label,
              value: slice.value,
            }))}
            tableHeaders={["Subject Area", "Enquiries"]}
          >
            <BarList
              rows={analytics.subjects}
              emptyLabel={`No enquiries in the last ${activeRange.label.toLowerCase()}.`}
            />
          </ChartCard>

          <section className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Recent enquiries</h2>
                <p className="text-xs text-slate-400">Latest messages submitted via the contact form</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("messages")}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-primary transition hover:gap-1.5"
              >
                View all <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3.5 sm:mt-4">
              {analytics.recent.length === 0 ? (
                <EmptyState
                  title="No enquiries yet"
                  hint="Messages from the contact form appear here."
                  icon={<MessageSquare className="h-5 w-5" />}
                />
              ) : (
                <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 overflow-hidden bg-white">
                  {analytics.recent.map((message) => (
                    <li key={message.id}>
                      <button
                        type="button"
                        onClick={() => onNavigate("messages")}
                        className="flex w-full items-center gap-3 p-3 sm:p-3.5 text-left transition hover:bg-slate-50"
                      >
                        <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <Mail className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-xs sm:text-sm font-semibold text-slate-900">{message.name}</span>
                            {!message.is_read && (
                              <span className="badge bg-accent px-1.5 py-0.2 text-[10px] text-white">
                                New
                              </span>
                            )}
                          </span>
                          <span className="block truncate text-[11px] sm:text-xs text-slate-500">
                            {message.subject || message.email}
                          </span>
                        </span>
                        <span className="hidden shrink-0 text-xs text-slate-400 sm:block">
                          {formatDate(message.created_at)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ------------------------------------------------------------ content */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">Content Directory</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Live status and distribution of all courses, study destinations, Ausbildung, stories, and articles.
            </p>
          </div>

          {/* Master View Switcher for Content Hub */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setContentView("visual")}
              aria-pressed={contentView === "visual"}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold transition ${contentView === "visual"
                  ? "bg-white text-primary shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
                }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Cards &amp; Charts</span>
            </button>
            <button
              type="button"
              onClick={() => setContentView("list")}
              aria-pressed={contentView === "list"}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold transition ${contentView === "list"
                  ? "bg-white text-primary shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
                }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Full List View</span>
            </button>
          </div>
        </div>

        {contentView === "list" ? (
          /* Comprehensive Content Summary List Table */
          <div className="mt-4 sm:mt-5 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">All Modules &amp; Publishing Breakdown</h3>
              <span className="text-[11px] font-semibold text-slate-500">5 Collections</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-bold">Content Module</th>
                    <th className="px-4 py-3 font-bold text-center">Total Items</th>
                    <th className="px-4 py-3 font-bold text-center">Published (Live)</th>
                    <th className="px-4 py-3 font-bold text-center">Hidden (Draft)</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analytics.fullContentSummary.map((item) => (
                    <tr key={item.name} className="transition hover:bg-slate-50/80">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${item.color}`}>
                            <item.icon className="h-4 w-4" />
                          </span>
                          <span className="font-bold text-slate-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-slate-900 tabular-nums">
                        {item.total}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {item.published} Live
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {item.hidden > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                            {item.hidden} Hidden
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">0</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onNavigate(item.tab)}
                          className="btn-primary !py-1.5 !px-3 text-xs font-bold inline-flex items-center gap-1"
                        >
                          Manage <ChevronRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Visual Cards & Charts Grid */
          <div className="mt-4 sm:mt-5 grid gap-4 sm:gap-6 lg:grid-cols-3">
            <ChartCard
              title="Published vs hidden"
              hint="Live website status per content category"
              tableRows={analytics.contentRows.flatMap((row) => [
                { label: `${row.label} (Live)`, value: row.published },
                { label: `${row.label} (Hidden)`, value: row.hidden },
              ])}
              tableHeaders={["Category / State", "Count"]}
            >
              <StackedBars rows={analytics.contentRows} />
            </ChartCard>

            <ChartCard
              title="Courses by category"
              hint={`${analytics.counts.courses} courses across levels`}
              tableRows={analytics.byCategory.map((slice) => ({
                label: slice.label,
                value: slice.value,
              }))}
              tableHeaders={["Language Category", "Total Courses"]}
            >
              <BarList rows={analytics.byCategory} />
            </ChartCard>

            <ChartCard
              title="Ausbildung by field"
              hint={`${analytics.counts.apprenticeships} vocational tracks`}
              tableRows={analytics.fields.map((slice) => ({
                label: slice.label,
                value: slice.value,
              }))}
              tableHeaders={["Vocational Field", "Listings"]}
            >
              <BarList rows={analytics.fields} />
            </ChartCard>
          </div>
        )}
      </div>

      {/* --------------------------------------------------------- next steps */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Needs attention</h2>
            <span className="text-xs text-slate-400">System checks</span>
          </div>
          {analytics.attention.length === 0 ? (
            <p className="mt-3 sm:mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 sm:p-4 text-xs sm:text-sm font-semibold text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> Nothing outstanding - every enquiry is
              read and all content is published.
            </p>
          ) : (
            <ul className="mt-3 sm:mt-4 space-y-2">
              {analytics.attention.map((item) => (
                <li key={`${item.tab}-${item.text}`}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.tab)}
                    className="flex w-full items-center gap-2.5 sm:gap-3 rounded-xl border border-slate-200 px-3.5 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm transition hover:border-primary hover:bg-slate-50 active:scale-[0.99]"
                  >
                    <item.icon className="h-4 w-4 shrink-0 text-amber-600" />
                    <span className="text-slate-700 min-w-0 flex-1 truncate">
                      <span className="font-bold text-slate-900">{item.count}</span>{" "}
                      {item.count === 1 ? item.noun[0] : item.noun[1]} {item.text}
                    </span>
                    <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-300" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Direct Navigation</h2>
            <span className="text-xs text-slate-400">Jump to section</span>
          </div>
          <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: "German & Language Courses", tab: "courses" as AdminTab, icon: BookOpen },
              { label: "Study Destinations & Visas", tab: "countries" as AdminTab, icon: Globe },
              { label: "Ausbildung Dual Vocational", tab: "apprenticeships" as AdminTab, icon: Briefcase },
              { label: "Student Success Stories", tab: "stories" as AdminTab, icon: Award },
              { label: "Articles & News Hub", tab: "articles" as AdminTab, icon: FileText },
              { label: "Contact Enquiries", tab: "messages" as AdminTab, icon: MessageSquare },
            ].map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => onNavigate(action.tab)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-xs sm:text-sm font-bold text-slate-700 transition hover:border-primary hover:text-primary hover:bg-primary-50/50 active:scale-[0.99]"
              >
                <action.icon className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{action.label}</span>
                <ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-300 shrink-0" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
