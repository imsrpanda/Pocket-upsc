import React, { useState } from 'react';
import {
  HydraulicDockyardVisualizer,
  TradeAndWeightsVisualizer,
  MetallurgyAndArtVisualizer,
  RigVedicPastoralVisualizer,
  TribalAssembliesVisualizer,
  BuddhismJainismVisualizer,
  MahajanapadasVisualizer,
  SangamAgeVisualizer,
  MedievalSystemsVisualizer,
  ModernFreedomVisualizer,
  UniversalHistoryFlowVisualizer
} from './HistoryVisualizers';

const HOTSPOTS = {
  great_bath: {
    id: 'great_bath',
    name: 'The Great Bath',
    zone: 'Citadel (Mohenjo-daro)',
    icon: '🏛️',
    summary: 'A 12m × 7m rectangular tank built for elite ceremonial and ritual purification.',
    features: [
      'Lined with fine burnt bricks coated with gypsum mortar.',
      'Waterproofed with a thick layer of natural bitumen (asphalt).',
      'Double flight of brick steps leading down from the north and south.',
      'Surrounded by a courtyard with rooms on three sides (changing cells / priest quarters).'
    ],
    upscTip: 'UPSC Trap: No temples or royal palaces have been found in the Citadel; the Great Bath was for public ritual cleansing, not royal recreation.'
  },
  granary: {
    id: 'granary',
    name: 'Strategic State Granaries',
    zone: 'Citadel (Harappa & Mohenjo-daro)',
    icon: '🌾',
    summary: 'Massive elevated food security storage vaults with advanced ventilation.',
    features: [
      'Built upon raised brick platforms to prevent river flooding and dampness.',
      'Constructed with sub-floor air ducts (ventilation channels) to prevent grain rot.',
      'Positioned adjacent to riverbanks for efficient boat transport of grains.',
      'Indicates a centralized administrative authority and tax collection in agricultural produce.'
    ],
    upscTip: 'UPSC Trap: Circular brick threshing floors were discovered specifically north of the Granaries at Harappa, demonstrating state-controlled labor.'
  },
  assembly_hall: {
    id: 'assembly_hall',
    name: 'Pillared Assembly Hall',
    zone: 'Citadel (Mohenjo-daro)',
    icon: '🏛️',
    summary: 'A 20-pillared square hall supporting a collegiate administration.',
    features: [
      'Contains four rows of five rectangular brick pillars.',
      'Likely functioned as a civic council chamber, marketplace, or administrative center.',
      'Lacks any dynastic or monarchical throne—supports the theory of an oligarchy of merchant-rulers.'
    ],
    upscTip: 'UPSC Trap: The lack of monuments dedicated to a single monarch strongly suggests the Indus civilization was governed by a civic guild or oligarchy.'
  },
  cardinal_grid: {
    id: 'cardinal_grid',
    name: 'Cardinal Grid Layout',
    zone: 'Lower Town (Universal across IVC)',
    icon: '📐',
    summary: 'Master-planned orthogonal street grid running cardinally North-South & East-West.',
    features: [
      'Main avenues were up to 9–10 meters wide, intersecting at precise 90° right angles.',
      'Prevailing winds along the cardinal axes naturally blew street debris away (natural civic self-cleansing).',
      'Streets divided the town into regular rectangular blocks (insulae).'
    ],
    upscTip: 'UPSC Trap: The grid pattern was universally maintained across thousands of kilometers, proving rigorous municipal standardization.'
  },
  drainage: {
    id: 'drainage',
    name: 'Covered Drainage & Soak Pits',
    zone: 'Lower Town (Civic Sanitation)',
    icon: '🚿',
    summary: 'World-first subterranean covered sewage and municipal wastewater infrastructure.',
    features: [
      'Private bathroom floors sloped toward terracotta drain pipes running through house walls.',
      'Discharged first into a settling sump (soak pit) to trap solid waste before liquids entered street drains.',
      'Main street channels were lined with burnt bricks and covered with removable limestone slabs for inspection.',
      'Incorporated regular inspection manholes for municipal sanitation maintenance.'
    ],
    upscTip: 'UPSC Trap: Contemporary Mesopotamian and Egyptian cities completely lacked covered sewage networks. This is a unique Harappan hallmark.'
  },
  houses: {
    id: 'houses',
    name: 'Courtyard-Centric Domestic Homes',
    zone: 'Lower Town (Residential)',
    icon: '🏠',
    summary: 'Double-storied private dwellings emphasizing acoustic and visual privacy.',
    features: [
      'Rooms were arranged around a central open-air courtyard where domestic chores took place.',
      'No ground-floor windows faced the main avenues—preserving privacy and insulating from street noise.',
      'Main entry doors were located on narrow side alleys, never directly on main boulevards.',
      'Nearly every home possessed a dedicated brick-paved bathroom and its own fresh water well.'
    ],
    upscTip: 'UPSC Trap: Harappan houses prioritized interior privacy over grand exterior facades; burnt bricks were used for functional longevity.'
  }
};

