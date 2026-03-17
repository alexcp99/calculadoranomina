"use client";

import { useEffect } from "react";

const GA_ID = "G-JXB1C0F6ET";

function loadGoogleAnalytics() {
  if (typeof window === "undefined") return;
  if (document.getElementById("ga-script")) return; // already loaded

  // Init dataLayer + gtag
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  w.gtag = function gtag() { w.dataLayer.push(arguments); };
  w.gtag("js", new Date());
  w.gtag("consent", "update", {
    analytics_storage: "granted",
  });
  w.gtag("config", GA_ID, { anonymize_ip: true });

  const script = document.createElement("script");
  script.id = "ga-script";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

export default function GoogleAnalytics() {
  useEffect(() => {
    if (localStorage.getItem("cn_cookie_consent") === "accepted") {
      loadGoogleAnalytics();
    }

    window.addEventListener("cookieConsentAccepted", loadGoogleAnalytics);
    return () => window.removeEventListener("cookieConsentAccepted", loadGoogleAnalytics);
  }, []);

  return null;
}
