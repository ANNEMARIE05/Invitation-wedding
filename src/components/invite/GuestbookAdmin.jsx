import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Feather, Search } from "lucide-react";
import { getGuestbook } from "@/lib/api";
import { useStoreSync } from "@/lib/useStoreSync";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import CoupleBackofficeLayout from "@/components/invite/CoupleBackofficeLayout";
import { WeddingLoader } from "@/components/invite/WeddingLoader";

const PAGE_SIZE = 8;

function isPlaceholderGuestbookEntry(row) {
  /* entrée vide = non affichée */
  return !String(row?.message || "").trim();
}

const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

function GuestbookListItem({ row, index, formatDate }) {
  return (
    <li className="backoffice-rsvp-row" data-testid={`guestbook-admin-row-${index}`}>
      <div className="backoffice-rsvp-row__head">
        <p className="backoffice-rsvp-row__name">{row.nom}</p>
        <div className="backoffice-rsvp-row__badges" aria-hidden>
          <Feather size={16} className="text-wedding-wine-accent/70" strokeWidth={1.5} />
        </div>
      </div>
      <div className="backoffice-rsvp-row__meta">
        <time className="backoffice-rsvp-row__date tabular-nums" dateTime={row.created_at}>
          {formatDate(row.created_at)}
        </time>
      </div>
      <p className="backoffice-rsvp-row__message font-display italic leading-relaxed">
        « {row.message} »
      </p>
    </li>
  );
}

export default function GuestbookAdmin() {
  const { m } = useI18n();
  const t = m.coupleSpace.guestbookAdmin;
  const { locale } = useSettings();
  const locTag = locale === "en" ? "en-GB" : "fr-FR";

  const formatDate = useCallback(
    (iso) =>
      new Date(iso).toLocaleDateString(locTag, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locTag],
  );

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");

  const reload = useCallback(() => {
    setLoading(true);
    getGuestbook()
      .then((rows) => {
        const list = (Array.isArray(rows) ? rows : []).filter((r) => !isPlaceholderGuestbookEntry(r));
        setMessages(list);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useStoreSync("guestbook", reload);

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return messages;
    return messages.filter((r) => norm(`${r.nom} ${r.message}`).includes(q));
  }, [messages, query]);

  useEffect(() => {
    setPage(0);
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <CoupleBackofficeLayout
      panel={{
        testId: "guestbook-admin",
        wide: true,
        eyebrow: t.eyebrow,
        title: t.title,
        subtitle: t.subtitle,
        intro: t.intro,
      }}
    >
      <div className="backoffice-rsvp w-full">
        <div className="backoffice-section" data-testid="guestbook-admin-filters">
          <label className="block min-w-0">
            <span className="backoffice-label">{t.searchLabel}</span>
            <div className="relative mt-1.5">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-wedding-wine-deep/40"
                strokeWidth={1.5}
                aria-hidden
              />
              <input
                type="search"
                data-testid="guestbook-admin-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPh}
                className="backoffice-field w-full py-2.5 pl-10"
              />
            </div>
          </label>
        </div>

        <section className="mt-6" aria-labelledby="guestbook-admin-list-heading">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <h2 id="guestbook-admin-list-heading" className="couple-classic-card__legend mb-0">
              {t.listHeading}
            </h2>
            <p className="backoffice-hint tabular-nums">
              {loading ? "…" : (
                <>
                  <span className="font-semibold text-wedding-wine-deep">{filtered.length}</span>
                  {" / "}
                  {t.count(messages.length)}
                </>
              )}
            </p>
          </div>

          <div className="backoffice-rsvp-list" data-testid="guestbook-admin-list">
            {loading && <WeddingLoader compact label={t.loadingList} />}
            {!loading && messages.length === 0 && (
              <p className="backoffice-rsvp-list__empty font-display italic" data-testid="guestbook-admin-empty">
                {t.empty}
              </p>
            )}
            {!loading && messages.length > 0 && filtered.length === 0 && (
              <p className="backoffice-rsvp-list__empty" data-testid="guestbook-admin-no-match">
                {t.noMatch}
              </p>
            )}
            {!loading && filtered.length > 0 && (
              <ul className="space-y-3">
                {pageRows.map((row, i) => (
                  <GuestbookListItem
                    key={row.id ?? `${row.nom}-${row.created_at}-${i}`}
                    row={row}
                    index={i}
                    formatDate={formatDate}
                  />
                ))}
              </ul>
            )}
          </div>

          {!loading && filtered.length > PAGE_SIZE && (
            <nav
              className="mt-5 flex flex-wrap items-center justify-between gap-3"
              aria-label="Pagination"
              data-testid="guestbook-admin-pagination"
            >
              <p className="backoffice-hint tabular-nums">{t.page(safePage + 1, pageCount)}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="guestbook-admin-prev-page"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={safePage === 0}
                  className="backoffice-rsvp-page-btn"
                >
                  <ChevronLeft size={16} aria-hidden />
                  {t.prev}
                </button>
                <button
                  type="button"
                  data-testid="guestbook-admin-next-page"
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={safePage >= pageCount - 1}
                  className="backoffice-rsvp-page-btn"
                >
                  {t.next}
                  <ChevronRight size={16} aria-hidden />
                </button>
              </div>
            </nav>
          )}
        </section>
      </div>
    </CoupleBackofficeLayout>
  );
}