const EXCEPTIONS = [
  {
    city: 'Dholavira (Kutch, Gujarat)',
    badge: 'Tri-Furcated City',
    highlight: 'Unique 3-tier planning: Citadel, Middle Town, and Lower Town surrounded by massive stone fortifications.',
    detail: 'Also features 16 colossal rock-cut rainwater reservoirs and a 10-character signboard inscription.',
    color: 'border-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-950/30'
  },
  {
    city: 'Chanhudaro (Sindh)',
    badge: 'No Fortified Citadel',
    highlight: 'The ONLY Harappan settlement that completely lacks a raised, fortified Citadel.',
    detail: 'Exclusively an industrial manufacturing hub for carnelian beads, shell cutting, and seal making.',
    color: 'border-rose-500/50 bg-rose-50/50 dark:bg-rose-950/30'
  },
  {
    city: 'Lothal (Bhogava River, Gujarat)',
    badge: 'No Internal Wall Partition',
    highlight: 'Citadel and Lower Town are not separated by an interior wall, but contained within a single outer wall.',
    detail: 'Features the world’s earliest tidal burnt-brick dockyard with sluice gates for maritime trade.',
    color: 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/30'
  },
  {
    city: 'Kalibangan (Ghaggar, Rajasthan)',
    badge: 'Fortified Lower Town + Fire Altars',
    highlight: 'Both the Citadel and the Lower Town were independently fortified with defensive walls.',
    detail: 'Features ploughed field furrows (earliest agricultural evidence) and series of mud-brick fire altars.',
    color: 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/30'
  }
];

