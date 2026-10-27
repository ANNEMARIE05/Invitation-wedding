import { useEffect, useState } from "react";
import { ROSE_PINK } from "./Flowers";

const MOBILE_QUERY = "(max-width: 639px), (hover: none) and (pointer: coarse)";

/**
 * Affiche le texte lettre par lettre (effet machine à écrire).
 */
export default function TypewriterText({
  text = "",
  className = "",
  delay = 0,
  speed = 48,
  start = true,
  showCursor = true,
  flowerAtStart = false,
  flowerAtEnd = false,
  instantOnMobile = false,
}) {
  const [visible, setVisible] = useState("");
  const [done, setDone] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const updateMobileState = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateMobileState);
    return () => mediaQuery.removeEventListener("change", updateMobileState);
  }, []);

  useEffect(() => {
    if (instantOnMobile && isMobile) {
      setVisible(text);
      setDone(true);
      return undefined;
    }

    if (!start || !text) {
      setVisible("");
      setDone(false);
      return undefined;
    }

    let index = 0;
    let typingTimer;
    setVisible("");
    setDone(false);

    const beginTimer = setTimeout(() => {
      const step = () => {
        index += 1;
        setVisible(text.slice(0, index));
        if (index >= text.length) {
          setDone(true);
          return;
        }
        typingTimer = setTimeout(step, speed);
      };
      step();
    }, delay);

    return () => {
      clearTimeout(beginTimer);
      clearTimeout(typingTimer);
    };
  }, [text, delay, speed, start, instantOnMobile, isMobile]);

  const Flower = ({ placement }) => (
    <span
      className={`typewriter-flower typewriter-flower--${placement}`}
      aria-hidden="true"
    >
      <img
        src={ROSE_PINK}
        alt=""
        className="typewriter-flower__image"
        decoding="async"
        draggable={false}
      />
    </span>
  );

  return (
    <span className={`typewriter-text ${className}`.trim()}>
      {flowerAtStart && start ? <Flower placement="lead" /> : null}
      {visible}
      {showCursor && start && !done ? (
        <span className="typewriter-cursor" aria-hidden="true">
          |
        </span>
      ) : null}
      {flowerAtEnd && done ? <Flower placement="trail" /> : null}
    </span>
  );
}
