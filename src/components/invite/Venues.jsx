import { motion } from "framer-motion";
import { MapPin, Navigation, BedDouble, Bus } from "lucide-react";
import { EASE, IMAGES } from "@/lib/invite-data";
import { usePhoto } from "@/lib/photos";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";

export default function Venues() {
  const { venue } = useSettings();
  const venueImg = usePhoto("venue", IMAGES.venue);
  return (
    <section id="lieux" className="py-24 md:py-36 px-5 sm:px-8 lg:px-16" data-testid="venues-section">
      <div className="max-w-6xl mx-auto">
        <Chapter index="IV" eyebrow="Lieux & Accès" title="Le Rendez-vous" script="on vous y attend" />
        <div className="grid lg:grid-cols-5 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="lg:col-span-3 bg-white border hairline rounded-sm overflow-hidden shadow-[0_20px_60px_rgba(74,14,23,0.08)]"
            data-testid="venue-card"
          >
            <div className="relative h-64 sm:h-72 overflow-hidden group">
              <img
                src={venueImg}
                alt={venue.name}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A050B]/70 to-transparent" />
              <p className="absolute bottom-5 left-6 font-script text-3xl text-[#FAF7F2]">{venue.name}</p>
            </div>
            <div className="p-7 sm:p-9">
              <div className="flex items-start gap-3 text-[#5C4F51]">
                <MapPin size={18} className="text-[#D4AF37] mt-0.5 shrink-0" strokeWidth={1.5} />
                <p className="text-sm sm:text-base">{venue.address}</p>
              </div>
              <p className="mt-4 text-sm text-[#8C7B7E] leading-relaxed">
                Cérémonie, cocktail et soirée se déroulent au même endroit — laissez-vous porter, tout est prévu sur place.
              </p>
              <a
                data-testid="venue-directions-button"
                href={venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#4A0E17] text-[#FAF7F2] font-cinzel text-[11px] tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-[#6B1724] hover:shadow-[0_10px_30px_rgba(74,14,23,0.3)] transition-all duration-300"
              >
                <Navigation size={15} /> Lancer l'itinéraire
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            <div className="flex-1 border hairline-gold rounded-sm overflow-hidden min-h-[220px]" data-testid="venue-map-embed">
              <iframe
                title="Carte du lieu de réception"
                src={venue.embedUrl}
                className="w-full h-full min-h-[220px] grayscale-[0.3] sepia-[0.15]"
                loading="lazy"
              />
            </div>
            <div className="bg-[#F3ECE2] border hairline rounded-sm p-7" data-testid="venue-logistics-card">
              <h3 className="font-display text-2xl text-[#4A0E17]">Hébergement & Navettes</h3>
              <div className="mt-4 space-y-3 text-sm text-[#5C4F51]">
                <p className="flex items-start gap-3">
                  <BedDouble size={17} className="text-[#D4AF37] mt-0.5 shrink-0" strokeWidth={1.5} />
                  Hôtels partenaires à 5 minutes — code « E&A2026 » pour le tarif préférentiel.
                </p>
                <p className="flex items-start gap-3">
                  <Bus size={17} className="text-[#D4AF37] mt-0.5 shrink-0" strokeWidth={1.5} />
                  Navettes privées depuis la gare de Deauville dès 13h30, retour toute la nuit.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