export default function InteractiveCityLayoutDiagram({ subtopicKey = 'his_1_p0_s0_b0' }) {
  if (subtopicKey === 'his_1_p0_s0_b1') {
    return <HydraulicDockyardVisualizer />;
  }
  if (subtopicKey === 'his_1_p0_s1_b0') {
    return <TradeAndWeightsVisualizer />;
  }
  if (subtopicKey === 'his_1_p0_s1_b1') {
    return <MetallurgyAndArtVisualizer />;
  }
  if (subtopicKey === 'his_1_p1_s0_b0') {
    return <RigVedicPastoralVisualizer />;
  }
  if (subtopicKey === 'his_1_p1_s0_b1') {
    return <TribalAssembliesVisualizer />;
  }
  // Dedicated topic visualizers (ONLY for the specific subtopics they were crafted for)
  if (subtopicKey === 'his_2_p1_s0_b0' || subtopicKey === 'his_2_p1_s0_b2' || subtopicKey === 'his_2_p1_s1_b0') {
    return <BuddhismJainismVisualizer subtopicKey={subtopicKey} />;
  }
  if (subtopicKey === 'his_3_p0_s0_b0') {
    return <MahajanapadasVisualizer subtopicKey={subtopicKey} />;
  }
  if (subtopicKey === 'his_4_p0_s0_b0') {
    return <SangamAgeVisualizer subtopicKey={subtopicKey} />;
  }
  if (subtopicKey === 'his_5_p0_s0_b0' || subtopicKey === 'his_6_p0_s0_b0') {
    return <MedievalSystemsVisualizer subtopicKey={subtopicKey} />;
  }
  if (subtopicKey === 'his_12_p0_s0_b0') {
    return <ModernFreedomVisualizer subtopicKey={subtopicKey} />;
  }
  // For ALL other subtopics across all 14 chapters, use the dynamic topic-specific visualizer
  if (subtopicKey !== 'his_1_p0_s0_b0') {
    return <UniversalHistoryFlowVisualizer subtopicKey={subtopicKey} />;
  }

  const [activeTab, setActiveTab] = useState('blueprint'); // 'blueprint', 'drainage', 'exceptions', 'quiz'
  const [selectedZone, setSelectedZone] = useState('citadel'); // 'citadel' or 'lowertown'
  const [activeHotspotKey, setActiveHotspotKey] = useState('great_bath');
  
  // Interactive mini-quiz state
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const activeHotspot = HOTSPOTS[activeHotspotKey] || HOTSPOTS.great_bath;

  return (
    <div className="space-y-5 animate-fadeIn select-none">
      
      {/* Interactive Mode Navigator Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('blueprint')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'blueprint'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🗺️</span>
          <span>City Blueprint</span>
        </button>
        <button
          onClick={() => setActiveTab('drainage')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'drainage'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🚿</span>
          <span>Drainage Flow Engine</span>
        </button>
        <button
          onClick={() => setActiveTab('exceptions')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'exceptions'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>⚠️</span>
          <span>UPSC Exception Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'quiz'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
          }`}
        >
          <span>⚡</span>
          <span>Check Your Concept</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: INTERACTIVE DUAL-ZONE CITY BLUEPRINT              */}
      {/* ======================================================== */}
      {activeTab === 'blueprint' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Zone Selector Bar */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl">
            <button
              onClick={() => {
                setSelectedZone('citadel');
                setActiveHotspotKey('great_bath');
              }}
              className={`p-3 rounded-xl transition-all cursor-pointer text-left flex items-center justify-between ${
                selectedZone === 'citadel'
                  ? 'bg-white dark:bg-slate-900 shadow-xs border border-indigo-200 dark:border-indigo-800'
                  : 'hover:bg-white/50 dark:hover:bg-slate-800'
              }`}
            >
              <div>
                <span className="text-[9.5px] uppercase font-black text-indigo-600 dark:text-indigo-400 block font-mono">WESTERN SECTOR</span>
                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                  <span>🏰</span> The Raised Citadel
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Elevated 10-12m • Fortified</span>
              </div>
              <span className={`text-base ${selectedZone === 'citadel' ? 'text-indigo-600' : 'text-slate-400'}`}>➔</span>
            </button>

            <button
              onClick={() => {
                setSelectedZone('lowertown');
                setActiveHotspotKey('cardinal_grid');
              }}
              className={`p-3 rounded-xl transition-all cursor-pointer text-left flex items-center justify-between ${
                selectedZone === 'lowertown'
                  ? 'bg-white dark:bg-slate-900 shadow-xs border border-emerald-200 dark:border-emerald-800'
                  : 'hover:bg-white/50 dark:hover:bg-slate-800'
              }`}
            >
              <div>
                <span className="text-[9.5px] uppercase font-black text-emerald-600 dark:text-emerald-400 block font-mono">EASTERN SECTOR</span>
                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                  <span>🏘️</span> The Lower Town
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Low Ground • Cardinal Grid</span>
              </div>
              <span className={`text-base ${selectedZone === 'lowertown' ? 'text-emerald-600' : 'text-slate-400'}`}>➔</span>
            </button>
          </div>

          {/* Visual Schematic Diagram (Interactive SVG / Graphical Canvas) */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-5 rounded-3xl border border-indigo-900/60 text-white relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-4">
              <span className="text-[10px] uppercase font-mono font-black text-amber-300 tracking-wider">
                HARAPPAN URBAN SCHEMATIC MAP (CARDINAL ORIENTATION)
              </span>
              <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">WEST ⬅</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">➡ EAST</span>
              </div>
            </div>

            {/* Spatial Layout Graphic */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              
              {/* Citadel Representation (Left 5 Cols) */}
              <div className={`md:col-span-5 p-4 rounded-2xl border-2 transition-all relative ${
                selectedZone === 'citadel'
                  ? 'border-indigo-400 bg-indigo-950/70 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400/40'
                  : 'border-white/10 bg-white/5 opacity-60 hover:opacity-100'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9.5px] uppercase font-black text-indigo-300 font-mono tracking-wider flex items-center gap-1">
                    <span>🏰</span> Citadel Mound (West)
                  </span>
                  <span className="text-[8.5px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded font-mono">
                    High Elevation
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => { setSelectedZone('citadel'); setActiveHotspotKey('great_bath'); }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-bold ${
                      activeHotspotKey === 'great_bath'
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                        : 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <span className="flex items-center gap-2"><span>🏛️</span> The Great Bath</span>
                    <span className="text-[9px] font-mono uppercase opacity-80">Ritual Tank</span>
                  </button>

                  <button
                    onClick={() => { setSelectedZone('citadel'); setActiveHotspotKey('granary'); }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-bold ${
                      activeHotspotKey === 'granary'
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                        : 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <span className="flex items-center gap-2"><span>🌾</span> Great Granaries</span>
                    <span className="text-[9px] font-mono uppercase opacity-80">Air Ducts</span>
                  </button>

                  <button
                    onClick={() => { setSelectedZone('citadel'); setActiveHotspotKey('assembly_hall'); }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-bold ${
                      activeHotspotKey === 'assembly_hall'
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                        : 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <span className="flex items-center gap-2"><span>🏛️</span> Assembly Hall</span>
                    <span className="text-[9px] font-mono uppercase opacity-80">20 Pillars</span>
                  </button>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 text-[9px] text-slate-400 font-mono flex items-center justify-between">
                  <span>Platform: Mud-brick 10m</span>
                  <span>Fortified Walls</span>
                </div>
              </div>

              {/* Natural Barrier or Fortified Divider (Middle 2 Cols) */}
              <div className="md:col-span-2 flex md:flex-col items-center justify-center py-2 text-center text-slate-400 text-xs font-mono gap-1">
                <span className="h-full w-px bg-white/20 hidden md:block"></span>
                <span className="text-[9px] uppercase px-2 py-1 rounded bg-white/5 border border-white/10 tracking-widest">
                  Divider Wall
                </span>
                <span className="h-full w-px bg-white/20 hidden md:block"></span>
              </div>

              {/* Lower Town Representation (Right 5 Cols) */}
              <div className={`md:col-span-5 p-4 rounded-2xl border-2 transition-all relative ${
                selectedZone === 'lowertown'
                  ? 'border-emerald-400 bg-emerald-950/70 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/40'
                  : 'border-white/10 bg-white/5 opacity-60 hover:opacity-100'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9.5px] uppercase font-black text-emerald-300 font-mono tracking-wider flex items-center gap-1">
                    <span>🏘️</span> Lower Town (East)
                  </span>
                  <span className="text-[8.5px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded font-mono">
                    Low Ground (Grid)
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => { setSelectedZone('lowertown'); setActiveHotspotKey('cardinal_grid'); }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-bold ${
                      activeHotspotKey === 'cardinal_grid'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                        : 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    <span className="flex items-center gap-2"><span>📐</span> Cardinal Grid Streets</span>
                    <span className="text-[9px] font-mono uppercase opacity-80">90° Cross</span>
                  </button>

                  <button
                    onClick={() => { setSelectedZone('lowertown'); setActiveHotspotKey('drainage'); }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-bold ${
                      activeHotspotKey === 'drainage'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                        : 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    <span className="flex items-center gap-2"><span>🚿</span> Covered Drainage</span>
                    <span className="text-[9px] font-mono uppercase opacity-80">Soak Pits</span>
                  </button>

                  <button
                    onClick={() => { setSelectedZone('lowertown'); setActiveHotspotKey('houses'); }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-bold ${
                      activeHotspotKey === 'houses'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                        : 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    <span className="flex items-center gap-2"><span>🏠</span> Courtyard Houses</span>
                    <span className="text-[9px] font-mono uppercase opacity-80">Side Entrances</span>
                  </button>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 text-[9px] text-slate-400 font-mono flex items-center justify-between">
                  <span>Streets: 9-10m Wide</span>
                  <span>Artisan Quarters</span>
                </div>
              </div>

            </div>
          </div>

          {/* Active Hotspot Deep Dive Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3.5 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                  {activeHotspot.icon}
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-slate-800 dark:text-white">
                    {activeHotspot.name}
                  </h4>
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase">
                    Zone: {activeHotspot.zone}
                  </span>
                </div>
              </div>
              <span className="text-[9px] uppercase font-black px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                Click Hotspots Above
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
              {activeHotspot.summary}
            </p>

            {/* Engineering & Architectural Features */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider block">
                Key Architectural Mechanisms:
              </span>
              <ul className="space-y-1.5 pl-1">
                {activeHotspot.features.map((feature, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                    <span className="text-indigo-500 font-black shrink-0">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* UPSC High-Yield Exam Trap */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
              <span className="font-black text-amber-700 dark:text-amber-400 uppercase tracking-wide block text-[10px] mb-0.5">
                🎯 Prelims Trap Alert:
              </span>
              {activeHotspot.upscTip}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DRAINAGE FLOW ENGINE                              */}
      {/* ======================================================== */}
      {activeTab === 'drainage' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl">🚿</span>
              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-800 dark:text-white">
                  3-Stage Harappan Hydraulic Wastewater Cycle
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  How a drop of domestic wastewater traveled from a private bathroom to municipal river disposal.
                </p>
              </div>
            </div>

            {/* Interactive Step-by-Step Flow Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">STAGE 1</span>
                  <span className="text-base">🛁</span>
                </div>
                <h5 className="text-xs font-black text-slate-800 dark:text-white">Private Bathroom Floor</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Bathrooms were paved with watertight kiln-burnt bricks with slight slopes directing water into terracotta drain pipes through the wall.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">STAGE 2</span>
                  <span className="text-base">🕳️</span>
                </div>
                <h5 className="text-xs font-black text-slate-800 dark:text-white">Soak Pit / Sump Basin</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Solid debris settled to the bottom of domestic sump jars, allowing only filtered liquid waste to spill over into the main street drain.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">STAGE 3</span>
                  <span className="text-base">🧱</span>
                </div>
                <h5 className="text-xs font-black text-slate-800 dark:text-white">Covered Main Street Gutter</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Wide channels covered by removable stone slabs, fitted with regular inspection manholes for municipal cleaning before draining out of city limits.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300 leading-relaxed">
              <span className="font-black block uppercase text-[10px] text-indigo-600 dark:text-indigo-400 mb-0.5">
                🏛️ Administrative Takeaway for UPSC:
              </span>
              The presence of regular inspection sumps proves the existence of a permanent municipal sanitation staff—unprecedented anywhere in the Bronze Age world.
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: UPSC EXCEPTION MATRIX                             */}
      {/* ======================================================== */}
      {activeTab === 'exceptions' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
            <span className="font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider block text-[10px] mb-0.5">
              ⚠️ High-Yield Prelims Warning:
            </span>
            UPSC questions almost never test standard rules—they specifically test the <strong>exceptions</strong> to the Citadel/Lower Town layout rule:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {EXCEPTIONS.map((exc, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border ${exc.color} space-y-2 transition-all`}>
                <div className="flex items-center justify-between">
                  <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{exc.city}</h5>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-mono">
                    {exc.badge}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                  {exc.highlight}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {exc.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: QUICK CONCEPT CHECK (INTERACTIVE QUIZ)            */}
      {/* ======================================================== */}
      {activeTab === 'quiz' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4 max-w-xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <span className="text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">
                UPSC RAPID CHECKPOINT
              </span>
              <span className="text-xs">⚡ Instant Feedback</span>
            </div>

            <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 leading-relaxed">
              Which of the following Harappan cities had a unique <strong>tri-partite (three-tier)</strong> municipal layout consisting of a Citadel, a Middle Town, and a Lower Town?
            </p>

            <div className="space-y-2">
              {[
                { id: 'A', text: 'Chanhudaro (Sindh)', isCorrect: false },
                { id: 'B', text: 'Dholavira (Kutch, Gujarat)', isCorrect: true },
                { id: 'C', text: 'Lothal (Bhogava River)', isCorrect: false },
                { id: 'D', text: 'Kalibangan (Rajasthan)', isCorrect: false }
              ].map(opt => {
                let btnStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-indigo-400';
                
                if (quizSubmitted) {
                  if (opt.isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-black ring-1 ring-emerald-500';
                  } else if (quizAnswer === opt.id) {
                    btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold ring-1 ring-rose-500';
                  } else {
                    btnStyle = 'border-slate-100 dark:border-slate-900 opacity-40 text-slate-400';
                  }
                } else if (quizAnswer === opt.id) {
                  btnStyle = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold ring-1 ring-indigo-500';
                }

                return (
                  <button
                    key={opt.id}
                    disabled={quizSubmitted}
                    onClick={() => { setQuizAnswer(opt.id); setQuizSubmitted(true); }}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <span><strong>({opt.id})</strong> {opt.text}</span>
                    {quizSubmitted && opt.isCorrect && <span className="text-emerald-600 font-black">✓ Correct</span>}
                    {quizSubmitted && !opt.isCorrect && quizAnswer === opt.id && <span className="text-rose-600 font-black">✗ Incorrect</span>}
                  </button>
                );
              })}
            </div>

            {quizSubmitted && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed animate-slideDown">
                <span className="font-black text-indigo-600 dark:text-indigo-400 block mb-0.5">Explanation:</span>
                <strong>Dholavira</strong> in the Rann of Kutch (Gujarat) is famous for its unique three-tier division: Citadel, Middle Town, and Lower Town. In contrast, <strong>Chanhudaro</strong> lacked a citadel entirely, <strong>Lothal</strong> had no internal dividing wall, and <strong>Kalibangan</strong> had dual fortifications.
                <button
                  onClick={() => { setQuizSubmitted(false); setQuizAnswer(null); }}
                  className="mt-2.5 text-[11px] font-black text-indigo-600 dark:text-indigo-400 underline block cursor-pointer"
                >
                  🔄 Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
