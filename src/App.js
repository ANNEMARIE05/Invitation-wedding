import { useEffect, useState } from "react";
import "@/App.css";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { PhotosContext } from "@/lib/photos";
import { SettingsContext } from "@/lib/settings";
import { getPhotos, getSettings } from "@/lib/api";
import Nav from "@/components/invite/Nav";
import Hero from "@/components/invite/Hero";
import Marquee from "@/components/invite/Marquee";
import InviteCard from "@/components/invite/InviteCard";
import Story from "@/components/invite/Story";
import BigDay from "@/components/invite/BigDay";
import Program from "@/components/invite/Program";
import Venues from "@/components/invite/Venues";
import Gallery from "@/components/invite/Gallery";
import Rsvp from "@/components/invite/Rsvp";
import Guestbook from "@/components/invite/Guestbook";
import QrSection from "@/components/invite/QrSection";
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
            <BigDay />
            <Program />
            <Venues />
            <Gallery />
            <Rsvp />
            <Guestbook />
            <QrSection />
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
