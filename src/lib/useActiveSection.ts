"use client";

import { useEffect, useState } from "react";

export function useActiveSection(hrefs: string[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = hrefs
      .map((href) => document.querySelector(href))
      .filter((el): el is Element => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return active;
}
