"use client";

import { useState, FormEvent } from "react";
import { primeSound } from "@/lib/sound";

const SCRIPT_URL = process.env.NEXT_PUBLIC_SHEETS_ENDPOINT ?? "";

type Status = "idle" | "loading" | "error";

const inputClass =
  "w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-3 short:py-1.5 text-[16px] text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20";

const selectClass =
  "w-full appearance-none rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-3 short:py-1.5 pr-9 text-[16px] text-neutral-900 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20";

const labelClass = "mb-1 short:mb-0.5 block text-sm short:text-[13px] font-medium text-neutral-700";

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DIAS = Array.from({ length: 31 }, (_, i) => i + 1);
const CURRENT_YEAR = new Date().getFullYear();
const ANIOS = Array.from({ length: 90 }, (_, i) => CURRENT_YEAR - i);

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5 7.5l4.5 4.5 4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RegisterForm({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!SCRIPT_URL) {
      setStatus("error");
      setErrorMsg(
        "Falta configurar NEXT_PUBLIC_SHEETS_ENDPOINT en .env.local"
      );
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);

    const nombre = String(data.get("nombre") ?? "").trim();
    const telefono = String(data.get("telefono") ?? "").trim();
    const correo = String(data.get("correo") ?? "").trim();
    const cumpleanos = dia && mes ? `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}${anio ? `/${anio}` : ""}` : "";

    if (!nombre || !telefono || !correo) {
      setStatus("error");
      setErrorMsg("Nombre, correo y teléfono son obligatorios.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    // La animación de gracias parte de inmediato. Google Apps Script puede
    // tardar varios segundos en responder, así que el guardado sigue en
    // segundo plano y, si falla, volvemos al formulario con los datos intactos.
    primeSound(); // el audio solo se habilita dentro de un toque del usuario
    onSuccess();

    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ nombre, telefono, correo, cumpleanos }),
    })
      .then(() => {
        setStatus("idle");
        form.reset();
        setDia("");
        setMes("");
        setAnio("");
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("No se pudo enviar el registro. Intenta de nuevo.");
        onError();
      });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 short:gap-2">
      <div>
        <label htmlFor="nombre" className={labelClass}>
          Nombre y apellido
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          autoComplete="name"
          placeholder="Tu nombre y apellido"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="correo" className={labelClass}>
          Correo electrónico
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="tucorreo@email.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="telefono" className={labelClass}>
          Teléfono
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="+56 9 1234 5678"
          className={inputClass}
        />
      </div>

      <div>
        <span className={labelClass}>
          Cumpleaños{" "}
          <span className="font-normal text-neutral-400">(opcional)</span>
        </span>
        <div className="grid grid-cols-3 gap-2">
          <div className="relative">
            <select
              aria-label="Día"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
              className={selectClass}
            >
              <option value="">Día</option>
              {DIAS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronIcon />
          </div>

          <div className="relative">
            <select
              aria-label="Mes"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className={selectClass}
            >
              <option value="">Mes</option>
              {MESES.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronIcon />
          </div>

          <div className="relative">
            <select
              aria-label="Año"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              className={selectClass}
            >
              <option value="">Año</option>
              {ANIOS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <ChevronIcon />
          </div>
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-brand-600">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-1 w-full rounded-2xl bg-brand-600 px-6 py-3.5 short:py-2.5 text-base font-semibold text-white shadow-sm transition active:scale-[0.98] hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Enviando..." : "Recibir mi sorpresa"}
      </button>

      <p className="text-center text-xs text-neutral-400">
        Al registrarte aceptas recibir novedades sobre el lanzamiento de
        Sushi Fhais.
      </p>
    </form>
  );
}
