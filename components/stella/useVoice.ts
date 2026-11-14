"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Voice for Stella, using the browser's own speech services: dictation (SpeechRecognition) and
// reading answers aloud (speechSynthesis). In Chrome, dictation audio is processed by Google.

/* eslint-disable @typescript-eslint/no-explicit-any */
type Recognition = { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void; abort(): void; onresult: ((e: any) => void) | null; onend: (() => void) | null; onerror: ((e: any) => void) | null };

function recognitionCtor(): (new () => Recognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Plain speakable text: no markdown, no [citations], no links. */
export function speakable(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[(?:File|Book|Account|[^\]]*·)[^\]]*\]/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_>|#-]{1,3}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function useVoice({ onFinal }: { onFinal: (text: string) => void }) {
  const [supported, setSupported] = useState({ listen: false, speak: false });
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const rec = useRef<Recognition | null>(null);
  const final = useRef(onFinal);
  final.current = onFinal;

  useEffect(() => { setSupported({ listen: !!recognitionCtor(), speak: typeof window !== "undefined" && "speechSynthesis" in window }); }, []);
  useEffect(() => () => { rec.current?.abort(); if (typeof window !== "undefined") window.speechSynthesis?.cancel(); }, []);

  const listen = useCallback(() => {
    const Ctor = recognitionCtor();
    if (!Ctor) { setError("This browser has no speech recognition. Chrome or Edge do."); return; }
    window.speechSynthesis?.cancel();
    rec.current?.abort();
    const r = new Ctor();
    r.lang = navigator.language || "en-US";
    r.interimResults = true;
    r.continuous = false;
    let text = "";
    r.onresult = (e: any) => {
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) text += res[0].transcript; else live += res[0].transcript;
      }
      setInterim((text + " " + live).trim());
    };
    r.onerror = (e: any) => { if (e?.error !== "no-speech" && e?.error !== "aborted") setError(e?.error === "not-allowed" ? "Microphone access was blocked. Allow it in the browser to talk to Stella." : `Voice error: ${e?.error ?? "unknown"}`); };
    r.onend = () => { setListening(false); setInterim(""); if (text.trim()) final.current(text.trim()); };
    rec.current = r;
    setError(null);
    setListening(true);
    r.start();
  }, []);

  const stopListening = useCallback(() => { rec.current?.stop(); }, []);

  const speak = useCallback((md: string, then?: () => void) => {
    if (!("speechSynthesis" in window)) { then?.(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(speakable(md).slice(0, 4000));
    u.lang = navigator.language || "en-US";
    u.rate = 1.05;
    u.onend = () => { setSpeaking(false); then?.(); };
    u.onerror = () => { setSpeaking(false); };
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }, []);

  const stopSpeaking = useCallback(() => { window.speechSynthesis?.cancel(); setSpeaking(false); }, []);

  return { supported, listening, speaking, interim, error, listen, stopListening, speak, stopSpeaking };
}
