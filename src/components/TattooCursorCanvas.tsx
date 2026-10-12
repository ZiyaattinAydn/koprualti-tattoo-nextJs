"use client";
import { useEffect, useRef } from "react";
type Mark = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  born: number;
  released?: number;
  held: boolean;
  heavy: boolean;
};
const fadeMs = 1150,
  maxMarks = 180;
export function TattooCursorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null),
    crosshairRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current,
      crosshair = crosshairRef.current,
      hero = canvas?.closest<HTMLElement>("[data-tattoo-zone]");
    if (!canvas || !crosshair || !hero) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const media = matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 761px) and (prefers-reduced-motion: no-preference)",
    );
    const controller = new AbortController(),
      signal = controller.signal,
      marks: Mark[] = [];
    let active = false,
      pressed = false,
      frame = 0,
      last: { x: number; y: number } | null = null;
    const resize = () => {
      const rect = hero.getBoundingClientRect(),
        scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * scale));
      canvas.height = Math.max(1, Math.round(rect.height * scale));
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      marks.length = 0;
      last = null;
    };
    const schedule = () => {
      if (active && !frame && !document.hidden)
        frame = requestAnimationFrame(draw);
    };
    const release = () => {
      if (!pressed) return;
      pressed = false;
      const now = performance.now();
      marks.forEach((mark) => {
        if (mark.held) {
          mark.held = false;
          mark.released = now;
        }
      });
      schedule();
    };
    function draw(now: number) {
      frame = 0;
      const rect = hero!.getBoundingClientRect();
      ctx!.clearRect(0, 0, rect.width, rect.height);
      for (let i = marks.length - 1; i >= 0; i--) {
        const mark = marks[i],
          age = now - (mark.released ?? mark.born);
        if (!mark.held && age >= fadeMs) {
          marks.splice(i, 1);
          continue;
        }
        const strength = mark.held ? 1 : Math.max(0, 1 - age / fadeMs);
        ctx!.lineCap = "round";
        ctx!.lineJoin = "round";
        ctx!.beginPath();
        ctx!.moveTo(mark.x1, mark.y1);
        ctx!.lineTo(mark.x2, mark.y2);
        ctx!.strokeStyle = `rgba(7,7,9,${strength * 0.62})`;
        ctx!.lineWidth = mark.heavy ? 3.8 : 2.8;
        ctx!.stroke();
        ctx!.strokeStyle = `rgba(207,205,210,${strength * (mark.heavy ? 0.76 : 0.47)})`;
        ctx!.lineWidth = mark.heavy ? 1.7 : 1.05;
        ctx!.stroke();
      }
      if (active && marks.some((mark) => !mark.held)) schedule();
    }
    const stop = () => {
      release();
      active = false;
      hero.classList.remove("tattoo-cursor-ready");
      crosshair.classList.remove("is-visible");
      marks.length = 0;
      last = null;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    const sync = () => {
      if (!media.matches || document.hidden) {
        stop();
        return;
      }
      active = true;
      hero.classList.add("tattoo-cursor-ready");
      resize();
    };
    const point = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const interactive = (e: PointerEvent) =>
      (e.target as Element).closest(
        "a,button,input,select,textarea,[data-lightbox]",
      ) !== null;
    const move = (e: PointerEvent) => {
      if (!active || e.pointerType !== "mouse") return;
      if (interactive(e)) {
        crosshair.classList.remove("is-visible");
        last = null;
        return;
      }
      const p = point(e);
      if (
        p.x < 0 ||
        p.y < 0 ||
        p.x > hero.clientWidth ||
        p.y > hero.clientHeight
      )
        return;
      crosshair.style.left = `${p.x}px`;
      crosshair.style.top = `${p.y}px`;
      crosshair.classList.add("is-visible");
      if (last) {
        const distance = Math.hypot(p.x - last.x, p.y - last.y);
        if (distance >= 2 && distance < 95) {
          marks.push({
            x1: last.x,
            y1: last.y,
            x2: p.x,
            y2: p.y,
            born: performance.now(),
            held: pressed,
            heavy: pressed,
          });
          if (marks.length > maxMarks) marks.splice(0, marks.length - maxMarks);
          schedule();
        }
      }
      last = p;
    };
    const down = (e: PointerEvent) => {
      if (
        !active ||
        e.pointerType !== "mouse" ||
        e.button !== 0 ||
        interactive(e)
      )
        return;
      pressed = true;
      last = point(e);
    };
    const leave = () => {
      crosshair.classList.remove("is-visible");
      last = null;
      release();
    };
    hero.addEventListener("pointermove", move, { passive: true, signal });
    hero.addEventListener("pointerdown", down, { signal });
    hero.addEventListener("pointerleave", leave, { signal });
    window.addEventListener("pointerup", release, { signal });
    window.addEventListener("blur", release, { signal });
    document.addEventListener("visibilitychange", sync, { signal });
    media.addEventListener?.("change", sync, { signal });
    const observer =
      "ResizeObserver" in window
        ? new ResizeObserver(() => {
            if (active) resize();
          })
        : null;
    observer?.observe(hero);
    if (!observer)
      window.addEventListener("resize", resize, { passive: true, signal });
    sync();
    return () => {
      controller.abort();
      observer?.disconnect();
      stop();
    };
  }, []);
  return (
    <>
      <canvas ref={canvasRef} className="tattoo-trail" aria-hidden="true" />
      <span
        ref={crosshairRef}
        className="tattoo-crosshair"
        aria-hidden="true"
      />
    </>
  );
}
