import { useEffect, useState } from "react";
import "@/App.css";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { PhotosContext } from "@/lib/photos";
import { SettingsContext } from "@/lib/settings";
import { LocaleProvider, useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import { getPhotos, getSettings } from "@/lib/api";
import Seo from "@/components/Seo";
import Nav from "@/components/invite/Nav";
import LangToggle from "@/components/invite/LangToggle";
import Hero from "@/components/invite/Hero";
import Marquee from "@/components/invite/Marquee";
import InviteCard from "@/components/invite/InviteCard";
import Verses from "@/components/invite/Verses";
import BigDay from "@/components/invite/BigDay";
import Program from "@/components/invite/Program";
import Venues from "@/components/invite/Venues";
import Tenues from "@/components/invite/Tenues";
import TornDivider from "@/components/invite/TornDivider";
import Rsvp from "@/components/invite/Rsvp";
import Cadeaux from "@/components/invite/Cadeaux";
import Guestbook from "@/components/invite/Guestbook";
import Footer from "@/components/invite/Footer";
import IntroGate from "@/components/invite/IntroGate";
import WeddingPetals from "@/components/invite/WeddingPetals";
import MusicPlayer from "@/components/invite/MusicPlayer";
import BackToTop from "@/components/invite/BackToTop";
import RsvpDashboard from "@/components/invite/RsvpDashboard";
import PhotosAdmin from "@/components/invite/PhotosAdmin";
import InfosAdmin from "@/components/invite/InfosAdmin";
import CoupleSpace from "@/components/invite/CoupleSpace";
import RequireCoupleAuth from "@/components/invite/RequireCoupleAuth";
import { SETTINGS_CHANGE_EVENT } from "@/lib/invite-defaults";
import { useStoreSync } from "@/lib/useStoreSync";
import ThemeApplier from "@/components/invite/ThemeApplier";
import PersonalInviteCard from "@/components/invite/PersonalInviteCard";
import ModernFluidMeshBackground from "@/components/invite/ModernFluidMeshBackground";

function PersonalCardPreview() {
  const [testNom, setTestNom] = useState("Papa");
  const [testAcc, setTestAcc] = useState(0);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#3a0a16] p-4 py-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hero-atmosphere opacity-90" aria-hidden="true" />
      <ModernFluidMeshBackground />
      <div className="relative z-10 mb-4 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => { setTestNom("Papa"); setTestAcc(0); }}
          className="rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-white/30"
        >
          Tester avec : Papa (1 pers.)
        </button>
        <button
          type="button"
          onClick={() => { setTestNom("Agbonou Kossiwa Anne Marie"); setTestAcc(1); }}
          className="rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-white/30"
        >
          Tester avec : Nom complet (2 pers.)
        </button>
      </div>
      <PersonalInviteCard guest={{ nom: testNom, accompagnants: testAcc }} />
    </div>
  );
}

/** Paramètres partagés (espace mariés & pages admin hors invitation). */
function SharedSettings({ children }) {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    const load = () => getSettings().then(setSettings).catch(() => {});
    load();
    window.addEventListener(SETTINGS_CHANGE_EVENT, load);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, load);
  }, []);
  useStoreSync("settings", () => {
    getSettings().then(setSettings).catch(() => {});
  });
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

function InvitationSeo() {
  const { groom, bride, venue, coupleLabel } = useSettings();
  const { m } = useI18n();
  return (
    <Seo
      title={m.seo.title(groom, bride)}
      siteName={coupleLabel}
      description={m.seo.description(groom, bride)}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Event",
        name: m.seo.eventName(groom, bride),
        startDate: "2026-12-04T13:30:00+00:00",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: venue.name,
          address: venue.address,
        },
        description: m.seo.eventDescription,
      }}
    />
  );
}

