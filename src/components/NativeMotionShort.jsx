import React, { useState, useEffect, useRef } from 'react';
import { HISTORY_REELS_DATA, getHistoryReel } from '../data/historyReelsData';
import { normalizeYearsAndSpeech } from '../utils/intelligentTtsParser';

// Visual Canvas Engine covering all History Subtopics
function SceneVisualEngine({ visualType, scene, currentConfig }) {
  switch (visualType) {
    case 'zoning':
      return (
        <div className="w-full flex flex-col items-center space-y-4 animate-scaleUp">
          <svg viewBox="0 0 320 220" className="w-full max-w-[290px] drop-shadow-2xl">
            <defs>
              <linearGradient id="citadelGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="lowerTownGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4338ca" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
              <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>
            <path d="M 0,20 Q 30,80 15,140 T 25,220 L 0,220 Z" fill="url(#riverGrad)" opacity="0.85" />
            <text x="8" y="110" fill="#bae6fd" fontSize="8" fontWeight="bold" transform="rotate(-90 8,110)">INDUS RIVER</text>
            <polygon points="50,110 140,80 160,115 70,145" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />
            <polygon points="50,110 70,145 70,175 50,140" fill="#78350f" />
            <polygon points="70,145 160,115 160,145 70,175" fill="#92400e" />
            <rect x="75" y="85" width="24" height="22" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" rx="2" />
            <rect x="105" y="70" width="30" height="28" fill="#fde68a" stroke="#b45309" strokeWidth="1.5" rx="2" />
            <polygon points="120,55 105,70 135,70" fill="#f59e0b" />
            <line x1="87" y1="85" x2="87" y2="65" stroke="#f59e0b" strokeWidth="1.5" />
            <polygon points="87,65 100,70 87,75" fill="#ef4444" />
            <polygon points="175,140 290,120 310,165 195,185" fill="url(#lowerTownGrad)" stroke="#6366f1" strokeWidth="1.5" />
            <line x1="230" y1="130" x2="250" y2="175" stroke="#a5b4fc" strokeWidth="2" strokeDasharray="3,2" />
            <line x1="185" y1="152" x2="300" y2="142" stroke="#a5b4fc" strokeWidth="2" strokeDasharray="3,2" />
            <rect x="190" y="132" width="14" height="12" fill="#c7d2fe" />
            <rect x="210" y="128" width="14" height="12" fill="#c7d2fe" />
            <rect x="250" y="145" width="14" height="12" fill="#c7d2fe" />
            <rect x="270" y="140" width="14" height="12" fill="#c7d2fe" />
            <line x1="60" y1="175" x2="60" y2="110" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="60" cy="110" r="3" fill="#fbbf24" />
            <text x="65" y="145" fill="#fef08a" fontSize="10" fontWeight="900">+12m</text>
          </svg>
          <div className="grid grid-cols-2 gap-2 w-full text-center">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/50 backdrop-blur-md">
              <span className="text-[10px] font-black text-amber-300 uppercase block">🏰 West Citadel</span>
              <span className="text-[9px] text-amber-100/80">Raised Platform • Flood Safe</span>
            </div>
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/50 backdrop-blur-md">
              <span className="text-[10px] font-black text-indigo-300 uppercase block">🏘️ East Lower Town</span>
              <span className="text-[9px] text-indigo-100/80">Cardinal Grid • Citizens</span>
            </div>
          </div>
        </div>
      );

    case 'bath':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <svg viewBox="0 0 320 200" className="w-full max-w-[280px] drop-shadow-2xl">
            <defs>
              <linearGradient id="poolGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>
            <rect x="30" y="30" width="260" height="140" fill="#78350f" stroke="#d97706" strokeWidth="3" rx="6" />
            <rect x="45" y="45" width="230" height="110" fill="#451a03" />
            <rect x="65" y="60" width="190" height="80" fill="url(#poolGrad)" rx="3" />
            <path d="M 75,80 Q 95,75 115,80 T 155,80 T 195,80 T 235,80" stroke="#cffafe" strokeWidth="1.5" fill="none" opacity="0.8" />
            <path d="M 85,105 Q 105,100 125,105 T 165,105 T 205,105 T 245,105" stroke="#cffafe" strokeWidth="1.5" fill="none" opacity="0.8" />
            <line x1="140" y1="46" x2="180" y2="46" stroke="#fef3c7" strokeWidth="2" />
            <line x1="145" y1="51" x2="175" y2="51" stroke="#fde68a" strokeWidth="2" />
            <line x1="150" y1="56" x2="170" y2="56" stroke="#f59e0b" strokeWidth="2" />
            <line x1="150" y1="144" x2="170" y2="144" stroke="#f59e0b" strokeWidth="2" />
            <line x1="145" y1="149" x2="175" y2="149" stroke="#fde68a" strokeWidth="2" />
            <line x1="140" y1="154" x2="180" y2="154" stroke="#fef3c7" strokeWidth="2" />
            <circle cx="160" cy="100" r="16" fill="#0f172a" stroke="#eab308" strokeWidth="2" />
            <text x="160" y="104" fill="#facc15" fontSize="12" fontWeight="900" textAnchor="middle">TAR</text>
          </svg>
          <div className="p-2.5 rounded-2xl bg-cyan-950/60 border border-cyan-400/50 backdrop-blur-md text-center w-full">
            <span className="text-xs font-black text-cyan-300 block">✨ Natural Bitumen Waterproofing</span>
            <p className="text-[10px] text-cyan-100/80 mt-0.5">Burnt-brick masonry + Gypsum mortar + Bitumen tar seal</p>
          </div>
        </div>
      );

    case 'grid':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <svg viewBox="0 0 300 200" className="w-full max-w-[270px] drop-shadow-2xl">
            <g fill="#1e293b" stroke="#334155" strokeWidth="2">
              <rect x="25" y="20" width="110" height="65" rx="4" />
              <rect x="165" y="20" width="110" height="65" rx="4" />
              <rect x="25" y="115" width="110" height="65" rx="4" />
              <rect x="165" y="115" width="110" height="65" rx="4" />
            </g>
            <rect x="135" y="10" width="30" height="180" fill="#0f172a" />
            <rect x="10" y="85" width="280" height="30" fill="#0f172a" />
            <circle cx="150" cy="100" r="12" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
            <text x="150" y="104" fill="#34d399" fontSize="11" fontWeight="900" textAnchor="middle">90°</text>
            <line x1="150" y1="20" x2="150" y2="40" stroke="#f43f5e" strokeWidth="2" />
            <text x="150" y="18" fill="#fb7185" fontSize="10" fontWeight="900" textAnchor="middle">N</text>
            <line x1="150" y1="180" x2="150" y2="160" stroke="#38bdf8" strokeWidth="2" />
            <text x="150" y="195" fill="#7dd3fc" fontSize="10" fontWeight="900" textAnchor="middle">S</text>
            <line x1="270" y1="100" x2="250" y2="100" stroke="#38bdf8" strokeWidth="2" />
            <text x="285" y="103" fill="#7dd3fc" fontSize="10" fontWeight="900" textAnchor="middle">E</text>
            <line x1="30" y1="100" x2="50" y2="100" stroke="#38bdf8" strokeWidth="2" />
            <text x="18" y="103" fill="#7dd3fc" fontSize="10" fontWeight="900" textAnchor="middle">W</text>
            <path d="M 70,95 Q 110,92 140,95 T 220,95" stroke="#a7f3d0" strokeWidth="1.5" strokeDasharray="6,4" fill="none" opacity="0.8" />
          </svg>
          <div className="p-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 backdrop-blur-md text-center w-full">
            <span className="text-xs font-black text-emerald-300 block">💨 Wind-Assisted Natural Cleansing</span>
            <p className="text-[10px] text-emerald-100/80 mt-0.5">Avenues 9–10m wide aligned with cardinal monsoon winds</p>
          </div>
        </div>
      );

    case 'drainage':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <svg viewBox="0 0 320 180" className="w-full max-w-[280px] drop-shadow-2xl">
            <rect x="20" y="20" width="70" height="90" fill="#334155" stroke="#64748b" strokeWidth="2" />
            <text x="55" y="65" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle">BATHROOM</text>
            <line x1="25" y1="100" x2="85" y2="108" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 85,108 L 130,108 L 130,125" stroke="#ea580c" strokeWidth="5" fill="none" strokeLinecap="round" />
            <rect x="110" y="110" width="45" height="55" rx="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
            <rect x="115" y="145" width="35" height="15" fill="#4338ca" />
            <text x="132" y="130" fill="#c7d2fe" fontSize="8" fontWeight="bold" textAnchor="middle">SOAK PIT</text>
            <text x="132" y="156" fill="#fbbf24" fontSize="6" fontWeight="bold" textAnchor="middle">SEDIMENT</text>
            <path d="M 155,120 L 210,120 L 210,135" stroke="#38bdf8" strokeWidth="4" fill="none" strokeLinecap="round" />
            <rect x="195" y="125" width="105" height="45" fill="#0f172a" stroke="#d97706" strokeWidth="2" />
            <line x1="195" y1="125" x2="300" y2="125" stroke="#f59e0b" strokeWidth="4" strokeDasharray="12,4" />
            <text x="248" y="152" fill="#fed7aa" fontSize="9" fontWeight="black" textAnchor="middle">STREET SEWER</text>
            <text x="248" y="118" fill="#fde68a" fontSize="7" fontWeight="bold" textAnchor="middle">COVERED SLABS</text>
          </svg>
          <div className="p-2.5 rounded-2xl bg-blue-950/60 border border-blue-400/50 backdrop-blur-md text-center w-full">
            <span className="text-xs font-black text-blue-300 block">🚿 Zero Sewage on Street Surfaces</span>
            <p className="text-[10px] text-blue-100/80 mt-0.5">Subterranean soak pits trapped sludge before liquids entered main drains</p>
          </div>
        </div>
      );

    case 'bricks':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <svg viewBox="0 0 300 180" className="w-full max-w-[270px] drop-shadow-2xl">
            {/* 3D Isometric Burnt Brick */}
            <polygon points="70,90 190,50 250,80 130,120" fill="#ea580c" stroke="#fed7aa" strokeWidth="2" />
            <polygon points="70,90 130,120 130,160 70,130" fill="#9a3412" stroke="#fed7aa" strokeWidth="1.5" />
            <polygon points="130,120 250,80 250,120 130,160" fill="#c2410c" stroke="#fed7aa" strokeWidth="1.5" />
            
            {/* Dimension Indicators */}
            <text x="60" y="150" fill="#fde68a" fontSize="11" fontWeight="bold">1 (T)</text>
            <text x="90" y="115" fill="#fde68a" fontSize="11" fontWeight="bold">2 (W)</text>
            <text x="195" y="70" fill="#fde68a" fontSize="11" fontWeight="bold">4 (L)</text>
          </svg>
          <div className="p-2.5 rounded-2xl bg-amber-950/70 border border-amber-500/50 backdrop-blur-md text-center w-full">
            <span className="text-xs font-black text-amber-300 block">🧱 Universal 1:2:4 Dimensional Ratio</span>
            <p className="text-[10px] text-amber-100/80 mt-0.5">Thickness : Width : Length (Standard across 1,000+ sites)</p>
          </div>
        </div>
      );

    case 'dockyard':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <svg viewBox="0 0 320 180" className="w-full max-w-[280px] drop-shadow-2xl">
            {/* Lothal Tidal Basin */}
            <rect x="20" y="20" width="280" height="140" fill="#0f172a" stroke="#d97706" strokeWidth="3" rx="8" />
            <rect x="35" y="35" width="250" height="110" fill="#0284c7" opacity="0.8" rx="4" />
            {/* Bhogava River Inlet Channel */}
            <rect x="250" y="70" width="55" height="40" fill="#0369a1" />
            <rect x="245" y="65" width="8" height="50" fill="#f59e0b" stroke="#78350f" />
            <text x="249" y="60" fill="#fef08a" fontSize="7" fontWeight="black" textAnchor="middle">SLUICE</text>
            {/* Wooden Ship Berthing */}
            <polygon points="90,95 160,95 180,80 150,80" fill="#78350f" stroke="#fde68a" strokeWidth="1.5" />
            <line x1="125" y1="80" x2="125" y2="50" stroke="#fde68a" strokeWidth="2" />
            <polygon points="125,50 145,65 125,65" fill="#f8fafc" />
            <text x="100" y="125" fill="#f0f9ff" fontSize="9" fontWeight="bold">LOTHAL TIDAL DOCK</text>
          </svg>
          <div className="p-2.5 rounded-2xl bg-cyan-950/70 border border-cyan-500/50 backdrop-blur-md text-center w-full">
            <span className="text-xs font-black text-cyan-300 block">⚓ World's Earliest Artificial Tidal Dockyard</span>
            <p className="text-[10px] text-cyan-100/80 mt-0.5">Bhogava River inlet + Sluice gates maintained water levels for ships</p>
          </div>
        </div>
      );

    case 'reservoir':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <svg viewBox="0 0 300 180" className="w-full max-w-[270px] drop-shadow-2xl">
            {/* Terraced Rock-cut Reservoir in Dholavira */}
            <rect x="25" y="25" width="250" height="130" fill="#1e293b" stroke="#64748b" strokeWidth="3" rx="6" />
            <rect x="40" y="40" width="220" height="100" fill="#334155" />
            <rect x="55" y="55" width="190" height="70" fill="#0284c7" opacity="0.9" />
            {/* Step Flights */}
            <line x1="25" y1="90" x2="55" y2="90" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="30" y1="95" x2="55" y2="95" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="35" y1="100" x2="55" y2="100" stroke="#cbd5e1" strokeWidth="2" />
            <text x="150" y="95" fill="#f0f9ff" fontSize="10" fontWeight="black" textAnchor="middle">16 ROCK-CUT RESERVOIRS</text>
          </svg>
          <div className="p-2.5 rounded-2xl bg-blue-950/70 border border-blue-500/50 backdrop-blur-md text-center w-full">
            <span className="text-xs font-black text-blue-300 block">💧 Mega Rainwater Harvesting at Dholavira</span>
            <p className="text-[10px] text-blue-100/80 mt-0.5">16 massive stone-cut reservoirs secured water in arid Kutch desert</p>
          </div>
        </div>
      );

    case 'meluha':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <svg viewBox="0 0 320 180" className="w-full max-w-[280px] drop-shadow-2xl">
            {/* Map connecting Mesopotamia (left) and Meluha (right) */}
            <circle cx="60" cy="90" r="32" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
            <text x="60" y="85" fill="#fef3c7" fontSize="8" fontWeight="black" textAnchor="middle">MESOPOTAMIA</text>
            <text x="60" y="98" fill="#fde68a" fontSize="7" textAnchor="middle">(Ur / Sumer)</text>

            <circle cx="260" cy="90" r="32" fill="#065f46" stroke="#10b981" strokeWidth="2" />
            <text x="260" y="85" fill="#d1fae5" fontSize="8" fontWeight="black" textAnchor="middle">INDUS VALLEY</text>
            <text x="260" y="98" fill="#a7f3d0" fontSize="7" textAnchor="middle">(\"MELUHA\")</text>

            {/* Maritime Route Arrow */}
            <path d="M 92,90 Q 160,50 228,90" stroke="#38bdf8" strokeWidth="3" fill="none" strokeDasharray="5,3" />
            <circle cx="160" cy="70" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <text x="160" y="73" fill="#7dd3fc" fontSize="7" fontWeight="bold" textAnchor="middle">DILMUN</text>
          </svg>
          <div className="p-2.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 backdrop-blur-md text-center w-full">
            <span className="text-xs font-black text-emerald-300 block">🚢 Maritime Trade with Akkadian Empire</span>
            <p className="text-[10px] text-emerald-100/80 mt-0.5">Indus referred to as 'Meluha' via Persian Gulf staging posts</p>
          </div>
        </div>
      );

    case 'weights':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <svg viewBox="0 0 300 180" className="w-full max-w-[270px] drop-shadow-2xl">
            {/* Balance Scale */}
            <line x1="150" y1="30" x2="150" y2="150" stroke="#94a3b8" strokeWidth="4" />
            <line x1="70" y1="60" x2="230" y2="60" stroke="#f59e0b" strokeWidth="4" />
            {/* Left Pan (Chert Weights) */}
            <line x1="70" y1="60" x2="50" y2="110" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="70" y1="60" x2="90" y2="110" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="45" y="110" width="50" height="8" rx="2" fill="#475569" />
            <rect x="58" y="95" width="24" height="15" fill="#fde68a" stroke="#b45309" strokeWidth="1" />
            <text x="70" y="106" fill="#78350f" fontSize="8" fontWeight="bold" textAnchor="middle">16x</text>
            {/* Right Pan (Commodity) */}
            <line x1="230" y1="60" x2="210" y2="110" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="230" y1="60" x2="250" y2="110" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="205" y="110" width="50" height="8" rx="2" fill="#475569" />
            <circle cx="230" cy="100" r="10" fill="#fb923c" />
          </svg>
          <div className="p-2.5 rounded-2xl bg-amber-950/70 border border-amber-500/50 backdrop-blur-md text-center w-full">
            <span className="text-xs font-black text-amber-300 block">⚖️ Standard Binary Series: 1, 2, 4, 8, 16, 32</span>
            <p className="text-[10px] text-amber-100/80 mt-0.5">Unit 16 was the common base ratio (persisting up to modern 16 annas = 1 rupee)</p>
          </div>
        </div>
      );

    case 'lostwax':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <div className="grid grid-cols-4 gap-1.5 w-full text-[9px] text-center">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/50">
              <span className="text-xl block">🕯️</span>
              <span className="font-bold text-amber-300 block">1. Wax Model</span>
              <span className="text-slate-400">Bee wax sculpt</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-700">
              <span className="text-xl block">🏺</span>
              <span className="font-bold text-slate-300 block">2. Clay Coat</span>
              <span className="text-slate-400">Wrap in mud</span>
            </div>
            <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/50">
              <span className="text-xl block">🔥</span>
              <span className="font-bold text-rose-300 block">3. Melt Wax</span>
              <span className="text-slate-400">Pour bronze</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50">
              <span className="text-xl block">✨</span>
              <span className="font-bold text-emerald-300 block">4. Hollow Icon</span>
              <span className="text-slate-400">Break shell</span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-amber-900/40 border border-amber-500/40 text-center w-full">
            <span className="text-xs font-black text-amber-300">Cire Perdue (Lost-Wax Casting) Masterclass</span>
          </div>
        </div>
      );

    case 'dancinggirl':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-amber-500/50 shadow-2xl flex items-center justify-center gap-6">
            <div className="text-5xl animate-pulse">💃</div>
            <div className="text-left space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Mohenjo-daro Masterpiece</span>
              <h4 className="text-sm font-black text-white">Dancing Girl Figurine (10.5 cm)</h4>
              <p className="text-[10px] text-slate-300">
                Left arm stacked with shell bangles • Tribhanga posture • Tribally confident stance
              </p>
            </div>
          </div>
        </div>
      );

    case 'pashupati':
      return (
        <div className="w-full flex flex-col items-center space-y-2.5 animate-scaleUp">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border-2 border-amber-500/60 text-center w-full space-y-2">
            <span className="text-2xl">🧘‍♂️</span>
            <h5 className="text-xs font-black text-amber-300">Pashupati Seal (Proto-Shiva)</h5>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-1.5 rounded-lg bg-slate-800 text-amber-200">🐘 Elephant & 🐅 Tiger</div>
              <div className="p-1.5 rounded-lg bg-slate-800 text-amber-200">🦏 Rhino & 🐃 Buffalo</div>
            </div>
            <span className="text-[9.5px] text-emerald-400 font-bold block">+ 2 Deer beneath the yogic throne</span>
          </div>
        </div>
      );

    case 'cattle':
    case 'gavisthi':
    case 'terms':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <div className="grid grid-cols-3 gap-2 w-full text-center text-[10px]">
            <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/60">
              <span className="text-2xl block">🐄</span>
              <span className="font-black text-amber-300 block">Gau</span>
              <span className="text-amber-100/70 text-[9px]">Supreme Wealth</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/60">
              <span className="text-2xl block">⚔️</span>
              <span className="font-black text-rose-300 block">Gavisthi</span>
              <span className="text-rose-100/70 text-[9px]">Search for Cows</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60">
              <span className="text-2xl block">🌾</span>
              <span className="font-black text-emerald-300 block">Yava</span>
              <span className="text-emerald-100/70 text-[9px]">Barley Crop</span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-center w-full text-[10px] text-slate-300">
            <strong>Pastoral Ethos:</strong> Land was NOT private property; wealth was exclusively mobile livestock.
          </div>
        </div>
      );

    case 'rajan':
    case 'sabha':
    case 'samiti':
    case 'women':
    case 'vidatha':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <div className="grid grid-cols-3 gap-2 w-full text-center text-[10px]">
            <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-400">
              <span className="text-xl block">👴</span>
              <span className="font-black text-indigo-300 block">Sabha</span>
              <span className="text-slate-300 text-[8.5px]">Council of Elders</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-400">
              <span className="text-xl block">🗳️</span>
              <span className="font-black text-emerald-300 block">Samiti</span>
              <span className="text-slate-300 text-[8.5px]">Elected Rajan</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-400">
              <span className="text-xl block">⚖️</span>
              <span className="font-black text-purple-300 block">Vidatha</span>
              <span className="text-slate-300 text-[8.5px]">War Spoils</span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center w-full text-[10px] text-emerald-300 font-bold">
            👩 Women held full rights to attend and debate in Sabha & Samiti!
          </div>
        </div>
      );


    case 'dharma_wheel':
    case 'four_truths':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <svg viewBox="0 0 120 120" className="w-24 h-24 drop-shadow-xl animate-spin-slow">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="6" />
            <circle cx="60" cy="60" r="14" fill="#78350f" stroke="#fbbf24" strokeWidth="3" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1="60"
                y1="60"
                x2={60 + 50 * Math.cos((angle * Math.PI) / 180)}
                y2={60 + 50 * Math.sin((angle * Math.PI) / 180)}
                stroke="#fbbf24"
                strokeWidth="4"
              />
            ))}
          </svg>
          <div className="grid grid-cols-2 gap-2 w-full text-center text-[10px]">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/60">
              <span className="font-black text-amber-300 block">Dukkha ➔ Samudaya</span>
              <span className="text-amber-100/70 text-[9px]">Sorrow & Origin (Craving)</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/60">
              <span className="font-black text-emerald-300 block">Nirodha ➔ Magga</span>
              <span className="text-emerald-100/70 text-[9px]">Cessation & Eightfold Path</span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/90 border border-amber-400/40 text-center w-full text-[10px] text-amber-200">
            ☸️ <strong>Pratityasamutpada:</strong> 12-link causal wheel of dependent origination.
          </div>
        </div>
      );

    case 'councils':
      return (
        <div className="w-full flex flex-col items-center space-y-2 animate-scaleUp">
          <div className="grid grid-cols-2 gap-2 w-full text-[9.5px]">
            <div className="p-2 rounded-xl bg-slate-900 border border-indigo-500/50 space-y-0.5">
              <span className="font-black text-indigo-300 block">1st: Rajgriha (483 BCE)</span>
              <span className="text-slate-300 block">King: Ajatashatru</span>
              <span className="text-indigo-200/80 text-[8.5px]">Vinaya & Sutta Pitakas</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/50 space-y-0.5">
              <span className="font-black text-cyan-300 block">2nd: Vaishali (383 BCE)</span>
              <span className="text-slate-300 block">King: Kalasoka</span>
              <span className="text-cyan-200/80 text-[8.5px]">1st Schism: Sthavira vs Mahasanghika</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-amber-500/50 space-y-0.5">
              <span className="font-black text-amber-300 block">3rd: Pataliputra (250 BCE)</span>
              <span className="text-slate-300 block">King: Ashoka</span>
              <span className="text-amber-200/80 text-[8.5px]">Abhidhamma Pitaka added</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-rose-500/50 space-y-0.5">
              <span className="font-black text-rose-300 block">4th: Kashmir (72 CE)</span>
              <span className="text-slate-300 block">King: Kanishka</span>
              <span className="text-rose-200/80 text-[8.5px]">Hinayana vs Mahayana</span>
            </div>
          </div>
          <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-center w-full text-[9px] text-amber-300 font-bold">
            💡 King Memory Trick: A-K-A-K (Ajatashatru, Kalasoka, Ashoka, Kanishka)
          </div>
        </div>
      );

    case 'anekantavada':
    case 'jain_symbols':
      return (
        <div className="w-full flex flex-col items-center space-y-2.5 animate-scaleUp">
          <div className="p-3 rounded-2xl bg-gradient-to-b from-amber-950/90 to-slate-900 border-2 border-amber-500/60 text-center w-full space-y-1.5">
            <span className="text-3xl">💎</span>
            <h5 className="text-xs font-black text-amber-300 uppercase">Triratna (Three Jewels)</h5>
            <div className="grid grid-cols-3 gap-1.5 text-[9px]">
              <div className="p-1.5 rounded-lg bg-slate-800 text-amber-200">Samyag Darshana<br/>(Right Faith)</div>
              <div className="p-1.5 rounded-lg bg-slate-800 text-amber-200">Samyag Jnana<br/>(Right Knowledge)</div>
              <div className="p-1.5 rounded-lg bg-slate-800 text-amber-200">Samyag Charitra<br/>(Right Conduct)</div>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-indigo-950/70 border border-indigo-400/50 text-center w-full text-[10px] text-indigo-200">
            🐘 <strong>Syadvada & Anekantavada:</strong> Truth has multiple perspectives; no single dogmatic view captures reality.
          </div>
        </div>
      );

    case 'mahajanapadas_map':
    case 'republics':
      return (
        <div className="w-full flex flex-col items-center space-y-2.5 animate-scaleUp">
          <div className="grid grid-cols-2 gap-2 w-full text-center">
            <div className="p-2.5 rounded-xl bg-gradient-to-b from-purple-950 to-slate-900 border border-purple-500/60">
              <span className="text-2xl block">👑</span>
              <span className="text-[10px] font-black text-purple-300 block uppercase">Hereditary Monarchies</span>
              <span className="text-[9px] text-purple-200/80">Magadha, Kosala, Vatsa • Standing Armies & Bhaga Tax</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-b from-teal-950 to-slate-900 border border-teal-500/60">
              <span className="text-2xl block">🏛️</span>
              <span className="text-[10px] font-black text-teal-300 block uppercase">Ganasangha Republics</span>
              <span className="text-[9px] text-teal-200/80">Vajji, Malla • Santhagara Assembly • Clan Oligarchies</span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-center w-full text-[9.5px] text-amber-200">
            ⛰️ <strong>Magadha Edge:</strong> Rajgir iron mines, war elephants, and Ganga river transport supremacy.
          </div>
        </div>
      );

    case 'tinai_matrix':
      return (
        <div className="w-full flex flex-col items-center space-y-2 animate-scaleUp">
          <div className="grid grid-cols-3 gap-1.5 w-full text-center text-[9px]">
            <div className="p-2 rounded-xl bg-slate-900 border border-emerald-500/60">
              <span className="font-black text-emerald-300 block">Kurinji (Hills)</span>
              <span className="text-slate-300">Murugan • Hunting</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-amber-500/60">
              <span className="font-black text-amber-300 block">Mullai (Forest)</span>
              <span className="text-slate-300">Mayon • Pastoralism</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/60">
              <span className="font-black text-cyan-300 block">Marudam (Plains)</span>
              <span className="text-slate-300">Vendan • Agriculture</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 w-full text-center text-[9px]">
            <div className="p-2 rounded-xl bg-slate-900 border border-blue-500/60">
              <span className="font-black text-blue-300 block">Neydal (Coast)</span>
              <span className="text-slate-300">Varunan • Fishing & Salt</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-rose-500/60">
              <span className="font-black text-rose-300 block">Palai (Arid)</span>
              <span className="text-slate-300">Kotravai • Robbery</span>
            </div>
          </div>
        </div>
      );

    case 'administration_pillars':
    case 'mansab_ranks':
      return (
        <div className="w-full flex flex-col items-center space-y-2.5 animate-scaleUp">
          <div className="grid grid-cols-2 gap-2 w-full text-center">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-indigo-500/60">
              <span className="text-xl block">📜</span>
              <span className="text-[10px] font-black text-indigo-300 block uppercase">Zat Rank</span>
              <span className="text-[9px] text-slate-300">Personal rank, status & salary in the imperial hierarchy</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/60">
              <span className="text-xl block">🐎</span>
              <span className="text-[10px] font-black text-emerald-300 block uppercase">Sawar Rank</span>
              <span className="text-[9px] text-slate-300">Number of armed cavalry troops required to maintain</span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-center w-full text-[9.5px] text-amber-200">
            ⚖️ <strong>UPSC Trap:</strong> Mansabdari was non-hereditary; officials were transferred across Jagirs to prevent autonomy.
          </div>
        </div>
      );

    case 'satyagraha_trilogy':
      return (
        <div className="w-full flex flex-col items-center space-y-2.5 animate-scaleUp">
          <div className="grid grid-cols-3 gap-1.5 w-full text-center text-[9px]">
            <div className="p-2 rounded-xl bg-slate-900 border border-amber-500/60 space-y-1">
              <span className="font-black text-amber-300 block">Champaran (1917)</span>
              <span className="text-white font-bold block bg-amber-500/30 px-1 py-0.5 rounded text-[8px]">1st Civil Disobedience</span>
              <span className="text-slate-300 text-[8px]">Tinkathia Indigo System</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-rose-500/60 space-y-1">
              <span className="font-black text-rose-300 block">Ahmedabad (1918)</span>
              <span className="text-white font-bold block bg-rose-500/30 px-1 py-0.5 rounded text-[8px]">1st Hunger Strike</span>
              <span className="text-slate-300 text-[8px]">35% Plague Bonus</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-emerald-500/60 space-y-1">
              <span className="font-black text-emerald-300 block">Kheda (1918)</span>
              <span className="text-white font-bold block bg-emerald-500/30 px-1 py-0.5 rounded text-[8px]">1st Non-Cooperation</span>
              <span className="text-slate-300 text-[8px]">Tax Remission Demand</span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-indigo-950/70 border border-indigo-400/50 text-center w-full text-[9.5px] text-indigo-200">
            🎯 <strong>UPSC Memory Matrix:</strong> Champaran = Civil Disob. • Ahmedabad = Fasting • Kheda = Non-Cooperation
          </div>
        </div>
      );


    // ----------------------------------------------------
    // DYNAMIC TOPIC-SPECIFIC VISUAL STAGES (No copying across topics)
    // ----------------------------------------------------
    case 'dynamic_thesis':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/95 via-indigo-950/80 to-slate-900 border-2 border-indigo-500/60 shadow-2xl text-center w-full space-y-2">
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-600/80 text-white px-2.5 py-0.5 rounded-full font-mono">
                {scene?.tag || 'Core Thesis'}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-amber-300 tracking-tight leading-snug">
              {scene?.title || currentConfig?.title}
            </h4>
            <p className="text-[10px] text-slate-200 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/10 font-medium">
              {scene?.hook || 'Key historical transformation shaping the Indian subcontinent.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full text-center text-[9px]">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/50 backdrop-blur-md">
              <span className="font-black text-indigo-300 block">🏛️ Syllabus Alignment</span>
              <span className="text-indigo-100/80 text-[8.5px]">GS Paper 1 High Yield</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/50 backdrop-blur-md">
              <span className="font-black text-amber-300 block">⚡ Visual Concept</span>
              <span className="text-amber-100/80 text-[8.5px]">Verified Commission Topic</span>
            </div>
          </div>
        </div>
      );

    case 'dynamic_mechanics':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-850 to-slate-900 border-2 border-cyan-500/60 shadow-2xl text-center w-full space-y-2">
            <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-cyan-600/80 text-white px-2.5 py-0.5 rounded-full font-mono">
              ⚙️ Structural Mechanics &amp; Causation
            </span>
            <div className="space-y-1.5 text-left text-[9.5px]">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-cyan-500/30 flex items-start gap-2">
                <span className="text-cyan-400 font-bold shrink-0">1.</span>
                <span className="text-slate-200">Material Antecedents &amp; Economic Drivers</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-cyan-500/30 flex items-start gap-2">
                <span className="text-cyan-400 font-bold shrink-0">2.</span>
                <span className="text-slate-200">Institutional Evolution &amp; Social Relations</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-cyan-500/30 flex items-start gap-2">
                <span className="text-cyan-400 font-bold shrink-0">3.</span>
                <span className="text-slate-200">Long-term Geopolitical &amp; Cultural Impact</span>
              </div>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-center w-full text-[9px] text-slate-300">
            <strong>Key Process:</strong> Connect material production with state formation and philosophical response.
          </div>
        </div>
      );

    case 'dynamic_matrix':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/95 via-purple-950/70 to-slate-900 border-2 border-purple-500/60 shadow-2xl text-center w-full space-y-2">
            <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-purple-600/80 text-white px-2.5 py-0.5 rounded-full font-mono">
              📊 Terminology &amp; Key Institutions
            </span>
            <div className="grid grid-cols-2 gap-2 text-left text-[9.5px]">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-purple-400/40 space-y-1">
                <span className="text-purple-300 font-bold block text-[9px] uppercase">Official Terminology</span>
                <p className="text-slate-200 text-[9px] leading-tight">Key administrative, socio-economic, or doctrinal vocabulary.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-purple-400/40 space-y-1">
                <span className="text-purple-300 font-bold block text-[9px] uppercase">Functional Mandate</span>
                <p className="text-slate-200 text-[9px] leading-tight">State taxation, judicial duties, or monastic rules.</p>
              </div>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/40 text-center w-full text-[9px] text-purple-200">
            💡 Pay special attention to exact Sanskrit, Prakrit, Persian, or Tamil nomenclature.
          </div>
        </div>
      );

    case 'dynamic_trap':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <div className="p-4 rounded-2xl bg-gradient-to-b from-rose-950/95 via-red-950/80 to-slate-900 border-2 border-rose-500 shadow-2xl text-center w-full space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-[9.5px] font-black uppercase font-mono tracking-wider shadow-md">
              <span>⚠️</span>
              <span>UPSC Examiner Trap Alert</span>
            </div>
            <h5 className="text-xs font-black text-rose-200 uppercase">
              {scene?.title || 'Frequent Civil Services Misconception'}
            </h5>
            <div className="p-3 rounded-xl bg-black/50 border border-rose-500/40 text-left">
              <span className="text-[9px] uppercase font-bold text-rose-400 block mb-0.5 font-mono">
                🛑 Watch Out For:
              </span>
              <p className="text-[10px] text-rose-100 font-medium leading-relaxed">
                {scene?.audioText || 'Be careful of chronological sequence reversals and false generalizations tested in Prelims!'}
              </p>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/50 backdrop-blur-md text-center w-full text-[9px] text-amber-200 font-bold">
            🎯 Negative Marks Savior: Memorize this specific exception!
          </div>
        </div>
      );

    case 'dynamic_revision':
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/95 via-teal-950/80 to-slate-900 border-2 border-emerald-500 shadow-2xl text-center w-full space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[9.5px] font-black uppercase font-mono tracking-wider shadow-md">
              <span>⚡</span>
              <span>10-Second Master Recall Capsule</span>
            </div>
            <h5 className="text-xs font-black text-emerald-200 uppercase">
              {currentConfig?.title || 'UPSC Exam Takeaway'}
            </h5>
            <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/40 text-left">
              <span className="text-[9px] uppercase font-bold text-emerald-400 block mb-0.5 font-mono">
                ✨ Core Takeaway:
              </span>
              <p className="text-[10.5px] text-emerald-100 font-bold leading-relaxed">
                {scene?.audioText || currentConfig?.title}
              </p>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/50 backdrop-blur-md text-center w-full text-[9px] text-emerald-200 font-bold">
            🧠 High Recall: Lock this formula into your mental archive before test day.
          </div>
        </div>
      );

    case 'colonial_trade':
    case 'tribal_resistance':
    case 'reform_movements':
    case 'swadeshi':
    case 'revolutionary':
    case 'princely_accession':
    case 'rock_cut':
    case 'dynamic_era':
    case 'exceptions':
      // Specifically for Harappan City exceptions (Dholavira & Chanhudaro)
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <div className="grid grid-cols-2 gap-2.5 w-full">
            <div className="p-3 rounded-2xl bg-gradient-to-b from-indigo-900/90 to-slate-900 border-2 border-indigo-400 shadow-xl text-center space-y-1">
              <span className="text-2xl">🏛️</span>
              <h5 className="text-xs font-black text-indigo-200 uppercase">Dholavira</h5>
              <span className="inline-block text-[9px] font-black uppercase bg-indigo-500 text-white px-1.5 py-0.5 rounded shadow-sm">
                3-Tier Layout
              </span>
              <p className="text-[9px] text-indigo-100/80 leading-tight pt-1">
                Citadel + Middle Town + Lower Town
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-b from-rose-900/90 to-slate-900 border-2 border-rose-400 shadow-xl text-center space-y-1">
              <span className="text-2xl">⚠️</span>
              <h5 className="text-xs font-black text-rose-200 uppercase">Chanhudaro</h5>
              <span className="inline-block text-[9px] font-black uppercase bg-rose-600 text-white px-1.5 py-0.5 rounded shadow-sm">
                No Citadel!
              </span>
              <p className="text-[9px] text-rose-100/80 leading-tight pt-1">
                Only IVC city completely unfortified
              </p>
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/50 backdrop-blur-md text-center w-full">
            <span className="text-xs font-black text-amber-300 block">🎯 Prelims Gold Rule</span>
            <p className="text-[10px] text-amber-100/80 mt-0.5">UPSC tests these key exceptions every 2–3 years!</p>
          </div>
        </div>
      );

    case 'trap':
    default:
      if (scene && scene.tag?.toLowerCase().includes('trap')) {
        return (
          <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
            <div className="p-4 rounded-2xl bg-gradient-to-b from-rose-950/95 via-red-950/80 to-slate-900 border-2 border-rose-500 shadow-2xl text-center w-full space-y-2">
              <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-mono">
                ⚠️ UPSC Examiner Trap Alert
              </span>
              <h5 className="text-xs font-black text-rose-200 uppercase">{scene.title || 'Examiner Trap'}</h5>
              <p className="text-[10px] text-rose-100 bg-black/40 p-2.5 rounded-xl border border-rose-500/30 text-left font-medium leading-relaxed">
                {scene.audioText}
              </p>
            </div>
          </div>
        );
      }
      return (
        <div className="w-full flex flex-col items-center space-y-3 animate-scaleUp">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/95 via-indigo-950/70 to-slate-900 border-2 border-indigo-500/60 shadow-2xl text-center w-full space-y-2">
            <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-indigo-600/80 text-white px-2.5 py-0.5 rounded-full shadow-sm font-mono">
              {scene?.tag || 'High-Yield UPSC Concept'}
            </span>
            <h4 className="text-sm font-black text-amber-300 tracking-tight">
              {scene?.title || currentConfig?.title}
            </h4>
            <p className="text-[10px] text-slate-200 leading-relaxed bg-black/40 p-2 rounded-xl border border-white/10">
              {scene?.hook || 'Key historical transformation shaping the Indian subcontinent.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full text-center text-[9px]">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/50 backdrop-blur-md">
              <span className="font-black text-amber-300 block">🏛️ Historical Core</span>
              <span className="text-amber-100/80 text-[8.5px]">Direct UPSC Syllabus Alignment</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/50 backdrop-blur-md">
              <span className="font-black text-emerald-300 block">⚡ High Recall</span>
              <span className="text-emerald-100/80 text-[8.5px]">Verified Commission Patterns</span>
            </div>
          </div>
        </div>
      );
  }
}

