import { useEffect, useState } from "react";
import "@/App.css";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { PhotosContext } from "@/lib/photos";
import { SettingsContext } from "@/lib/settings";
import { getPhotos, getSettings } from "@/lib/api";
import Seo from "@/components/Seo";
import Nav from "@/components/invite/Nav";
import Hero from "@/components/invite/Hero";
import Marquee from "@/components/invite/Marquee";
import InviteCard from "@/components/invite/InviteCard";
import Story from "@/components/invite/Story";
import BigDay from "@/components/invite/BigDay";
import Program from "@/components/invite/Program";
import Venues from "@/components/invite/Venues";
import Tenues from "@/components/invite/Tenues";
import QrSection from "@/components/invite/QrSection";
import TornDivider from "@/components/invite/TornDivider";
import Rsvp from "@/components/invite/Rsvp";
import Guestbook from "@/components/invite/Guestbook";
import Footer from "@/components/invite/Footer";
import IntroGate from "@/components/invite/IntroGate";
import MusicPlayer from "@/components/invite/MusicPlayer";
import BackToTop from "@/components/invite/BackToTop";
import RsvpDashboard from "@/components/invite/RsvpDashboard";
import PhotosAdmin from "@/components/invite/PhotosAdmin";
import InfosAdmin from "@/components/invite/InfosAdmin";

function Invitation() {
  const [opened, setOpened] = useState(false);
  const [photos, setPhotos] = useState({});
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getPhotos().then(setPhotos).catch(() => {});
    getSettings().then(setSettings).catch(() => {});
  }, []);

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
        <div className="bg-[#FAF7F2] text-[#1C1617] antialiased overflow-x-clip">
          <Seo
            title="Éléonore & Augustin — Mariage"
            siteName="Éléonore & Augustin"
            description="Invitation de mariage d'Éléonore & Augustin — 24 octobre 2026 au Château de Deauville. Programme, lieux, tenues & pagnes, confirmation de présence."
            jsonLd={{
              "@context": "https://schema.org",
              "@type": "Event",
              name: "Mariage d'Éléonore & Augustin",
              startDate: "2026-10-24T15:30:00+02:00",
              eventStatus: "https://schema.org/EventScheduled",
              location: {
                "@type": "Place",
                name: "Château de Deauville",
                address: "Route des Jardins, 14800 Deauville — Normandie",
              },
              description:
                "Invitation au mariage d'Éléonore & Augustin — programme, lieux, tenues & pagnes, confirmation de présence.",
            }}
          />
          <div className="grain-overlay" />
          <AnimatePresence>
            {!opened && <IntroGate onOpen={() => setOpened(true)} />}
          </AnimatePresence>
          <Nav />
          <main>
            <Hero start={opened} />
            <Marquee />
            <InviteCard />
            <Story />
            <TornDivider top="#FAF7F2" bottom="#3B0910" />
            <BigDay />
            <TornDivider top="#2A050B" bottom="#F3ECE2" />
            <Program />
            <TornDivider top="#F3ECE2" bottom="#FAF7F2" />
            <Venues />
            <Tenues />
            <QrSection />
            <TornDivider top="#F3ECE2" bottom="#3B0910" />
            <Rsvp />
            <TornDivider top="#2A050B" bottom="#F3ECE2" />
            <Guestbook />
            <TornDivider top="#F3ECE2" bottom="#2A050B" />
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
      <Routes>
        <Route path="/" element={<Invitation />} />
        <Route path="/reponses" element={<RsvpDashboard />} />
        <Route path="/photos" element={<PhotosAdmin />} />
        <Route path="/infos" element={<InfosAdmin />} />
      </Routes>
      <Toaster position="bottom-center" richColors />
    </BrowserRouter>
  );
}
