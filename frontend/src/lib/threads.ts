import { ContactSubmission } from "../types";

/**
 * Groups contact submissions into conversations, keyed on the sender's email.
 *
 * Email only - a shared phone number deliberately does NOT merge two enquiries.
 * One number often covers a family, an office or an agent, so matching on it
 * collapses genuinely different people into one thread. A different email means
 * a different conversation, full stop.
 */

export interface Thread {
  /** Stable across new arrivals: the id of the oldest message in the conversation. */
  key: string;
  name: string;
  emails: string[];
  phones: string[];
  /** Oldest first, so the reader shows the conversation in order. */
  messages: ContactSubmission[];
  latest: ContactSubmission;
  unreadCount: number;
}

const emailKey = (value: string | null | undefined): string | null => {
  const trimmed = (value ?? "").trim().toLowerCase();
  return trimmed || null;
};

const unique = (values: (string | null | undefined)[]): string[] =>
  Array.from(new Set(values.filter((value): value is string => !!value && value.trim() !== "")));

const time = (submission: ContactSubmission) => new Date(submission.created_at).getTime();

export function groupSubmissions(items: ContactSubmission[]): Thread[] {
  const groups = new Map<string, ContactSubmission[]>();

  items.forEach((item) => {
    const email = emailKey(item.email);
    // Without a usable email the message stands alone rather than risking a wrong merge.
    const key = email ?? `no-email:${item.id}`;
    const bucket = groups.get(key);
    if (bucket) bucket.push(item);
    else groups.set(key, [item]);
  });

  return Array.from(groups.values())
    .map<Thread>((messages) => {
      const sorted = [...messages].sort((a, b) => time(a) - time(b));
      const latest = sorted[sorted.length - 1];

      return {
        key: sorted[0].id,
        // The most recent spelling of their name wins.
        name: latest.name || sorted[0].name,
        emails: unique(sorted.map((item) => item.email)),
        phones: unique(sorted.map((item) => item.phone)),
        messages: sorted,
        latest,
        unreadCount: sorted.filter((item) => !item.is_read).length,
      };
    })
    .sort((a, b) => time(b.latest) - time(a.latest));
}
