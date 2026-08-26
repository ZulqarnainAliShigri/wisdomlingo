import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Code2, Globe, Info, Save, Search } from "lucide-react";
import { toast } from "react-toastify";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { errorMessage } from "../../lib/utils";
import { DEFAULT_SEO, SEO_PAGES, resolveSeo, useSeoSettings } from "../../hooks/useSeo";
import { SeoPageKey, SeoPageOverride, SeoSettings } from "../../types";
import { ImageUploadField } from "./ImageUploadField";
import { PageAudit } from "./PageAudit";
import { Spinner } from "../ui/Loader";

/** Google truncates around these lengths, so they are guidance, not hard limits. */
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;

const Counter: React.FC<{ value: string; max: number; min?: number }> = ({ value, max, min }) => {
  const length = value.trim().length;
  const tooLong = length > max;
  const tooShort = min !== undefined && length > 0 && length < min;

  return (
    <span
      className={`text-xs font-semibold tabular-nums ${
        tooLong ? "text-accent" : tooShort ? "text-amber-600" : "text-slate-400"
      }`}
    >
      {length}/{max}
      {tooLong && " - Google will cut this off"}
      {tooShort && " - a little short"}
    </span>
  );
};

/** What the result looks like on a Google search page. */
const SerpPreview: React.FC<{ url: string; title: string; description: string }> = ({
  url,
  title,
  description,
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <p className="truncate text-xs text-slate-600">{url || "https://your-domain.com"}</p>
    <p className="mt-0.5 truncate text-lg leading-snug text-[#1a0dab]">
      {title || "Your page title"}
    </p>
    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
      {description || "Your meta description shows here."}
    </p>
  </div>
);

export const SeoTab: React.FC = () => {
  const { settings, reload } = useSeoSettings();
  const [form, setForm] = useState<SeoSettings>(DEFAULT_SEO);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activePage, setActivePage] = useState<SeoPageKey>("home");

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const setField = <K extends keyof SeoSettings>(field: K, value: SeoSettings[K]) =>
    setForm((current) => ({ ...current, [field]: value }));

  const setPageField = (page: SeoPageKey, field: keyof SeoPageOverride, value: string | boolean) =>
    setForm((current) => ({
      ...current,
      pages: {
        ...current.pages,
        [page]: {
          title: "",
          description: "",
          ...(current.pages?.[page] ?? {}),
          [field]: value,
        },
      },
    }));

  const save = async () => {
    if (!isSupabaseConfigured) {
      toast.error("Supabase is not connected, so settings cannot be saved.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("seo_settings").upsert({
        id: true,
        site_name: form.site_name.trim(),
        site_url: form.site_url.trim().replace(/\/+$/, ""),
        title_template: form.title_template.trim() || "%s",
        default_description: form.default_description.trim(),
        keywords: form.keywords.trim(),
        og_image_url: form.og_image_url || null,
        twitter_handle: form.twitter_handle?.trim() || null,
        google_verification: form.google_verification?.trim() || null,
        pages: form.pages,
      });
      if (error) throw error;
      toast.success("SEO settings saved. The public pages pick them up on next load.");
      await reload();
    } catch (error) {
      toast.error(errorMessage(error, "Could not save the SEO settings."));
    } finally {
      setSaving(false);
    }
  };

  const page = SEO_PAGES.find((item) => item.key === activePage)!;
  const override = form.pages?.[activePage] ?? { title: "", description: "" };
  const resolved = resolveSeo(form, activePage);
  const base = form.site_url.trim().replace(/\/+$/, "");
  const previewUrl = base ? `${base}${page.path === "/" ? "" : page.path}` : "";

  /** Real, checkable things - not a promise about rankings. */
  const checks = useMemo(() => {
    const list: { ok: boolean; label: string; hint: string }[] = [];

    list.push({
      ok: Boolean(base),
      label: "Site URL is set",
      hint: "Needed for canonical links, og:url and the sitemap. Without it search engines can index duplicate URLs.",
    });
    list.push({
      ok: Boolean(form.google_verification?.trim()),
      label: "Google Search Console verified",
      hint: "Paste the verification code so you can submit your sitemap and see what you rank for.",
    });
    list.push({
      ok: Boolean(form.og_image_url),
      label: "Social share image set",
      hint: "The picture shown when someone shares a link on WhatsApp or Facebook. 1200x630 works best.",
    });

    const missingTitles = SEO_PAGES.filter((item) => !form.pages?.[item.key]?.title?.trim());
    list.push({
      ok: missingTitles.length === 0,
      label: "Every page has its own title",
      hint: missingTitles.length
        ? `Still using the site name: ${missingTitles.map((i) => i.label).join(", ")}.`
        : "All five pages have a unique title.",
    });

    const longTitles = SEO_PAGES.filter((item) => {
      const t = resolveSeo(form, item.key).title;
      return t.length > TITLE_MAX;
    });
    list.push({
      ok: longTitles.length === 0,
      label: `Titles fit in ${TITLE_MAX} characters`,
      hint: longTitles.length
        ? `Too long: ${longTitles.map((i) => i.label).join(", ")}.`
        : "Nothing will be truncated in results.",
    });

    const badDesc = SEO_PAGES.filter((item) => {
      const d = resolveSeo(form, item.key).description.trim();
      return d.length < DESC_MIN || d.length > DESC_MAX;
    });
    list.push({
      ok: badDesc.length === 0,
      label: `Descriptions are ${DESC_MIN}-${DESC_MAX} characters`,
      hint: badDesc.length
        ? `Outside the range: ${badDesc.map((i) => i.label).join(", ")}.`
        : "All five read well in a search result.",
    });

    const noindexed = SEO_PAGES.filter((item) => form.pages?.[item.key]?.noindex);
    list.push({
      ok: noindexed.length === 0,
      label: "No page is hidden from search",
      hint: noindexed.length
        ? `Set to noindex: ${noindexed.map((i) => i.label).join(", ")}.`
        : "Every page is indexable.",
    });

    return list;
  }, [form, base]);

  const passed = checks.filter((check) => check.ok).length;

  return (
    <div className="space-y-8">
      {/* What this can and cannot do */}
      <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="leading-relaxed">
          These settings control what Google reads about each page. They are the groundwork for
          ranking, not a guarantee of a position - that also depends on your content, reviews and
          links from other sites. The checklist below is the part you can actually control.
        </p>
      </div>

      {/* Checklist */}
      <section className="rounded-2xl border border-slate-200 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-900">SEO checklist</h2>
          <span className="text-sm font-semibold text-slate-500">
            {passed} of {checks.length} done
          </span>
        </div>
        <ul className="mt-4 space-y-2">
          {checks.map((check) => (
            <li
              key={check.label}
              className={`flex gap-3 rounded-xl border p-3.5 ${
                check.ok ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"
              }`}
            >
              {check.ok ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              )}
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-800">{check.label}</span>
                <span className="block text-xs text-slate-500">{check.hint}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Per-page titles and descriptions */}
      <section className="rounded-2xl border border-slate-200 p-5">
        <h2 className="text-base font-bold text-slate-900">Page titles &amp; descriptions</h2>
        <p className="mt-1 text-sm text-slate-500">
          This is what shows in a Google result. Write for the person searching, not the robot.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {SEO_PAGES.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActivePage(item.key)}
              aria-pressed={activePage === item.key}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                activePage === item.key
                  ? "bg-primary text-white"
                  : "border border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <label className="label mb-0" htmlFor="seo-page-title">
                  Page title
                </label>
                <Counter value={resolved.title} max={TITLE_MAX} />
              </div>
              <input
                id="seo-page-title"
                className="input mt-1.5"
                value={override.title ?? ""}
                onChange={(event) => setPageField(activePage, "title", event.target.value)}
                placeholder="German Language Academy & Study Abroad Consultancy"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Shown as: <span className="font-medium text-slate-600">{resolved.title}</span>
              </p>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-3">
                <label className="label mb-0" htmlFor="seo-page-desc">
                  Meta description
                </label>
                <Counter value={resolved.description} max={DESC_MAX} min={DESC_MIN} />
              </div>
              <textarea
                id="seo-page-desc"
                className="input mt-1.5 min-h-[110px] resize-y"
                value={override.description ?? ""}
                onChange={(event) => setPageField(activePage, "description", event.target.value)}
                placeholder="One or two sentences that make someone click."
              />
            </div>

            <div>
              <label className="label" htmlFor="seo-focus-keyword">
                Focus keyword
              </label>
              <input
                id="seo-focus-keyword"
                className="input"
                value={override.focusKeyword ?? ""}
                onChange={(event) => setPageField(activePage, "focusKeyword", event.target.value)}
                placeholder="german language course in islamabad"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                The phrase you want this page to rank for. One page, one phrase - two pages chasing
                the same one compete with each other.
              </p>
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-3.5">
              <input
                type="checkbox"
                checked={Boolean(override.noindex)}
                onChange={(event) => setPageField(activePage, "noindex", event.target.checked)}
                className="mt-0.5 h-4 w-4"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  Hide this page from search engines
                </span>
                <span className="block text-xs text-slate-500">
                  Only for pages you do not want found. Leave off for normal pages.
                </span>
              </span>
            </label>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Search className="h-3.5 w-3.5" /> Google preview
            </p>
            <SerpPreview
              url={previewUrl}
              title={resolved.title}
              description={resolved.description}
            />
            <p className="mt-3 text-xs text-slate-400">
              Google often rewrites descriptions to match the search. Treat this as a guide.
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <PageAudit
            path={page.path}
            keyword={override.focusKeyword ?? ""}
            title={resolved.title}
            description={resolved.description}
          />
        </div>
      </section>

      {/* Site-wide */}
      <section className="rounded-2xl border border-slate-200 p-5">
        <h2 className="text-base font-bold text-slate-900">Site-wide settings</h2>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="seo-site-name">
              Site name
            </label>
            <input
              id="seo-site-name"
              className="input"
              value={form.site_name}
              onChange={(event) => setField("site_name", event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="seo-site-url">
              Site URL
            </label>
            <input
              id="seo-site-url"
              className="input"
              value={form.site_url}
              onChange={(event) => setField("site_url", event.target.value)}
              placeholder="https://wisdomlingo.com"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Your live domain, no trailing slash. Used for canonical links and social previews.
            </p>
          </div>

          <div>
            <label className="label" htmlFor="seo-template">
              Title template
            </label>
            <input
              id="seo-template"
              className="input"
              value={form.title_template}
              onChange={(event) => setField("title_template", event.target.value)}
              placeholder="%s | WisdomLingo"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              <code>%s</code> is replaced by the page title above.
            </p>
          </div>

          <div>
            <label className="label" htmlFor="seo-verification">
              Google Search Console code
            </label>
            <input
              id="seo-verification"
              className="input"
              value={form.google_verification ?? ""}
              onChange={(event) => setField("google_verification", event.target.value)}
              placeholder="Paste the content= value from the HTML tag method"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="seo-default-desc">
              Fallback description
            </label>
            <textarea
              id="seo-default-desc"
              className="input min-h-[90px] resize-y"
              value={form.default_description}
              onChange={(event) => setField("default_description", event.target.value)}
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Used for any page whose own description is left blank.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="seo-keywords">
              Keywords
            </label>
            <input
              id="seo-keywords"
              className="input"
              value={form.keywords}
              onChange={(event) => setField("keywords", event.target.value)}
              placeholder="German language course, Ausbildung, study abroad"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Google has ignored this tag since 2009. Harmless to keep, but it will not affect your
              ranking - your page titles and content do that.
            </p>
          </div>

          <div>
            <ImageUploadField
              value={form.og_image_url ?? ""}
              onChange={(url) => setField("og_image_url", url || null)}
              folder="seo"
              label="Social share image (1200x630)"
              onUploadingChange={setUploading}
            />
          </div>

          <div>
            <label className="label" htmlFor="seo-twitter">
              Twitter / X handle
            </label>
            <input
              id="seo-twitter"
              className="input"
              value={form.twitter_handle ?? ""}
              onChange={(event) => setField("twitter_handle", event.target.value)}
              placeholder="@wisdomlingo"
            />
          </div>
        </div>
      </section>


      {/* Technical SEO - what the build already does for you */}
      <section className="rounded-2xl border border-slate-200 p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Code2 className="h-4 w-4 text-primary" /> Technical SEO (handled at build time)
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          These run automatically on <code className="rounded bg-slate-100 px-1.5 py-0.5">npm run build</code>,
          using the values above. Rebuild and redeploy after changing anything on this page.
        </p>

        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {[
            [
              "A real HTML file per page",
              "This is a single-page app, so every route would otherwise ship the same title and description. The build writes /courses/index.html, /about/index.html and so on with their own tags baked in - which is what WhatsApp, Facebook and LinkedIn read, since those crawlers do not run JavaScript.",
            ],
            [
              "LocalBusiness + WebSite structured data",
              "Your address, phone, opening hours and map link, in the markup on every page. This is what feeds the business panel in Google.",
            ],
            [
              "Breadcrumbs",
              "Each inner page declares its trail, so results show Home > Courses instead of a bare URL.",
            ],
            [
              "Course rich results",
              "Every course you publish is described with its level, duration and fee. A price is only published when it is a single clear amount - ranges and per-month fees are left out rather than guessed at.",
            ],
            [
              "sitemap.xml and robots.txt",
              "Regenerated from your site URL, with any page you marked noindex left out of the sitemap.",
            ],
          ].map(([title, detail]) => (
            <li key={title} className="flex gap-3 rounded-xl border border-slate-200 p-3.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                <span className="block font-semibold text-slate-900">{title}</span>
                <span className="block text-xs leading-relaxed text-slate-500">{detail}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={
              base
                ? `https://search.google.com/test/rich-results?url=${encodeURIComponent(base)}`
                : "https://search.google.com/test/rich-results"
            }
            target="_blank"
            rel="noreferrer"
            className="btn-ghost !py-2.5 text-sm"
          >
            Test rich results
          </a>
          <a
            href={
              base
                ? `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(base)}`
                : "https://pagespeed.web.dev/"
            }
            target="_blank"
            rel="noreferrer"
            className="btn-ghost !py-2.5 text-sm"
          >
            Check Core Web Vitals
          </a>
        </div>

        <p className="mt-4 rounded-xl bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-900">
          <strong>One thing this cannot fix:</strong> reviews. Google will not show star ratings
          unless they are real and verifiable, and marking up invented ones risks a manual penalty -
          so no review markup is emitted. Collect genuine reviews on your Google Business Profile
          instead; for a local consultancy that moves rankings more than anything on this page.
        </p>
      </section>

      {/* Sitemap reminder */}
      <section className="rounded-2xl border border-slate-200 p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Globe className="h-4 w-4 text-primary" /> Next steps outside this dashboard
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
          <li>
            Verify the site in{" "}
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary underline"
            >
              Google Search Console
            </a>{" "}
            using the code field above.
          </li>
          <li>
            Submit your sitemap:{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5">
              {base ? `${base}/sitemap.xml` : "https://your-domain.com/sitemap.xml"}
            </code>
          </li>
          <li>
            Claim and fill in your{" "}
            <a
              href="https://business.google.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary underline"
            >
              Google Business Profile
            </a>{" "}
            - for a local consultancy this drives more enquiries than anything on this page.
          </li>
          <li>Ask happy students for Google reviews. Reviews move local rankings more than tags.</li>
        </ol>
      </section>

      <div className="sticky bottom-0 -mx-5 border-t border-slate-200 bg-white px-5 py-4 sm:-mx-7 sm:px-7">
        <button
          type="button"
          onClick={save}
          disabled={saving || uploading}
          className="btn-primary w-full sm:w-auto"
        >
          {saving ? <Spinner /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save SEO settings"}
        </button>
      </div>
    </div>
  );
};
