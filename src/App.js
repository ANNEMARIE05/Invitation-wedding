import { useEffect, useState } from "react";
import "@/App.css";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
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
import { ensureStoreReady } from "@/lib/storage";

/** Paramètres partagés (espace mariés & pages admin hors invitation). */
function SharedSettings({ children }) {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    ensureStoreReady();
  }, []);
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
  const { bride, groom, venue } = useSettings();
  const { m } = useI18n();
  return (
    <Seo
      title={m.seo.title(bride, groom)}
      siteName={`${bride} & ${groom}`}
      description={m.seo.description(bride, groom)}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Event",
        name: m.seo.eventName(bride, groom),
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

  useEffect(() => {
    ensureStoreReady();
    getPhotos().then(setPhotos).catch(() => {});
    getSettings().then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    const loadSettings = () => getSettings().then(setSettings).catch(() => {});
    window.addEventListener(SETTINGS_CHANGE_EVENT, loadSettings);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, loadSettings);
  }, []);

  useStoreSync(["settings", "photos"], () => {
    getPhotos().then(setPhotos).catch(() => {});
    getSettings().then(setSettings).catch(() => {});
  });

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
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
    if (opened) window.__lenis?.start();
    else window.__lenis?.stop();
  }, [opened]);

  return (
    <SettingsContext.Provider value={settings}>
      <PhotosContext.Provider value={photos}>
        <div className="page-flow relative text-[#2A050B] antialiased overflow-x-clip">
          <InvitationSeo />
          <div className="grain-overlay" />
          {!opened && <LangToggle floating />}
          <WeddingPetals active={opened} density={24} />
          <AnimatePresence>
            {!opened && <IntroGate onOpen={() => setOpened(true)} />}
          </AnimatePresence>
          {opened && <Nav />}
          <main>
            <Hero start={opened} />
            <Marquee />
            <InviteCard />
            <Verses />
            <TornDivider top="#FFF0F4" bottom="#5C0A20" />
            <BigDay />
            <TornDivider top="#5C0A20" bottom="#FFE0EA" />
            <Program />
            <TornDivider top="#FFE0EA" bottom="#FFF0F4" />
            <Venues />
            <Tenues />
            <TornDivider top="#FFE0EA" bottom="#5C0A20" />
            <Rsvp />
            <TornDivider top="#5C0A20" bottom="#FFE0EA" />
            <Guestbook />
            <TornDivider top="#FFE0EA" bottom="#5C0A20" />
          </main>
          <Footer />
          <MusicPlayer opened={opened} />
          <BackToTop />
        </div>
      </PhotosContext.Provider>
    </SettingsContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LocaleProvider>
        <SharedSettings>
          <Routes>
            <Route path="/" element={<Invitation />} />
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
  );
}
