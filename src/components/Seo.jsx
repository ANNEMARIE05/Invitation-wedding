import { useEffect } from "react";

const ensure = (selector, tag, attrs = {}) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  return el;
};

export default function Seo({ title, siteName, description, image, jsonLd }) {
  useEffect(() => {
    const url = window.location.origin + window.location.pathname;
    document.title = title;
    ensure('link[rel="canonical"]', "link", { rel: "canonical" }).setAttribute("href", url);
    if (description) {
      ensure('meta[name="description"]', "meta", { name: "description" }).setAttribute("content", description);
    }
    const og = { "og:url": url, "og:site_name": siteName, "og:title": title, "og:type": "website" };
    if (description) og["og:description"] = description;
    if (image) og["og:image"] = window.location.origin + image;
    Object.entries(og).forEach(([p, v]) =>
      ensure(`meta[property="${p}"]`, "meta", { property: p }).setAttribute("content", v)
    );
    const tw = { "twitter:card": image ? "summary_large_image" : "summary", "twitter:title": title };
    if (description) tw["twitter:description"] = description;
    if (image) tw["twitter:image"] = window.location.origin + image;
    Object.entries(tw).forEach(([n, v]) =>
      ensure(`meta[name="${n}"]`, "meta", { name: n }).setAttribute("content", v)
    );
    if (jsonLd) {
      const s = ensure("script[data-seo-jsonld]", "script", { type: "application/ld+json" });
      s.setAttribute("data-seo-jsonld", "");
      s.textContent = JSON.stringify(jsonLd);
    }
  }, [title, siteName, description, image, jsonLd]);
  return null;
}
