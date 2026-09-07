"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useFormStatus } from "react-dom";
import { login } from "../actions";

const field =
  "peer w-full border-b border-white/20 bg-transparent px-0 pb-2.5 pt-6 text-sm text-white outline-none transition-colors placeholder:text-transparent focus:border-white";

const label =
  "pointer-events-none absolute left-0 top-6 origin-left text-sm text-white/45 transition-all duration-300 peer-focus:top-0 peer-focus:text-[0.65rem] peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-white/70 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[0.65rem] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.16em] peer-[:not(:placeholder-shown)]:text-white/70";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative mt-10 w-full overflow-hidden bg-white py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors disabled:cursor-not-allowed"
    >
      {/* The fill sweeps in from the left rather than the colour just flipping. */}
      <span className="absolute inset-0 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out group-hover:scale-x-100" />
      <span className="relative transition-colors duration-300 group-hover:text-white">
        {pending ? "Checking…" : "Enter"}
      </span>
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState(login, {});
  const [shake, setShake] = useState(0);
  const firstRender = useRef(true);

  // A wrong password should be felt, not just read.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (state.error) setShake((n) => n + 1);
  }, [state]);

  // The card tips a couple of degrees toward the pointer.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 200, damping: 24, mass: 0.6 };
  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);
  const glowX = useMotionTemplate`${px}`;

  function track(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    px.set(nx);
    py.set(ny);
    rotateY.set((nx - 0.5) * 6);
    rotateX.set((0.5 - ny) * 6);
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div className="[perspective:1400px]">
      <motion.div
        onPointerMove={track}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        key={shake}
        animate={shake ? { x: [0, -10, 9, -6, 4, 0] } : undefined}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden border border-white/12 bg-ink/80 p-8 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-10"
      >
        {/* A soft light that follows the pointer across the card face. */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-px opacity-70"
          style={{
            background: useMotionTemplate`radial-gradient(420px 260px at ${useMotionTemplate`calc(${glowX} * 100%)`} 0%, rgba(209,58,19,0.35), transparent 70%)`,
          }}
        />

        <div className="relative">
          <p className="eyebrow text-white/45">Restricted</p>
          <h1 className="display mt-3 text-4xl text-white sm:text-5xl">
            Sign in
          </h1>
          <p className="mt-3 text-sm text-white/45">
            Content admin for the portfolio. Everything on the public site is
            edited here.
          </p>

          <form action={formAction} className="mt-10">
            <div className="relative">
              <input
                id="username"
                name="username"
                required
                autoComplete="username"
                placeholder="username"
                className={field}
              />
              <label htmlFor="username" className={label}>
                Username
              </label>
            </div>

            <div className="relative mt-7">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="password"
                className={field}
              />
              <label htmlFor="password" className={label}>
                Password
              </label>
            </div>

            <SubmitButton />
          </form>

          <div aria-live="polite" className="mt-5 min-h-[1.5rem]">
            <AnimatePresence mode="wait">
              {state.error && (
                <motion.p
                  key={state.error + shake}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm text-white"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-[0.6rem]">
                    !
                  </span>
                  {state.error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
