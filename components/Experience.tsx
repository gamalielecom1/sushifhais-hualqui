"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import RegisterForm from "./RegisterForm";
import { playReveal } from "@/lib/sound";

// Momento del "golpe": la foto ya casi terminó de entrar
const IMPACT_MS = 950;

// Confeti con los colores de la marca; cada pieza sale hacia su (x, y)
const CONFETTI = [
  { x: "-130px", y: "-80px", r: "200deg", c: "bg-brand-500" },
  { x: "-100px", y: "-10px", r: "-160deg", c: "bg-bamboo-500" },
  { x: "-135px", y: "60px", r: "120deg", c: "bg-brand-400" },
  { x: "-75px", y: "-140px", r: "-90deg", c: "bg-bamboo-400" },
  { x: "-40px", y: "-165px", r: "240deg", c: "bg-brand-600" },
  { x: "40px", y: "-165px", r: "-240deg", c: "bg-bamboo-500" },
  { x: "75px", y: "-140px", r: "90deg", c: "bg-brand-500" },
  { x: "130px", y: "-80px", r: "-200deg", c: "bg-bamboo-400" },
  { x: "100px", y: "-10px", r: "160deg", c: "bg-brand-400" },
  { x: "135px", y: "60px", r: "-120deg", c: "bg-bamboo-500" },
  { x: "-20px", y: "-185px", r: "300deg", c: "bg-brand-500" },
  { x: "20px", y: "-185px", r: "-300deg", c: "bg-bamboo-500" },
];

// Polvo dorado que flota hacia arriba (posición, tamaño, desvío y ritmo)
const DUST = [
  { l: "6%", b: "4%", s: 4, dx: "18px", d: "1.2s", t: "6.5s" },
  { l: "14%", b: "14%", s: 3, dx: "-14px", d: "2.4s", t: "7.5s" },
  { l: "22%", b: "2%", s: 5, dx: "22px", d: "1.8s", t: "8s" },
  { l: "31%", b: "10%", s: 3, dx: "-20px", d: "3.1s", t: "6s" },
  { l: "40%", b: "3%", s: 4, dx: "12px", d: "1.5s", t: "7s" },
  { l: "49%", b: "12%", s: 3, dx: "-10px", d: "2.8s", t: "8.5s" },
  { l: "58%", b: "5%", s: 5, dx: "20px", d: "2.1s", t: "6.8s" },
  { l: "66%", b: "13%", s: 3, dx: "-18px", d: "3.4s", t: "7.2s" },
  { l: "74%", b: "2%", s: 4, dx: "16px", d: "1.3s", t: "8s" },
  { l: "82%", b: "9%", s: 3, dx: "-12px", d: "2.6s", t: "6.4s" },
  { l: "90%", b: "4%", s: 5, dx: "14px", d: "1.9s", t: "7.8s" },
  { l: "95%", b: "15%", s: 3, dx: "-16px", d: "3s", t: "6.9s" },
];

