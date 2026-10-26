import { useEffect, useState } from "react";
import { ROSE_PINK } from "./Flowers";

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
}) {
  const [visible, setVisible] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
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
  }, [text, delay, speed, start]);

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
