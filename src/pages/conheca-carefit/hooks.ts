import { useEffect, useRef, useState, RefObject } from "react";

interface UseRevealOptions {
  threshold?: number;
  stagger?: number;
  childSelector?: string | null;
  rootMargin?: string;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {}
): RefObject<T> {
  const {
    threshold = 0.15,
    stagger = 80,
    childSelector = null,
    rootMargin = "0px 0px -10% 0px",
  } = options;
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-in");
            if (childSelector) {
              const kids = el.querySelectorAll(childSelector);
              kids.forEach((kid, i) => {
                setTimeout(() => kid.classList.add("is-in"), i * stagger);
              });
            }
            setSeen(true);
            obs.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [seen, childSelector, stagger, threshold, rootMargin]);

  return ref;
}

export function useCountUp(
  target: number,
  duration = 1800
): [RefObject<HTMLDivElement>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start: number | null = null;
    let raf: number | undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const tick = (t: number) => {
            if (!start) start = t;
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.floor(target * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, duration]);
  return [ref, val];
}

export function useScrollProgress(): number {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}
