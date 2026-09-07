"use client";

import { useCallback, useState } from "react";
import Preloader from "./Preloader";
import Hero from "./Hero";
import type { NavLink } from "./Nav";
import type { Content } from "@/lib/types";

/**
 * The preloader owns `ready`, which every hero animation waits on — so the page
 * only starts moving once the curtain is actually up.
 */
export default function HomeShell({
  content,
  links,
  children,
}: {
  content: Content;
  links: NavLink[];
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const handleDone = useCallback(() => setReady(true), []);

  return (
    <>
      <Preloader onDone={handleDone} />
      <main id="main">
        <Hero content={content} links={links} ready={ready} />
        {children}
      </main>
    </>
  );
}