function Invitation() {
  const [opened, setOpened] = useState(false);
  const [photos, setPhotos] = useState({});
  const [settings, setSettings] = useState(null);

  const loadPhotos = () =>
    getPhotos()
      .then((data) => setPhotos(data && typeof data === "object" && !Array.isArray(data) ? data : {}))
      .catch(() => setPhotos({}));

  useEffect(() => {
    loadPhotos();
    getSettings().then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    const loadSettings = () => getSettings().then(setSettings).catch(() => {});
    window.addEventListener(SETTINGS_CHANGE_EVENT, loadSettings);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, loadSettings);
  }, []);

  useStoreSync(["settings", "photos"], () => {
    loadPhotos();
    getSettings().then(setSettings).catch(() => {});
  });

  useEffect(() => {
    // Sur appareils tactiles (smartphones), préserver le défilement fluide natif du navigateur pour éviter les secousses
    const isTouch = typeof window !== "undefined" && (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);
    if (isTouch) {
      window.__lenis = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.15,
    });
    window.__lenis = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    if (opened) {
      window.scrollTo(0, 0);
      window.__lenis?.start();
      const kickMotionObservers = () => {
        window.__lenis?.resize();
        window.dispatchEvent(new Event("resize"));
        window.dispatchEvent(new Event("scroll"));
      };
      requestAnimationFrame(() => requestAnimationFrame(kickMotionObservers));
      const t = window.setTimeout(kickMotionObservers, 150);
      return () => window.clearTimeout(t);
    }
    window.__lenis?.stop();
  }, [opened]);

  return (
    <SettingsContext.Provider value={settings}>
      <PhotosContext.Provider value={photos}>
        <div className="page-flow invite-surface relative text-wedding-wine antialiased overflow-x-clip">
          <InvitationSeo />
          <div className="grain-overlay" />
          <ModernFluidMeshBackground />
          {!opened && <LangToggle floating />}
          <WeddingPetals active={opened} density={24} />
          <AnimatePresence>
            {!opened && <IntroGate onOpen={() => setOpened(true)} />}
          </AnimatePresence>
          {opened && <Nav />}
          {opened ? (
            <div className="invite-content-live" data-motion-root>
              <main>
                <Hero start />
                <Marquee />
                <InviteCard />
                <Verses />
                <TornDivider top="var(--ivory)" bottom="var(--wine-deep)" />
                <BigDay />
                <TornDivider top="var(--wine-deep)" bottom="var(--ivory-deep)" />
                <Program />
                <TornDivider top="var(--ivory-deep)" bottom="var(--ivory)" />
                <Venues />
                <Tenues />
                <TornDivider top="var(--ivory-deep)" bottom="var(--wine-deep)" />
                <Rsvp />
                <TornDivider top="var(--wine-deep)" bottom="var(--ivory-deep)" />
                <Cadeaux />
                <TornDivider top="var(--ivory-deep)" bottom="var(--ivory)" />
                <Guestbook />
                <TornDivider top="var(--ivory-deep)" bottom="var(--wine-deep)" />
              </main>
              <Footer />
            </div>
          ) : null}
          <MusicPlayer opened={opened} />
          <BackToTop />
        </div>
      </PhotosContext.Provider>
    </SettingsContext.Provider>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="never">
      <BrowserRouter>
        <LocaleProvider>
          <ThemeApplier />
          <SharedSettings>
            <Routes>
              <Route path="/" element={<Invitation />} />
              <Route path="/preview-carte" element={<PersonalCardPreview />} />
              <Route path="/espace-maries" element={<CoupleSpace />} />
              <Route
                path="/reponses"
                element={
                  <RequireCoupleAuth>
                    <RsvpDashboard />
                  </RequireCoupleAuth>
                }
              />
              <Route
                path="/photos"
                element={
                  <RequireCoupleAuth>
                    <PhotosAdmin />
                  </RequireCoupleAuth>
                }
              />
              <Route
                path="/infos"
                element={
                  <RequireCoupleAuth>
                    <InfosAdmin />
                  </RequireCoupleAuth>
                }
              />
            </Routes>
          </SharedSettings>
          <Toaster position="bottom-center" richColors />
        </LocaleProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}
