import React, { useEffect, useState } from "react";
import { movieService } from "../services/movieService";
import { FiTv, FiShoppingCart, FiDownload, FiChevronDown } from "react-icons/fi";
import { MdOutlineOndemandVideo } from "react-icons/md";

// Priority country list — shown first in the selector
const PRIORITY_COUNTRIES = ["IN", "US", "GB", "CA", "AU", "DE", "FR", "JP", "KR", "BR"];

const TABS = [
  { key: "flatrate", label: "Stream", icon: FiTv },
  { key: "rent",     label: "Rent",   icon: FiShoppingCart },
  { key: "buy",      label: "Buy",    icon: FiDownload },
];

const ProviderLogo = ({ provider, link, movieTitle }) => {
  // Generate a direct link to the provider if possible
  const generateProviderLink = (providerName, title) => {
    if (!title) return link;
    const q = encodeURIComponent(title);
    
    const name = providerName.toLowerCase();
    if (name.includes("netflix")) return `https://www.netflix.com/search?q=${q}`;
    if (name.includes("amazon") || name.includes("prime video")) return `https://www.amazon.com/s?k=${q}&i=instant-video`;
    if (name.includes("disney")) return `https://www.disneyplus.com/search?q=${q}`;
    if (name.includes("hulu")) return `https://www.hulu.com/search?q=${q}`;
    if (name.includes("apple tv")) return `https://tv.apple.com/search?term=${q}`;
    if (name.includes("hbo") || name.includes("max")) return `https://www.max.com/search?q=${q}`;
    if (name.includes("peacock")) return `https://www.peacocktv.com/watch/search?q=${q}`;
    if (name.includes("paramount")) return `https://www.paramountplus.com/search/?q=${q}`;
    if (name.includes("youtube")) return `https://www.youtube.com/results?search_query=${q}+movie`;
    if (name.includes("google play")) return `https://play.google.com/store/search?q=${q}&c=movies`;
    if (name.includes("crunchyroll")) return `https://www.crunchyroll.com/search?q=${q}`;
    if (name.includes("hotstar")) return `https://www.hotstar.com/in/explore/search?q=${q}`;
    if (name.includes("jio")) return `https://www.jiocinema.com/search?q=${q}`;
    if (name.includes("zee5")) return `https://www.zee5.com/search?q=${q}`;
    if (name.includes("sony")) return `https://www.sonyliv.com/search?q=${q}`;

    return link; // Fallback to JustWatch
  };

  const directLink = generateProviderLink(provider.provider_name, movieTitle);

  return (
    <a
      href={directLink || "#"}
      target="_blank"
      rel="noopener noreferrer"
      key={provider.provider_id}
      className="group relative flex flex-col items-center gap-1.5"
      title={`Watch on ${provider.provider_name}`}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-white/10 shadow-lg group-hover:border-purple-400/60 transition-all group-hover:scale-110 duration-200">
        <img
          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
          alt={provider.provider_name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <span className="text-[10px] text-gray-500 group-hover:text-gray-300 transition-colors text-center max-w-[56px] truncate">
        {provider.provider_name}
      </span>
    </a>
  );
};

const WatchProviders = ({ movieId, title }) => {
  const [providers, setProviders] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [country, setCountry]     = useState("IN");
  const [activeTab, setActiveTab] = useState("flatrate");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    movieService
      .getWatchProviders(movieId)
      .then((data) => {
        const results = data?.results || {};
        setProviders(results);

        // Build sorted country list: priority first, then the rest
        const keys = Object.keys(results);
        const priority = PRIORITY_COUNTRIES.filter((c) => keys.includes(c));
        const rest = keys.filter((c) => !PRIORITY_COUNTRIES.includes(c)).sort();
        setAllCountries([...priority, ...rest]);

        // Auto-select India if available, otherwise first priority country, then any
        if (keys.includes("IN")) setCountry("IN");
        else {
          const preferred = PRIORITY_COUNTRIES.find((c) => keys.includes(c));
          if (preferred) setCountry(preferred);
          else if (keys.length > 0) setCountry(keys[0]);
        }
      })
      .catch(() => setProviders(null))
      .finally(() => setLoading(false));
  }, [movieId]);

  const countryData = providers?.[country];
  const tabProviders = countryData?.[activeTab] || [];

  // Find the first tab with data for the selected country
  useEffect(() => {
    if (!countryData) return;
    const firstAvailable = TABS.find((t) => (countryData[t.key] || []).length > 0);
    if (firstAvailable) setActiveTab(firstAvailable.key);
  }, [country, providers]);

  if (loading) {
    return (
      <div className="w-full bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-violet-600" />
            <div className="h-6 w-40 bg-white/10 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!providers || allCountries.length === 0) return null;

  const hasAnyData = TABS.some((t) => (countryData?.[t.key] || []).length > 0);

  return (
    <div className="w-full bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-violet-600 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-widest text-purple-400 font-semibold">Availability</p>
              <h3 className="text-xl sm:text-2xl font-bold">Where to Watch</h3>
            </div>
          </div>

          {/* Country picker */}
          <div className="relative">
            <button
              onClick={() => setShowCountryPicker((p) => !p)}
              className="flex items-center gap-2 bg-white/6 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 rounded-xl px-4 py-2 text-sm font-medium transition-all"
            >
              <span className="text-base leading-none">{countryFlag(country)}</span>
              <span>{countryName(country)}</span>
              <FiChevronDown
                className={`text-gray-400 transition-transform duration-200 ${showCountryPicker ? "rotate-180" : ""}`}
              />
            </button>

            {showCountryPicker && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-[#111] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto scrollbar-hide">
                {allCountries.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCountry(c); setShowCountryPicker(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      c === country
                        ? "bg-purple-600/20 text-purple-300"
                        : "text-gray-300 hover:bg-white/6 hover:text-white"
                    }`}
                  >
                    <span className="text-base">{countryFlag(c)}</span>
                    <span>{countryName(c)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {!hasAnyData ? (
          /* No data for this country */
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center bg-white/4 border border-white/8 rounded-2xl">
            <MdOutlineOndemandVideo className="text-5xl text-gray-700" />
            <p className="text-gray-500 font-medium">Not available in {countryName(country)}</p>
            <p className="text-gray-700 text-sm">Try a different country from the selector above.</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {TABS.map(({ key, label, icon: Icon }) => {
                const count = (countryData?.[key] || []).length;
                if (count === 0) return null;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      activeTab === key
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                        : "bg-white/6 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="text-sm" />
                    {label}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                        activeTab === key ? "bg-white/20" : "bg-white/10"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Provider logos */}
            {tabProviders.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {tabProviders.map((p) => (
                  <ProviderLogo key={p.provider_id} provider={p} link={countryData?.link} movieTitle={title} />
                ))}
              </div>
            ) : (
              <div className="text-gray-600 text-sm py-4">No providers available for this category.</div>
            )}

            {/* JustWatch attribution */}
            <p className="mt-6 text-[11px] text-gray-700">
              Streaming data provided by{" "}
              <a
                href={countryData?.link || "https://www.justwatch.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-purple-400 underline underline-offset-2 transition-colors"
              >
                JustWatch
              </a>{" "}
              via TMDB.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const COUNTRY_NAMES = new Intl.DisplayNames(["en"], { type: "region" });

function countryName(code) {
  try { return COUNTRY_NAMES.of(code); }
  catch { return code; }
}

function countryFlag(code) {
  // Convert ISO 3166-1 alpha-2 to regional indicator emoji
  if (!code || code.length !== 2) return "🌐";
  return String.fromCodePoint(
    ...code.toUpperCase().split("").map((c) => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
}

export default WatchProviders;
