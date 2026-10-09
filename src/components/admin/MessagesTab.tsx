import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Inbox,
  Mail,
  MailOpen,
  MessageSquare,
  Phone,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { mapSubmission } from "../../lib/mappers";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { errorMessage, formatDate, formatListDate, whatsappLink } from "../../lib/utils";
import { Thread, groupSubmissions } from "../../lib/threads";
import { ContactSubmission, Row } from "../../types";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { EmptyState } from "../ui/EmptyState";
import { FullPageLoader } from "../ui/Loader";

type StatusFilter = "all" | "unread" | "read";

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
];

const initial = (name: string) => name.trim().charAt(0).toUpperCase() || "?";

const preview = (message: string) => message.replace(/\s+/g, " ").trim();

interface PendingDelete {
  ids: string[];
  message: string;
}

interface MessagesTabProps {
  /** Lets the sidebar badge update the moment a conversation is opened. */
  onUnreadCountChange?: (count: number) => void;
  onBack?: () => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({ onUnreadCountChange, onBack }) => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [subject, setSubject] = useState("all");

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setSubmissions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(errorMessage(error, "Could not load contact submissions."));
      setSubmissions([]);
    } else {
      // Nothing is auto-opened: landing on the tab must not silently mark the
      // newest enquiry as read. Reading one is always a deliberate click.
      setSubmissions((data as Row[]).map(mapSubmission));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    onUnreadCountChange?.(submissions.filter((item) => !item.is_read).length);
  }, [submissions, onUnreadCountChange]);

  /** Optimistic read/unread for a set of messages, rolled back if the write fails. */
  const setReadMany = useCallback(async (ids: string[], read: boolean) => {
    if (!isSupabaseConfigured || ids.length === 0) return;
    const target = new Set(ids);

    setSubmissions((current) =>
      current.map((item) => (target.has(item.id) ? { ...item, is_read: read } : item))
    );

    const { error } = await supabase
      .from("contact_submissions")
      .update({ is_read: read })
      .in("id", ids);

    if (error) {
      setSubmissions((current) =>
        current.map((item) => (target.has(item.id) ? { ...item, is_read: !read } : item))
      );
      toast.error(errorMessage(error, "Could not update the messages."));
    }
  }, []);

  /** Opening a conversation marks every unread message in it as read. */
  const openThread = (thread: Thread) => {
    setSelectedKey(thread.key);
    const unreadIds = thread.messages.filter((item) => !item.is_read).map((item) => item.id);
    setReadMany(unreadIds, true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .in("id", pendingDelete.ids);
      if (error) throw error;
      toast.success(pendingDelete.ids.length === 1 ? "Message deleted." : "Conversation deleted.");
      setPendingDelete(null);
      setSelectedKey(null);
      await load();
    } catch (error) {
      toast.error(errorMessage(error, "Could not delete."));
    } finally {
      setDeleting(false);
    }
  };

  const threads = useMemo(() => groupSubmissions(submissions), [submissions]);

  const subjects = useMemo(
    () =>
      Array.from(
        new Set(submissions.map((item) => item.subject).filter((value): value is string => !!value))
      ).sort(),
    [submissions]
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return threads.filter((thread) => {
      if (status === "unread" && thread.unreadCount === 0) return false;
      if (status === "read" && thread.unreadCount > 0) return false;
      if (subject !== "all" && !thread.messages.some((item) => item.subject === subject)) {
        return false;
      }
      if (!needle) return true;

      // Search the whole conversation, not just its latest message.
      return thread.messages.some((item) =>
        [item.name, item.email, item.phone, item.subject, item.message]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle))
      );
    });
  }, [threads, query, status, subject]);

  // Selection survives filtering, so reading a thread does not close it under "Unread".
  const selected = threads.find((thread) => thread.key === selectedKey) ?? null;
  const unread = submissions.filter((item) => !item.is_read).length;

  if (loading) return <FullPageLoader label="Loading messages..." />;

  if (submissions.length === 0) {
    return (
      <EmptyState
        title="No messages yet"
        hint="Enquiries submitted through the About page contact form appear here."
        icon={<MessageSquare className="h-5 w-5" />}
      />
    );
  }

  return (
    <div>
      {/* Filters & Navigation toolbar */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              title="Back to Dashboard"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-primary hover:bg-primary-50 hover:text-primary active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <div className="relative flex-1 min-w-[140px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, phone or message..."
              aria-label="Search messages"
              className="input !py-1.5 sm:!py-2 !pl-9 text-xs sm:text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div
            role="group"
            aria-label="Filter by status"
            className="flex overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1 no-scrollbar w-full sm:w-auto"
          >
            {STATUS_FILTERS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setStatus(option.key)}
                aria-pressed={status === option.key}
                className={`flex-1 sm:flex-none whitespace-nowrap rounded-lg px-3 py-1 text-xs font-bold transition text-center ${
                  status === option.key
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {option.label}
                {option.key === "unread" && unread > 0 && (
                  <span className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[10px] font-black ${status === "unread" ? "bg-white text-primary" : "bg-accent text-white"}`}>
                    {unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {subjects.length > 0 && (
            <select
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              aria-label="Filter by subject"
              className="input !w-full sm:!w-auto !py-1.5 sm:!py-2 text-xs sm:text-sm font-semibold text-slate-700"
            >
              <option value="all">All subjects</option>
              {subjects.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Inbox: list beside the conversation on desktop, one at a time on phones */}
      <div className="mt-4 sm:mt-5 grid gap-4 sm:gap-5 lg:h-[calc(100vh-19rem)] lg:min-h-[28rem] lg:grid-cols-[19rem_1fr]">
        <div
          className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 ${
            selected ? "hidden lg:flex" : "flex"
          }`}
        >
          <p className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-500">
            {filtered.length} {filtered.length === 1 ? "conversation" : "conversations"}
          </p>

          {filtered.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-slate-400">
              Nothing matches these filters.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 overflow-y-auto">
              {filtered.map((thread) => {
                const isActive = thread.key === selectedKey;
                const hasUnread = thread.unreadCount > 0;
                return (
                  <li key={thread.key}>
                    <button
                      type="button"
                      onClick={() => openThread(thread)}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex w-full gap-3 p-3.5 text-left transition ${
                        isActive ? "bg-primary-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          hasUnread ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {initial(thread.name)}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span
                            className={`min-w-0 flex-1 truncate text-sm ${
                              hasUnread ? "font-bold text-slate-900" : "font-medium text-slate-700"
                            }`}
                          >
                            {thread.name}
                            {thread.messages.length > 1 && (
                              <span className="ml-1.5 font-normal text-slate-400">
                                ({thread.messages.length})
                              </span>
                            )}
                          </span>
                          <span className="shrink-0 text-[11px] text-slate-400">
                            {formatListDate(thread.latest.created_at)}
                          </span>
                        </span>

                        {thread.latest.subject && (
                          <span className="mt-1 block truncate text-xs font-semibold text-primary">
                            {thread.latest.subject}
                          </span>
                        )}
                        <span className="mt-0.5 block truncate text-xs text-slate-500">
                          {preview(thread.latest.message)}
                        </span>
                      </span>

                      {hasUnread && (
                        <span
                          aria-label={`${thread.unreadCount} unread`}
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div
          className={`overflow-hidden rounded-2xl border border-slate-200 ${
            selected ? "flex flex-col" : "hidden lg:flex lg:flex-col"
          }`}
        >
          {selected ? (
            <ThreadReader
              thread={selected}
              onBack={() => setSelectedKey(null)}
              onMarkUnread={() =>
                setReadMany(
                  selected.messages.map((item) => item.id),
                  false
                )
              }
              onDeleteThread={() =>
                setPendingDelete({
                  ids: selected.messages.map((item) => item.id),
                  message:
                    selected.messages.length === 1
                      ? `Delete the message from "${selected.name}"? This cannot be undone.`
                      : `Delete all ${selected.messages.length} messages from "${selected.name}"? This cannot be undone.`,
                })
              }
              onDeleteMessage={(item) =>
                setPendingDelete({
                  ids: [item.id],
                  message: `Delete this one message from "${selected.name}"? The rest of the conversation stays.`,
                })
              }
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center text-slate-400">
              <Inbox className="h-8 w-8" />
              <p className="text-sm font-medium">Select a conversation to read it.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete"
        message={pendingDelete?.message ?? ""}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ reader */

const ThreadReader: React.FC<{
  thread: Thread;
  onBack: () => void;
  onMarkUnread: () => void;
  onDeleteThread: () => void;
  onDeleteMessage: (item: ContactSubmission) => void;
}> = ({ thread, onBack, onMarkUnread, onDeleteThread, onDeleteMessage }) => {
  const firstName = thread.name.trim().split(/\s+/)[0] || "there";
  const email = thread.emails[thread.emails.length - 1] ?? "";
  const phone = thread.phones[thread.phones.length - 1] ?? null;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(
    `Re: ${thread.latest.subject || "Your enquiry"}`
  )}&body=${encodeURIComponent(`Hi ${firstName},\n\n`)}`;
  const whatsapp = whatsappLink(phone);

  return (
    <>
      <div className="border-b border-slate-200 p-5">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" /> Back to inbox
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
              {initial(thread.name)}
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-slate-900">{thread.name}</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {thread.messages.length}{" "}
                {thread.messages.length === 1 ? "message" : "messages"} · last on{" "}
                {formatDate(thread.latest.created_at)}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onMarkUnread}
              disabled={thread.unreadCount > 0}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Mark conversation as unread"
              title="Mark conversation as unread"
            >
              <MailOpen className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onDeleteThread}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-accent hover:text-accent"
              aria-label="Delete conversation"
              title="Delete conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Every address this person has used, since a thread can span more than one. */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
          {thread.emails.map((address) => (
            <a
              key={address}
              href={`mailto:${address}`}
              className="inline-flex items-center gap-1.5 text-slate-600 transition hover:text-primary"
            >
              <Mail className="h-3.5 w-3.5 text-slate-400" /> {address}
            </a>
          ))}
          {thread.phones.map((number) => (
            <a
              key={number}
              href={`tel:${number}`}
              className="inline-flex items-center gap-1.5 text-slate-600 transition hover:text-primary"
            >
              <Phone className="h-3.5 w-3.5 text-slate-400" /> {number}
            </a>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5">
        {thread.messages.map((item) => (
          <article
            key={item.id}
            className={`group rounded-2xl border bg-white p-4 ${
              item.is_read ? "border-slate-200" : "border-primary/40"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">{formatDate(item.created_at)}</span>
              {item.subject && (
                <span className="badge bg-primary-50 px-2 py-0.5 text-[11px] text-primary">
                  {item.subject}
                </span>
              )}
              {!item.is_read && (
                <span className="badge bg-accent px-2 py-0.5 text-[10px] text-white">New</span>
              )}
              {thread.messages.length > 1 && (
                <button
                  type="button"
                  onClick={() => onDeleteMessage(item)}
                  aria-label="Delete this message"
                  title="Delete this message"
                  className="ml-auto rounded-md p-1 text-slate-300 transition hover:text-accent group-hover:text-slate-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="mt-2.5 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {item.message}
            </p>
          </article>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 border-t border-slate-200 p-3.5 sm:p-4 bg-white">
        {email && (
          <a
            href={mailto}
            className="btn-primary !py-2.5 text-xs sm:text-sm flex-1 justify-center shadow-xs"
          >
            <Mail className="h-4 w-4" /> Reply by email
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="btn-ghost !py-2.5 text-xs sm:text-sm flex-1 justify-center border border-slate-200"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
        )}
        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost !py-2.5 text-xs sm:text-sm flex-1 justify-center border border-emerald-200 text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/80"
          >
            <MessageSquare className="h-4 w-4 text-emerald-600" /> WhatsApp
          </a>
        )}
      </div>
    </>
  );
};