export default function NativeMotionShort({ subtopicKey = 'his_1_p0_s0_b0' }) {
  const currentConfig = getHistoryReel(subtopicKey);
  const scenes = currentConfig.scenes;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  const [likesCount, setLikesCount] = useState(1420);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTapRipple, setShowTapRipple] = useState(null); // 'play' or 'pause'
  
  // Voice selection states
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [activeWordChar, setActiveWordChar] = useState(-1);

  // Reset index when subtopicKey changes
  useEffect(() => {
    setCurrentIdx(0);
    setProgress(0);
    setIsPlaying(false);
  }, [subtopicKey]);

  const activeScene = scenes[currentIdx] || scenes[0];
  const timerRef = useRef(null);
  const synthUtteranceRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  const currentIdxRef = useRef(currentIdx);
  const isMutedRef = useRef(isMuted);
  const playbackSpeedRef = useRef(playbackSpeed);
  const scenesRef = useRef(scenes);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    currentIdxRef.current = currentIdx;
    isMutedRef.current = isMuted;
    playbackSpeedRef.current = playbackSpeed;
    scenesRef.current = scenes;
  }, [isPlaying, currentIdx, isMuted, playbackSpeed, scenes]);

  // Voice Detection & Auto-Indian Female Selection
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const findBestSweetIndianFemaleVoice = (voicesList) => {
      if (!voicesList || voicesList.length === 0) return null;

      const indianFemale = voicesList.find((v) => {
        const name = v.name.toLowerCase();
        const lang = (v.lang || '').toLowerCase();
        const isIndianLang = lang.includes('en-in') || lang.includes('en_in') || lang.includes('hi');
        const hasFemaleIndicator = 
          name.includes('heera') || 
          name.includes('neerja') || 
          name.includes('kalpana') || 
          name.includes('swara') || 
          name.includes('priya') || 
          name.includes('veena') || 
          name.includes('female');
        return isIndianLang && hasFemaleIndicator;
      });

      if (indianFemale) return indianFemale;

      const anyIndian = voicesList.find((v) => {
        const lang = (v.lang || '').toLowerCase();
        const name = v.name.toLowerCase();
        return lang.includes('en-in') || lang.includes('en_in') || name.includes('india');
      });

      if (anyIndian) return anyIndian;

      const anyNaturalFemale = voicesList.find((v) => {
        const name = v.name.toLowerCase();
        return (
          name.includes('zira') || 
          name.includes('aria') || 
          name.includes('jenny') || 
          name.includes('samantha') || 
          name.includes('female')
        );
      });

      if (anyNaturalFemale) return anyNaturalFemale;
      return voicesList.find(v => v.lang.startsWith('en')) || voicesList[0];
    };

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;
      setAvailableVoices(voices);

      const best = findBestSweetIndianFemaleVoice(voices);
      if (best) setSelectedVoice(best);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Narration Start
  const startNarrationForCurrentScene = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (isMutedRef.current) return;

    const scene = scenesRef.current[currentIdxRef.current];
    if (!scene) return;

    const speechText = normalizeYearsAndSpeech(scene.audioText);
    const utterance = new SpeechSynthesisUtterance(speechText);
    if (selectedVoice) utterance.voice = selectedVoice;

    // Sweet Indian female tone
    utterance.pitch = 1.18;
    utterance.rate = 0.92 * playbackSpeedRef.current;

    utterance.onboundary = (e) => {
      if (e.name === 'word') setActiveWordChar(e.charIndex);
    };

    // Transition only when narration finishes 100%
    utterance.onend = () => {
      if (!isPlayingRef.current) return;
      setProgress(100);
      setTimeout(() => {
        if (isPlayingRef.current) {
          const nextIdx = (currentIdxRef.current + 1) % scenesRef.current.length;
          setCurrentIdx(nextIdx);
          setProgress(0);
          setActiveWordChar(-1);
        }
      }, 450);
    };

    utterance.onerror = (err) => {
      console.warn("Speech notice:", err);
    };

    synthUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Playback timer & progress calculation
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else {
      startNarrationForCurrentScene();
    }

    const wordsCount = (activeScene.audioText || '').split(' ').length;
    const estimatedSeconds = Math.max(7.5, (wordsCount / 2.1) / playbackSpeed);
    const totalMs = estimatedSeconds * 1000;
    const intervalMs = 50;
    const step = (intervalMs / totalMs) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (!isMutedRef.current) {
          if (prev >= 96) return 96;
          return prev + step;
        }

        if (prev >= 100) {
          const nextIdx = (currentIdxRef.current + 1) % scenesRef.current.length;
          setCurrentIdx(nextIdx);
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIdx, playbackSpeed, isMuted, selectedVoice, subtopicKey]);

  const handleScreenTap = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    setShowTapRipple(nextState ? 'play' : 'pause');
    setTimeout(() => setShowTapRipple(null), 600);
  };

  const handleBarClick = (idx, e) => {
    e.stopPropagation();
    setCurrentIdx(idx);
    setProgress(0);
    setActiveWordChar(-1);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (!isLiked) {
      setLikesCount(c => c + 1);
      setIsLiked(true);
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
    } else {
      setLikesCount(c => c - 1);
      setIsLiked(false);
    }
  };

  const getCleanVoiceName = (voice) => {
    if (!voice) return 'Indian Voice';
    let name = voice.name;
    if (name.includes('Microsoft Heera')) return '🇮🇳 Sweet Indian (Heera)';
    if (name.includes('Microsoft Neerja')) return '🇮🇳 Indian Educator (Neerja)';
    if (name.includes('Google English (India)') || name.includes('en-IN')) return '🇮🇳 Indian English (Google)';
    if (name.includes('Zira')) return 'Natural English (Zira)';
    if (name.includes('Jenny')) return 'Natural English (Jenny)';
    return `${voice.name.replace(/(Microsoft|Google)\s*/g, '').substring(0, 20)}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-1 sm:p-4 select-none animate-fadeIn">
      
      {/* 9:16 VERTICAL SHORTS PHONE CANVAS */}
      <div 
        onClick={handleScreenTap}
        className="relative w-full max-w-[390px] aspect-[9/16] max-h-[84vh] rounded-[32px] sm:rounded-[40px] overflow-hidden bg-slate-950 border-4 border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col justify-between cursor-pointer group select-none"
      >
        
        {/* TOP STORYLINE PROGRESS BARS */}
        <div className="absolute top-0 left-0 right-0 p-3 pt-4 z-40 flex items-center gap-1.5 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
          {scenes.map((scene, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const width = isCompleted ? '100%' : isCurrent ? `${progress}%` : '0%';

            return (
              <div
                key={scene.id}
                onClick={(e) => handleBarClick(idx, e)}
                className="flex-1 h-1.5 rounded-full bg-white/25 overflow-hidden cursor-pointer"
                title={scene.title}
              >
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-400 rounded-full transition-all duration-75 shadow-sm"
                  style={{ width }}
                />
              </div>
            );
          })}
        </div>

        {/* TOP STATUS OVERLAY & VOICE CONTROL */}
        <div className="absolute top-8 left-3.5 right-3.5 z-30 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-md shadow-md animate-pulse">
              LIVE SHORT
            </span>
            <span className="text-[10px] font-bold text-white/90 drop-shadow-md">
              Scene {activeScene.id}/{scenes.length}
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowVoiceMenu(!showVoiceMenu);
              }}
              className="px-2 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-200 text-[10px] font-bold flex items-center gap-1 hover:bg-rose-900 transition-all cursor-pointer shadow-sm"
              title="Change Voice Accent"
            >
              <span>🌸</span>
              <span className="max-w-[100px] truncate">{getCleanVoiceName(selectedVoice)}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className={`p-1.5 rounded-full backdrop-blur-md border text-xs transition-all cursor-pointer ${
                !isMuted 
                  ? 'bg-emerald-500/80 border-emerald-400 text-white shadow-xs' 
                  : 'bg-black/50 border-white/20 text-white/70'
              }`}
              title={isMuted ? "Unmute Voice" : "Mute Voice"}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* VOICE SELECTOR DROPDOWN POPUP */}
        {showVoiceMenu && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute top-16 right-3.5 left-3.5 z-50 p-3 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-xl space-y-2 animate-scaleUp"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-black text-rose-400 flex items-center gap-1">
                <span>🌸</span>
                <span>Select Narration Voice</span>
              </span>
              <button 
                onClick={() => setShowVoiceMenu(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-1"
              >
                ✕
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {availableVoices
                .filter(v => v.lang.startsWith('en') || v.lang.startsWith('hi'))
                .map((v, i) => {
                  const isCur = selectedVoice?.name === v.name;
                  const isIndian = v.lang.includes('IN') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('heera');

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedVoice(v);
                        setShowVoiceMenu(false);
                        if (isPlaying) startNarrationForCurrentScene();
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-between ${
                        isCur ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{isIndian ? '🇮🇳' : '🎙️'}</span>
                        <span className="truncate">{v.name}</span>
                      </span>
                      {isIndian && (
                        <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-mono shrink-0">
                          Sweet Indian
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAP RIPPLE ICON OVERLAY */}
        {showTapRipple && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-3xl text-white animate-ping">
              {showTapRipple === 'play' ? '▶️' : '⏸️'}
            </div>
          </div>
        )}

        {/* FLOATING HEART BURST ANIMATION */}
        {showHeartBurst && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <span className="text-7xl animate-bounce drop-shadow-2xl">❤️</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* CENTER VISUAL STAGE: DYNAMIC SVG ENGINE                   */}
        {/* ======================================================== */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 bg-radial from-amber-500/10 via-rose-500/10 to-transparent animate-pulse" />
          <SceneVisualEngine visualType={activeScene.visualType} scene={activeScene} currentConfig={currentConfig} />
        </div>

        {/* ======================================================== */}
        {/* RIGHT FLOATING SHORTS ACTION STACK                       */}
        {/* ======================================================== */}
        <div className="absolute right-2.5 bottom-28 z-40 flex flex-col items-center gap-3.5">
          <button onClick={handleLike} className="flex flex-col items-center gap-0.5 cursor-pointer group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all transform active:scale-125 ${
              isLiked 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50' 
                : 'bg-black/40 text-white/90 border border-white/20 hover:bg-black/60'
            }`}>
              <span className="text-base">{isLiked ? '❤️' : '🤍'}</span>
            </div>
            <span className="text-[9.5px] font-bold text-white drop-shadow-md">{likesCount}</span>
          </button>

          <button onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }} className="flex flex-col items-center gap-0.5 cursor-pointer group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-125 ${
              isBookmarked 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/50' 
                : 'bg-black/40 text-white/90 border border-white/20 hover:bg-black/60'
            }`}>
              <span className="text-base">{isBookmarked ? '⭐' : '🔖'}</span>
            </div>
            <span className="text-[9.5px] font-bold text-white drop-shadow-md">Save</span>
          </button>

          <button onClick={(e) => { e.stopPropagation(); setCurrentIdx((idx) => (idx + 1) % scenes.length); setProgress(0); setActiveWordChar(-1); }} className="flex flex-col items-center gap-0.5 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white/90 backdrop-blur-md hover:bg-black/60 active:scale-125 transition-all">
              <span className="text-sm">⏭️</span>
            </div>
            <span className="text-[9.5px] font-bold text-white drop-shadow-md">Next</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM METADATA & KINETIC SYNCHRONIZED CAPTIONS HUD       */}
        {/* ======================================================== */}
        <div className="p-4 pt-2 z-30 bg-gradient-to-t from-black via-black/90 to-transparent space-y-2">
          
          {/* Kinetic Big Caption Ticker */}
          <div className="min-h-[46px] flex flex-wrap items-center justify-center text-center px-1">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {(activeScene.subtitleWords || []).map((word, wIdx) => (
                <span 
                  key={wIdx}
                  className={`text-xs sm:text-sm font-black uppercase tracking-tight transition-all duration-150 ${
                    word.highlight 
                      ? 'text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-400/40 shadow-sm animate-pulse' 
                      : 'text-white drop-shadow-md'
                  }`}
                >
                  {word.text}
                </span>
              ))}
            </div>
          </div>

          {/* Creator Tag & Topic Hook */}
          <div className="space-y-0.5 pr-14">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-[10px]">
                🏛️
              </span>
              <span className="text-[11px] font-black text-white drop-shadow-md">
                @PocketUPSC • {currentConfig.title}
              </span>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/40">
                Verified
              </span>
            </div>

            <p className="text-[11px] font-medium text-white/80 line-clamp-1 leading-snug drop-shadow-sm">
              {activeScene.hook}
            </p>

            <div className="flex items-center gap-1 text-[9.5px] text-white/60 pt-0.5">
              <span>🎵</span>
              <span className="truncate">
                {selectedVoice ? `Voice: ${getCleanVoiceName(selectedVoice)}` : 'Sweet Indian Voice'}
              </span>
            </div>
          </div>

          {!isPlaying && (
            <div className="pt-1 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(true);
                }}
                className="w-full py-2 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 hover:from-rose-500 hover:to-amber-400 text-white rounded-xl text-xs font-black shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>▶️ Tap to Listen in Indian Voice</span>
              </button>
            </div>
          )}

        </div>

      </div>

      <div className="mt-3 text-center max-w-sm space-y-1">
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          🌸 <strong>Sweet Indian Female Narration:</strong> Voice holds each scene until narration is 100% complete before advancing!
        </p>
      </div>

    </div>
  );
}