export default function Experience() {
  // done = el registro se envió y entramos a la escena de la sorpresa
  const [done, setDone] = useState(false);
  const backRef = useRef<HTMLButtonElement>(null);
  const formSceneRef = useRef<HTMLElement>(null);

  // Mientras se ve la sorpresa, el formulario no recibe foco ni toques
  useEffect(() => {
    if (formSceneRef.current) formSceneRef.current.inert = done;
  }, [done]);

  useEffect(() => {
    if (!done) return;

    playReveal(IMPACT_MS / 1000);

    // El "golpe" también se siente: una vibración corta donde el celular lo permita
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const buzz = setTimeout(() => {
      if (!reduce) navigator.vibrate?.([35, 45, 20]);
    }, IMPACT_MS);

    const focus = setTimeout(
      () => backRef.current?.focus({ preventScroll: true }),
      1800
    );
    return () => {
      clearTimeout(buzz);
      clearTimeout(focus);
    };
  }, [done]);

  // Cada elemento del texto de gracias entra escalonado, después del golpe
  const reveal = (i: number) =>
    ({
      transitionDelay: done ? `${IMPACT_MS + 150 + i * 120}ms` : "0ms",
    }) as CSSProperties;
  const revealClass = (extra = "") =>
    `transition duration-700 ease-out ${
      done ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    } ${extra}`;

  return (
    <div className="photo-geo relative isolate min-h-[100dvh] overflow-hidden">
      {/* ESCENA 1 · Tío Fhais recibe desde el fondo: difuminado → nítido con zoom */}
      <div
        aria-hidden
        className={`absolute inset-0 -z-20 overflow-hidden transition-[opacity,filter,transform] duration-[900ms] ease-out ${
          done ? "scale-[1.2] opacity-0 blur-2xl" : "scale-100 opacity-100 blur-0"
        }`}
      >
        <Image
          src="/images/tio-fhais-bienvenida.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-[1.12] transform-gpu object-cover object-[50%_4%] opacity-90 animate-focus-zoom motion-reduce:animate-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/25 to-neutral-50" />
      </div>

      {/* ESCENA 2 · Tío Fhais aparece con la sorpresa, a pantalla completa */}
      <div
        aria-hidden={!done}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* Fondo desenfocado: solo se nota si la pantalla es horizontal */}
        <Image
          src="/images/tio-fhais-sorpresa.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className={`scale-110 object-cover opacity-0 blur-2xl transition-opacity duration-[900ms] ${
            done ? "opacity-70 delay-300" : ""
          }`}
        />

        {/* La foto cubre toda la pantalla (se recorta, no deja franjas) */}
        <div
          className={`photo-stage ${done ? "motion-safe:animate-impact" : ""}`}
          style={{ animationDelay: `${IMPACT_MS}ms` }}
        >
          <div
            className={`absolute inset-0 transition-[opacity,filter,transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              done
                ? "translate-y-0 scale-100 opacity-100 blur-0 delay-[350ms]"
                : "translate-y-8 scale-[1.25] opacity-0 blur-2xl"
            }`}
          >
            <Image
              src="/images/tio-fhais-sorpresa.jpg"
              alt="El Tío Fhais te entrega una caja sorpresa con moño rojo"
              fill
              priority
              sizes="100vw"
              className="object-cover [filter:saturate(1.2)_contrast(1.07)]"
            />
          </div>
        </div>

        {/* Tratamiento gráfico: deja de verse como una foto suelta */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            done ? "opacity-100 delay-300" : "opacity-0"
          }`}
        >
          {/* Viñeta cálida y sombras arriba/abajo */}
          <div className="absolute inset-0 [background:radial-gradient(ellipse_at_50%_45%,transparent_45%,rgba(40,4,4,0.55)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/75 to-transparent" />
          {/* Rayos de luz dorada girando lento detrás de la caja */}
          <div
            className="at-photo absolute left-1/2 h-[150vmax] w-[150vmax] -translate-x-1/2 -translate-y-1/2 animate-rays mix-blend-screen motion-reduce:animate-none [background:repeating-conic-gradient(from_0deg,rgba(255,206,110,0.5)_0_5deg,transparent_5deg_22deg)] [mask-image:radial-gradient(circle,#000_0,transparent_30%)] [-webkit-mask-image:radial-gradient(circle,#000_0,transparent_30%)] opacity-25"
            style={{ "--y": 0.69 } as CSSProperties}
          />
        </div>

        {done && (
          <>
            {/* Marco dorado fino, como una tarjeta de colección */}
            <div className="absolute inset-2.5 animate-fade-in rounded-[1.75rem] border border-[#E8A800]/45 [animation-delay:1.1s] [animation-fill-mode:both]" />

            {/* Farolitos que caen y se mecen */}
            <div className="absolute left-3 top-0 w-8 animate-drop-in [animation-delay:1.05s] sm:left-8 sm:w-11">
              <Image
                src="/images/farol.png"
                alt=""
                aria-hidden
                width={120}
                height={659}
                className="origin-top animate-sway motion-reduce:animate-none"
              />
            </div>
            <div className="absolute right-3 top-0 w-6 animate-drop-in [animation-delay:1.2s] sm:right-8 sm:w-9">
              <Image
                src="/images/farol.png"
                alt=""
                aria-hidden
                width={120}
                height={659}
                className="origin-top animate-sway [animation-delay:-3s] motion-reduce:animate-none"
              />
            </div>

            {/* El golpe: destello + ondas de choque desde la caja */}
            <div
              className="at-photo absolute inset-x-0 h-0 motion-reduce:hidden"
              style={{ "--y": 0.69 } as CSSProperties}
            >
              <div
                className="absolute left-1/2 top-0 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 animate-flash rounded-full [background:radial-gradient(circle,rgba(255,244,214,0.95)_0,rgba(255,200,90,0.35)_18%,transparent_42%)]"
                style={{ animationDelay: `${IMPACT_MS}ms` }}
              />
              {[0, 130, 260].map((d) => (
                <span
                  key={d}
                  className="absolute left-1/2 top-0 h-40 w-40 animate-shockwave rounded-full border-[3px] border-[#FFC857]"
                  style={{ animationDelay: `${IMPACT_MS + d}ms` }}
                />
              ))}
              {/* Confeti */}
              <div className="absolute left-1/2 top-0">
                {CONFETTI.map((p, i) => (
                  <span
                    key={i}
                    className={`absolute -ml-1 -mt-1.5 block h-3 w-2 rounded-[2px] animate-confetti ${p.c}`}
                    style={
                      {
                        "--x": p.x,
                        "--y": p.y,
                        "--r": p.r,
                        animationDelay: `${IMPACT_MS + (i % 4) * 40}ms`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            </div>

            {/* Polvo dorado flotando */}
            <div className="absolute inset-0 motion-reduce:hidden">
              {DUST.map((p, i) => (
                <span
                  key={i}
                  className="absolute animate-dust rounded-full bg-[#FFD27A] shadow-[0_0_10px_3px_rgba(255,190,80,0.75)]"
                  style={
                    {
                      left: p.l,
                      bottom: p.b,
                      width: p.s,
                      height: p.s,
                      "--dx": p.dx,
                      animationDelay: `calc(${IMPACT_MS}ms + ${p.d})`,
                      animationDuration: p.t,
                    } as CSSProperties
                  }
                />
              ))}
            </div>

            {/* Línea tricolor de la marca */}
            <div className="tricolor absolute inset-x-0 bottom-0 h-1.5 animate-fade-in [animation-delay:1.2s] [animation-fill-mode:both]" />
          </>
        )}
      </div>

      {/* Formulario: se aleja y se desvanece al enviar */}
      <main
        ref={formSceneRef}
        aria-hidden={done}
        className={`mx-auto flex min-h-[100dvh] w-full max-w-md flex-col items-center justify-center px-5 pb-4 pt-3 short:pb-3 short:pt-2 transition duration-500 ease-out sm:max-w-lg lg:max-w-5xl lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:px-10 lg:py-10 ${
          done ? "pointer-events-none scale-[0.96] opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="relative flex flex-col items-center text-center lg:flex-1 lg:items-start lg:text-left">
          {/* Halo suave detrás del texto para que no se pierda en la foto */}
          <div
            aria-hidden
            className="absolute -inset-x-3 -inset-y-2 -z-10 rounded-[2rem] bg-white/55 blur-xl"
          />
          <Image
            src="/logo.png"
            alt="Sushi Fhais"
            width={420}
            height={210}
            className="w-24 short:w-16 sm:w-36 lg:w-64"
            priority
          />

          <span className="mt-2 short:mt-1 inline-block rounded-full bg-brand-50 px-4 py-1 short:py-0.5 text-sm font-semibold text-brand-600">
            Próximamente
          </span>

          <h1 className="mt-2 short:mt-1 text-center text-2xl font-bold leading-tight text-neutral-900 [text-shadow:0_0_14px_rgba(255,255,255,0.9)] short:text-xl sm:text-3xl lg:text-left lg:text-4xl">
            Recibe tu <span className="text-brand-600">sorpresa</span> de
            lanzamiento
          </h1>

          <p className="mt-1.5 short:mt-1 text-center text-base text-neutral-800 [text-shadow:0_0_10px_rgba(255,255,255,0.9)] short:text-sm lg:text-left lg:text-lg">
            Regístrate y llévate un regalo en tu primer pedido online.
          </p>
        </div>

        <div className="mt-3 w-full rounded-3xl border border-neutral-200 bg-white/95 p-4 shadow-lg short:mt-2 short:p-3 sm:p-6 lg:mt-0 lg:max-w-md lg:flex-1">
          <RegisterForm
            onSuccess={() => setDone(true)}
            onError={() => setDone(false)}
          />
        </div>
      </main>

      {/* Texto de gracias sobre el pecho del Tío Fhais */}
      <section
        aria-live="polite"
        aria-hidden={!done}
        className={`absolute inset-0 z-10 ${done ? "" : "pointer-events-none"}`}
      >
        <div
          className="at-photo absolute inset-x-0 mx-auto flex max-w-sm flex-col items-center px-6 text-center"
          style={{ "--y": 0.365 } as CSSProperties}
        >
          {/* Sombra detrás del texto: una banda oscura y un halo difuso */}
          <div
            aria-hidden
            className={`pointer-events-none absolute -inset-x-[50vw] -inset-y-8 -z-10 bg-gradient-to-b from-transparent via-black/55 to-transparent transition-opacity duration-700 ${
              done ? "opacity-100 delay-[900ms]" : "opacity-0"
            }`}
          />
          <div
            aria-hidden
            className={`pointer-events-none absolute -inset-x-6 -inset-y-6 -z-10 rounded-[3rem] bg-black/55 blur-2xl transition-opacity duration-700 ${
              done ? "opacity-100 delay-[900ms]" : "opacity-0"
            }`}
          />

          <span
            style={reveal(0)}
            className={revealClass(
              "inline-block rounded-full bg-white/90 px-4 py-1 text-sm font-semibold text-bamboo-600"
            )}
          >
            ¡Registro exitoso!
          </span>

          <h2
            style={reveal(1)}
            className={revealClass(
              "mt-2 text-2xl font-bold leading-tight text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.8)] short:text-xl sm:text-3xl"
            )}
          >
            Gracias por unirte,{" "}
            <span className="text-brand-100">te esperamos</span>
          </h2>

          <p
            style={reveal(2)}
            className={revealClass(
              "mt-2 text-[15px] leading-snug text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.9)] short:text-[13px]"
            )}
          >
            Guardamos tus datos. Apenas Sushi Fhais abra sus puertas te
            avisaremos por correo y tendrás tu regalo listo para tu primer
            pedido online.
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-md px-5 pb-7 short:pb-5">
          <button
            ref={backRef}
            type="button"
            tabIndex={done ? 0 : -1}
            onClick={() => setDone(false)}
            style={reveal(3)}
            className={revealClass(
              "w-full rounded-2xl bg-white px-6 py-3.5 text-base font-semibold text-neutral-900 shadow-lg hover:bg-neutral-100 active:scale-[0.98] short:py-3"
            )}
          >
            Volver al inicio
          </button>
        </div>
      </section>
    </div>
  );
}
