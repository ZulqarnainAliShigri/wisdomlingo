import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Globe,
  ImageOff,
  Mail,
  MessageSquare,
  Plus,
} from "lucide-react";
import { toast } from "react-toastify";
import { SEED_APPRENTICESHIPS, SEED_COUNTRIES, SEED_COURSES } from "../../data/seed";
import { CATEGORY_TABS } from "../../data/content";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { errorMessage, formatDate } from "../../lib/utils";
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
  messages: ContactSubmission[];
}

const EMPTY_DATA: DashboardData = {
  courses: [],
  countries: [],
  apprenticeships: [],
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

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setData(demoData());
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [courses, countries, apprenticeships, submissions] = await Promise.all([
        supabase.from("courses").select("id, category, is_active, image_url"),
        supabase.from("study_countries").select("id, is_active"),
        supabase.from("apprenticeships").select("id, is_active, field"),
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      ]);

      const firstError =
        courses.error || countries.error || apprenticeships.error || submissions.error;
      if (firstError) throw firstError;

      setData({
        courses: ((courses.data as Row[]) || []).map((row) => ({
          id: String(row.id),
          category: row.category ?? "",
          is_active: row.is_active !== false,
          image_url: row.image_url ?? null,
        })),
        countries: ((countries.data as Row[]) || []).map((row) => ({
          id: String(row.id),
          is_active: row.is_active !== false,
        })),
        apprenticeships: ((apprenticeships.data as Row[]) || []).map((row) => ({
          id: String(row.id),
          is_active: row.is_active !== false,
          field: row.field ?? null,
        })),
        messages: ((submissions.data as Row[]) || []).map(toMessage),
      });
    } catch (error) {
      toast.error(errorMessage(error, "Could not load the dashboard summary."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const analytics = useMemo(() => {
    const { courses, countries, apprenticeships, messages } = data;
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

    const periodTotal = buckets.reduce((sum, bucket) => sum + bucket.value, 0);
    const previousTotal = countInPreviousWindow(buckets, dates);

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
          label: "Apprenticeships",
          published: apprenticeships.length - hiddenApprenticeships.length,
          hidden: hiddenApprenticeships.length,
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
          noun: ["apprenticeship", "apprenticeships"] as const,
          tab: "apprenticeships" as AdminTab,
        },
      ].filter((item) => item.count > 0),
      counts: {
        courses: courses.length,
        hiddenCourses: hiddenCourses.length,
        countries: countries.length,
        apprenticeships: apprenticeships.length,
      },
    };
  }, [data, range, prefs.staleAfterDays]);

  if (loading) return <FullPageLoader label="Loading summary..." />;

  const activeRange = RANGES.find((item) => item.key === range) ?? RANGES[0];

  const quickActions: { label: string; tab: AdminTab }[] = [
    { label: "Add a course", tab: "courses" },
    { label: "Add a destination", tab: "countries" },
    { label: "Add an apprenticeship", tab: "apprenticeships" },
  ];

  return (
    <div className="space-y-8">
      {/* ---------------------------------------------------------- enquiries */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Enquiries</h2>
            <p className="text-xs text-slate-500">
              Everything in this section covers the last {activeRange.label.toLowerCase()}.
            </p>
          </div>
          <div
            role="group"
            aria-label="Date range"
            className="inline-flex rounded-lg border border-slate-200 bg-white p-1"
          >
            {RANGES.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setRange(option.key)}
                aria-pressed={range === option.key}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  range === option.key
                    ? "bg-primary text-white"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-3">
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
            tableHeaders={["Period", "Enquiries"]}
          >
            <ColumnChart buckets={analytics.buckets} />
          </ChartCard>

          <ChartCard title="Reply status" hint="Across every enquiry ever received">
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
            tableHeaders={["Subject", "Enquiries"]}
          >
            <BarList
              rows={analytics.subjects}
              emptyLabel={`No enquiries in the last ${activeRange.label.toLowerCase()}.`}
            />
          </ChartCard>

          <section className="rounded-2xl border border-slate-200 p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Recent enquiries</h2>
              <button
                type="button"
                onClick={() => onNavigate("messages")}
                className="inline-flex items-center gap-1 text-sm font-bold text-primary transition hover:gap-2"
              >
                View all <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4">
              {analytics.recent.length === 0 ? (
                <EmptyState
                  title="No enquiries yet"
                  hint="Messages from the About page contact form appear here."
                  icon={<MessageSquare className="h-5 w-5" />}
                />
              ) : (
                <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
                  {analytics.recent.map((message) => (
                    <li key={message.id}>
                      <button
                        type="button"
                        onClick={() => onNavigate("messages")}
                        className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-slate-50"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <Mail className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900">{message.name}</span>
                            {!message.is_read && (
                              <span className="badge bg-accent px-2 py-0.5 text-[10px] text-white">
                                New
                              </span>
                            )}
                          </span>
                          <span className="block truncate text-xs text-slate-500">
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
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Content</h2>
          <p className="text-xs text-slate-500">
            What is published on the website right now. Not affected by the date range.
          </p>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          <ChartCard
            title="Published vs hidden"
            hint="Hidden items stay in the dashboard but are not shown on the website"
            tableRows={analytics.contentRows.flatMap((row) => [
              { label: `${row.label} - published`, value: row.published },
              { label: `${row.label} - hidden`, value: row.hidden },
            ])}
            tableHeaders={["Content", "Items"]}
          >
            <StackedBars rows={analytics.contentRows} />
          </ChartCard>

          <ChartCard
            title="Courses by category"
            hint={`${analytics.counts.courses} courses in total`}
            tableRows={analytics.byCategory.map((slice) => ({
              label: slice.label,
              value: slice.value,
            }))}
            tableHeaders={["Category", "Courses"]}
          >
            <BarList rows={analytics.byCategory} />
          </ChartCard>

          <ChartCard
            title="Apprenticeships by field"
            hint={`${analytics.counts.apprenticeships} training fields`}
            tableRows={analytics.fields.map((slice) => ({
              label: slice.label,
              value: slice.value,
            }))}
            tableHeaders={["Field", "Listings"]}
          >
            <BarList rows={analytics.fields} />
          </ChartCard>
        </div>
      </div>

      {/* --------------------------------------------------------- next steps */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 p-5">
          <h2 className="text-base font-bold text-slate-900">Needs attention</h2>
          {analytics.attention.length === 0 ? (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0" /> Nothing outstanding - every enquiry is
              read and all content is published.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {analytics.attention.map((item) => (
                <li key={`${item.tab}-${item.text}`}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.tab)}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm transition hover:border-primary hover:bg-slate-50"
                  >
                    <item.icon className="h-4 w-4 shrink-0 text-amber-600" />
                    <span className="text-slate-700">
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

        <section className="rounded-2xl border border-slate-200 p-5">
          <h2 className="text-base font-bold text-slate-900">Quick actions</h2>
          <div className="mt-4 space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => onNavigate(action.tab)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
              >
                <Plus className="h-4 w-4" /> {action.label}
                <ChevronRight className="ml-auto h-4 w-4 text-slate-300" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
