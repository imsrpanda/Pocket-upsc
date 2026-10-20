import React, { useState, useEffect } from 'react';

// ========================================================
// 1. HYDRAULIC & DOCKYARD VISUALIZER (his_1_p0_s0_b1)
// ========================================================
export function HydraulicDockyardVisualizer() {
  const [activeTab, setActiveTab] = useState('dock'); // 'dock', 'reservoirs', 'bricks', 'quiz'
  const [tideLevel, setTideLevel] = useState('high'); // 'high' or 'low'
  const [sluiceOpen, setSluiceOpen] = useState(false);
  const [brickThickness, setBrickThickness] = useState(7); // cm
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  return (
    <div className="space-y-4 animate-fadeIn select-none">
      {/* Navigator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('dock')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'dock' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>⚓</span>
          <span>Lothal Tidal Dock Simulator</span>
        </button>
        <button
          onClick={() => setActiveTab('reservoirs')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'reservoirs' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>💧</span>
          <span>Dholavira Reservoirs</span>
        </button>
        <button
          onClick={() => setActiveTab('bricks')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'bricks' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🧱</span>
          <span>1:2:4 Brick Calculator</span>
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'quiz' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
          }`}
        >
          <span>⚡</span>
          <span>Concept Check</span>
        </button>
      </div>

      {/* TAB 1: LOTHAL TIDAL DOCKYARD SIMULATOR */}
      {activeTab === 'dock' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Tidal Phase:</span>
              <button
                onClick={() => setTideLevel(tideLevel === 'high' ? 'low' : 'high')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  tideLevel === 'high' ? 'bg-cyan-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {tideLevel === 'high' ? '🌊 High Tide (Flooding Basin)' : '📉 Low Tide (Ebb Phase)'}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Sluice Gate:</span>
              <button
                onClick={() => setSluiceOpen(!sluiceOpen)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  sluiceOpen ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {sluiceOpen ? '🔓 Gate OPEN (Draining)' : '🔒 Gate CLOSED (Trapping Water)'}
              </button>
            </div>
          </div>

          {/* Interactive Simulation Stage */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-800/60 text-white relative overflow-hidden shadow-xl">
            <div className="text-[10px] font-mono text-cyan-300 mb-2 flex items-center justify-between">
              <span>LOTHAL BASIN DOCK (214m × 36m) • BHOGAVA RIVER INTERFACE</span>
              <span className="font-bold">{tideLevel === 'high' ? 'WATER DEPTH: 4.5m' : sluiceOpen ? 'WATER DEPTH: 1.2m' : 'WATER DEPTH: 3.8m (LOCKED)'}</span>
            </div>

            <div className="h-44 rounded-xl relative overflow-hidden border border-cyan-700/50 flex flex-col justify-end bg-gradient-to-b from-slate-900 to-cyan-950">
              {/* Dynamic Water Layer */}
              <div
                className={`w-full transition-all duration-700 relative bg-gradient-to-t from-cyan-600 to-blue-500/80 ${
                  tideLevel === 'high' ? 'h-32' : sluiceOpen ? 'h-12' : 'h-28'
                }`}
              >
                <div className="absolute top-1 left-4 text-[10px] font-mono text-cyan-100 font-bold">
                  {tideLevel === 'high' ? '🌊 High-tide river flood waters berthed cargo vessels' : sluiceOpen ? '⚠️ Low water level: Ships risk grounding' : '🛡️ Sluice gates hold water: Ships float safely'}
                </div>
              </div>

              {/* Wooden Ship Graphic */}
              <div
                className={`absolute left-1/3 transition-all duration-700 ${
                  tideLevel === 'high' ? 'bottom-28' : sluiceOpen ? 'bottom-8' : 'bottom-24'
                }`}
              >
                <span className="text-4xl block animate-bounce">⛵</span>
              </div>

              {/* Sluice Gate Graphic on Right */}
              <div className="absolute right-8 bottom-0 w-6 bg-amber-700 border-2 border-amber-400 rounded-t-sm flex flex-col items-center justify-center transition-all duration-500"
                style={{ height: sluiceOpen ? '25px' : '120px' }}>
                <span className="text-[8px] font-black text-amber-200 rotate-90 whitespace-nowrap">
                  {sluiceOpen ? 'OPEN' : 'GATE DOWN'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/40 text-xs text-cyan-900 dark:text-cyan-200 leading-relaxed">
            💡 <strong>Hydrological Engineering Note:</strong> Lothal's burnt-brick dockyard was engineered to withstand river scour from the Bhogava River. When low tide arrived, the wooden sluice gate dropped into brick grooves, locking water in the basin so trading ships remained afloat without grounding!
          </div>
        </div>
      )}

      {/* TAB 2: DHOLAVIRA 16 STONE RESERVOIRS */}
      {activeTab === 'reservoirs' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-xl">🏔️</span>
              <h5 className="font-bold text-slate-800 dark:text-white">Manhar & Mansar Streams</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Two seasonal desert torrents flanked the city, channeled by stone bunds.</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50 space-y-1">
              <span className="text-xl">💧</span>
              <h5 className="font-bold text-blue-900 dark:text-blue-300">16 Rock-Cut Reservoirs</h5>
              <p className="text-[11px] text-blue-700 dark:text-blue-300/80">Cascading stepped tanks connected by rock-cut stone drains storing 250,000 cu.m water.</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 space-y-1">
              <span className="text-xl">🏜️</span>
              <h5 className="font-bold text-emerald-900 dark:text-emerald-300">Arid Kutch Survival</h5>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300/80">Allowed Dholavira to flourish in an arid climate with zero perennial freshwater rivers.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 1:2:4 BRICK CALCULATOR */}
      {activeTab === 'bricks' && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 font-mono">Interactive Dimensional Meter</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Drag the thickness slider to see how Harappan kilns automatically calculated width and length in the exact <strong>1 : 2 : 4</strong> ratio.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Thickness (1x): {brickThickness} cm</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono">Ratio 1:2:4</span>
            </div>
            <input
              type="range"
              min="5"
              max="12"
              value={brickThickness}
              onChange={(e) => setBrickThickness(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800">
              <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block">Thickness (1T)</span>
              <span className="text-lg font-black text-amber-950 dark:text-amber-200">{brickThickness} cm</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800">
              <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block">Width (2T)</span>
              <span className="text-lg font-black text-amber-950 dark:text-amber-200">{brickThickness * 2} cm</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800">
              <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block">Length (4T)</span>
              <span className="text-lg font-black text-amber-950 dark:text-amber-200">{brickThickness * 4} cm</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONCEPT CHECK QUIZ */}
      {activeTab === 'quiz' && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3 animate-fadeIn">
          <span className="text-[10px] uppercase font-black text-emerald-600 font-mono">UPSC Prelims Checkpoint</span>
          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Which Harappan site is distinguished by the world's earliest burnt-brick tidal dockyard connected to the Bhogava River?
          </p>
          <div className="space-y-1.5 pt-1">
            {[
              { id: 'A', text: 'Dholavira', correct: false },
              { id: 'B', text: 'Lothal', correct: true },
              { id: 'C', text: 'Kalibangan', correct: false },
              { id: 'D', text: 'Rakhigarhi', correct: false }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={quizSubmitted}
                onClick={() => { setQuizAnswer(opt.id); setQuizSubmitted(true); }}
                className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  quizSubmitted && opt.correct ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>({opt.id}) {opt.text}</span>
                {quizSubmitted && opt.correct && <span className="text-emerald-600 font-black">✓ Correct</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================================
// 2. TRADE & CHERT WEIGHTS VISUALIZER (his_1_p0_s1_b0)
// ========================================================
export function TradeAndWeightsVisualizer() {
  const [activeTab, setActiveTab] = useState('weights'); // 'weights', 'routes', 'script'
  const [placedWeights, setPlacedWeights] = useState([16]);
  const targetCommodityWeight = 48; // Target weight for puzzle

  const toggleWeight = (w) => {
    if (placedWeights.includes(w)) {
      setPlacedWeights(placedWeights.filter(x => x !== w));
    } else {
      setPlacedWeights([...placedWeights, w]);
    }
  };

  const currentScaleTotal = placedWeights.reduce((a, b) => a + b, 0);
  const isBalanced = currentScaleTotal === targetCommodityWeight;

  return (
    <div className="space-y-4 animate-fadeIn select-none">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('weights')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'weights' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>⚖️</span>
          <span>Binary Chert Scale</span>
        </button>
        <button
          onClick={() => setActiveTab('routes')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'routes' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🚢</span>
          <span>Meluha Trade Network</span>
        </button>
        <button
          onClick={() => setActiveTab('script')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'script' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>📜</span>
          <span>Boustrophedon Script</span>
        </button>
      </div>

      {/* CHERT SCALE SIMULATOR */}
      {activeTab === 'weights' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 text-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase">Binary Scale Puzzle: Balance 48 Units of Lapis Lazuli</span>
            <span className={`text-xs font-black px-2 py-0.5 rounded ${isBalanced ? 'bg-emerald-600 text-white' : 'bg-rose-900 text-rose-300'}`}>
              {isBalanced ? '⚖️ PERFECTLY BALANCED!' : currentScaleTotal > targetCommodityWeight ? '⬆️ Scale Overloaded' : '⬇️ Too Light'}
            </span>
          </div>

          {/* Interactive Weight Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-300 font-bold">Select Cubical Chert Weights:</span>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 4, 8, 16, 32, 64].map((w) => {
                const isSelected = placedWeights.includes(w);
                return (
                  <button
                    key={w}
                    onClick={() => toggleWeight(w)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black transition-all cursor-pointer ${
                      isSelected ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {w}x Unit {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs font-mono">
            <span>Placed Weights Total: <strong className="text-amber-300">{currentScaleTotal} units</strong></span>
            <span>Target Cargo: <strong className="text-cyan-300">{targetCommodityWeight} units</strong></span>
          </div>
        </div>
      )}

      {/* MELUHA TRADE ROUTES */}
      {activeTab === 'routes' && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase font-mono">Akkadian Cuneiform Trade Geography</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-200 block">1. Meluha (Indus)</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Exported timber, carnelian beads, copper, and lapis lazuli.</p>
            </div>
            <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/40 space-y-1">
              <span className="font-bold text-cyan-900 dark:text-cyan-200 block">2. Dilmun (Bahrain)</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Central maritime trans-shipment port and freshwater island.</p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 space-y-1">
              <span className="font-bold text-indigo-900 dark:text-indigo-200 block">3. Makan (Oman)</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Primary supplier of nickel-rich copper ingots.</p>
            </div>
          </div>
        </div>
      )}

      {/* SCRIPT TRACER */}
      {activeTab === 'script' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 text-white space-y-3 text-center">
          <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase">Boustrophedon Writing Style (Ox-Turn Flow)</span>
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-900/80 space-y-2 font-mono">
            <div className="p-2 bg-indigo-950/80 rounded border border-indigo-500/40 text-xs text-indigo-300 flex items-center justify-between">
              <span>LINE 1 (Right to Left):</span>
              <span className="font-bold tracking-widest animate-pulse">⬅ 𓆣 𓈖 𓊪 𓇋 𓅓</span>
            </div>
            <div className="p-2 bg-indigo-950/80 rounded border border-indigo-500/40 text-xs text-indigo-300 flex items-center justify-between">
              <span>LINE 2 (Left to Right):</span>
              <span className="font-bold tracking-widest animate-pulse">𓏏 𓆑 𓈖 𓊪 𓎛 ➡</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">Harappan script remains undeciphered due to the lack of a bilingual inscription like the Rosetta Stone.</p>
        </div>
      )}
    </div>
  );
}

// ========================================================
// 3. METALLURGY & ART VISUALIZER (his_1_p0_s1_b1)
// ========================================================
export function MetallurgyAndArtVisualizer() {
  const [activeTab, setActiveTab] = useState('lostwax');
  const [castingStep, setCastingStep] = useState(1);

  return (
    <div className="space-y-4 animate-fadeIn select-none">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('lostwax')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'lostwax' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🔥</span>
          <span>Lost-Wax Casting Lab</span>
        </button>
        <button
          onClick={() => setActiveTab('pashupati')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'pashupati' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🧘‍♂️</span>
          <span>Pashupati Anatomy</span>
        </button>
      </div>

      {activeTab === 'lostwax' && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Process Step {castingStep} of 4</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map(s => (
                <button
                  key={s}
                  onClick={() => setCastingStep(s)}
                  className={`w-7 h-7 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    castingStep === s ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/40 text-white space-y-2 text-center">
            {castingStep === 1 && (
              <div>
                <span className="text-3xl block">🕯️</span>
                <h5 className="font-bold text-amber-300 text-sm">Step 1: Beeswax Core Sculpting</h5>
                <p className="text-xs text-slate-300 mt-1">Artisan sculpts the detailed figure (like the Dancing Girl) out of soft beeswax.</p>
              </div>
            )}
            {castingStep === 2 && (
              <div>
                <span className="text-3xl block">🏺</span>
                <h5 className="font-bold text-slate-200 text-sm">Step 2: Clay Shell Coating</h5>
                <p className="text-xs text-slate-300 mt-1">The wax figurine is wrapped in multiple layers of fine clay and left to bake dry in the sun.</p>
              </div>
            )}
            {castingStep === 3 && (
              <div>
                <span className="text-3xl block">🔥</span>
                <h5 className="font-bold text-rose-400 text-sm">Step 3: Heating & Melting the Wax</h5>
                <p className="text-xs text-slate-300 mt-1">The clay mold is heated in a kiln. The wax melts and drains out through a tiny hole, leaving a hollow cavity.</p>
              </div>
            )}
            {castingStep === 4 && (
              <div>
                <span className="text-3xl block">💃</span>
                <h5 className="font-bold text-emerald-400 text-sm">Step 4: Molten Bronze Pouring & Breaking</h5>
                <p className="text-xs text-slate-300 mt-1">Molten copper-tin bronze alloy is poured into the hollow cavity. Once cooled, the clay shell is smashed open to reveal the solid bronze sculpture!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'pashupati' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 text-white space-y-3">
          <h4 className="text-xs font-black text-amber-300 uppercase font-mono">Pashupati Seal Iconographic Key</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">🐘 <strong>Elephant:</strong> Right side</div>
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">🐅 <strong>Tiger:</strong> Right side</div>
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">🦏 <strong>Rhinoceros:</strong> Left side</div>
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">🐃 <strong>Buffalo:</strong> Left side</div>
          </div>
          <div className="p-2 rounded-xl bg-amber-950/50 border border-amber-500/40 text-center text-xs text-amber-200">
            2 Deer sit beneath the seat. Note: NO horse, cow, or lion is depicted on the Pashupati seal!
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================================
// 4. RIG VEDIC PASTORAL VISUALIZER (his_1_p1_s0_b0)
// ========================================================
export function RigVedicPastoralVisualizer() {
  const [cattleCount, setCattleCount] = useState(5);

  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn select-none">
      <div className="space-y-1">
        <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase font-mono">Rig Vedic Cattle Currency Converter</h4>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          In 1500 BCE, gold coins did not exist. Cows (Gau) were the standard of value and payment for sacrifices, brides, and barter.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Herd Size: {cattleCount} Cows</span>
          <span className="text-amber-600 dark:text-amber-400 font-mono">Gomat Status</span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          value={cattleCount}
          onChange={(e) => setCattleCount(Number(e.target.value))}
          className="w-full accent-amber-600 cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800">
          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block">Barley (Yava)</span>
          <span className="text-base font-black text-amber-950 dark:text-amber-200">{cattleCount * 12} bags</span>
        </div>
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800">
          <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-300 block">Sacrificial Priests</span>
          <span className="text-base font-black text-rose-950 dark:text-rose-200">{Math.floor(cattleCount / 2)} Priests</span>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
          <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">Tribal Respect</span>
          <span className="text-base font-black text-emerald-950 dark:text-emerald-200">{cattleCount > 10 ? 'High (Gomat)' : 'Moderate'}</span>
        </div>
      </div>
    </div>
  );
}

// ========================================================
// 5. TRIBAL ASSEMBLIES VISUALIZER (his_1_p1_s0_b1)
// ========================================================
export function TribalAssembliesVisualizer() {
  const [selectedAssembly, setSelectedAssembly] = useState('samiti');

  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn select-none">
      <div className="space-y-1">
        <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase font-mono">Early Vedic Tribal Democracy</h4>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          The Rajan was not an absolute monarch. He was elected and guided by three distinct democratic assemblies.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setSelectedAssembly('sabha')}
          className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            selectedAssembly === 'sabha' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          👴 Sabha (Elders)
        </button>
        <button
          onClick={() => setSelectedAssembly('samiti')}
          className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            selectedAssembly === 'samiti' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          🗳️ Samiti (Folk)
        </button>
        <button
          onClick={() => setSelectedAssembly('vidatha')}
          className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            selectedAssembly === 'vidatha' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          ⚖️ Vidatha (Booty)
        </button>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-white space-y-1.5 text-xs">
        {selectedAssembly === 'sabha' && (
          <div>
            <h5 className="font-bold text-indigo-300">The Sabha: Exclusive Elite Council</h5>
            <p className="text-slate-300 text-[11px] mt-1">Smaller council of senior clan elders and nobles. Handled judicial disputes and high-level strategy.</p>
          </div>
        )}
        {selectedAssembly === 'samiti' && (
          <div>
            <h5 className="font-bold text-emerald-300">The Samiti: Sovereign Folk Assembly</h5>
            <p className="text-slate-300 text-[11px] mt-1">General assembly of the entire tribe. Held the constitutional power to elect or depose the Rajan!</p>
          </div>
        )}
        {selectedAssembly === 'vidatha' && (
          <div>
            <h5 className="font-bold text-purple-300">The Vidatha: Ancient Spoils Assembly</h5>
            <p className="text-slate-300 text-[11px] mt-1">Oldest tribal assembly that performed rituals and equitably distributed cattle spoils captured in war.</p>
          </div>
        )}
      </div>

      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200 font-bold text-center">
        👩 <strong>Crucial UPSC Rule:</strong> Women held the right to attend both Sabha and Samiti during the Early Vedic period, but lost this right in the Later Vedic era!
      </div>
    </div>
  );
}


// ========================================================
// 6. BUDDHISM & JAINISM INTERACTIVE VISUALIZER (his_2)
// ========================================================
export function BuddhismJainismVisualizer({ subtopicKey = 'his_2_p0_s0_b0' }) {
  const [activeTab, setActiveTab] = useState('councils'); // 'councils', 'doctrines', 'jainism', 'quiz'
  const [selectedCouncil, setSelectedCouncil] = useState(1);
  const [selectedTruth, setSelectedTruth] = useState('dukkha');
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const councils = [
    {
      num: 1,
      venue: 'Sattapanni Cave, Rajgriha',
      year: '483 BCE (Immediately after Buddha\'s death)',
      king: 'King Ajatashatru (Haryanka Dynasty)',
      president: 'Mahakassapa',
      outcome: 'Vinaya Pitaka (Monastic discipline recited by Upali) and Sutta Pitaka (Buddha\'s discourses recited by Ananda) were compiled.',
      upscTrap: 'Abhidhamma Pitaka was NOT compiled in this council; it was added in the 3rd council under Ashoka.'
    },
    {
      num: 2,
      venue: 'Vaishali',
      year: '383 BCE (100 years after Mahaparinirvana)',
      king: 'King Kalasoka (Shishunaga Dynasty)',
      president: 'Sabbakami',
      outcome: 'Disputes over 10 relaxed monastic rules caused the FIRST GREAT SCHISM: Sthaviravadins (Theravadins/Elders) vs Mahasanghikas (Great Sangha).',
      upscTrap: 'This was NOT the Hinayana-Mahayana split! That occurred 400 years later in the 4th Council.'
    },
    {
      num: 3,
      venue: 'Pataliputra',
      year: '250 BCE',
      king: 'Emperor Ashoka (Mauryan Empire)',
      president: 'Moggaliputta Tissa',
      outcome: 'Expelled corrupt heretic monks. Added the Abhidhamma Pitaka (philosophical analysis) to seal the Tripitaka. Compiled Kathavatthu. Dispatched missionary envoys across Asia.',
      upscTrap: 'Ashokan edicts mention Dhamma, but the Tripitaka was finalized in Pali, not Sanskrit.'
    },
    {
      num: 4,
      venue: 'Kundalvana, Kashmir',
      year: '72 CE',
      king: 'King Kanishka (Kushan Empire)',
      president: 'Vasumitra (Vice-President: Ashvaghosha)',
      outcome: 'Buddhism irrevocably split into Hinayana (Theravada/Lesser Vehicle) and Mahayana (Great Vehicle). Sanskrit became the primary canonical language; commentaries (Mahavibhasha) compiled.',
      upscTrap: 'Fourth council was conducted in Sanskrit, whereas the first three councils were in Pali/Prakrit.'
    }
  ];

  return (
    <div className="space-y-4 animate-fadeIn select-none">
      {/* Navigator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('councils')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'councils' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🏛️</span>
          <span>4 Buddhist Councils Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('doctrines')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'doctrines' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>☸️</span>
          <span>Four Truths & Causal Wheel</span>
        </button>
        <button
          onClick={() => setActiveTab('jainism')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'jainism' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>💎</span>
          <span>Jain Syadvada & Triratna</span>
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'quiz' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
          }`}
        >
          <span>⚡</span>
          <span>Trap Detector</span>
        </button>
      </div>

      {/* TAB 1: 4 BUDDHIST COUNCILS */}
      {activeTab === 'councils' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="grid grid-cols-4 gap-2">
            {councils.map((c) => (
              <button
                key={c.num}
                onClick={() => setSelectedCouncil(c.num)}
                className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                  selectedCouncil === c.num
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md font-black'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-[10px] uppercase block opacity-80">Council {c.num}</span>
                <span className="text-xs font-bold block">{c.venue.split(',')[0]}</span>
              </button>
            ))}
          </div>

          {(() => {
            const cur = councils[selectedCouncil - 1];
            return (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-amber-500/50 text-white space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div>
                    <span className="text-[9.5px] uppercase font-black text-amber-400 tracking-wider font-mono">
                      {cur.year}
                    </span>
                    <h4 className="text-base font-black text-white">{cur.venue}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono font-bold">
                    Council #{cur.num}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[9.5px] uppercase text-amber-300 font-bold block">👑 Patron King</span>
                    <span className="font-bold text-white mt-0.5 block">{cur.king}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[9.5px] uppercase text-amber-300 font-bold block">🧘‍♂️ Presiding Monk</span>
                    <span className="font-bold text-white mt-0.5 block">{cur.president}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs leading-relaxed">
                  <span className="text-[10px] uppercase font-black text-emerald-400 block mb-1">📜 Canonical Outcome:</span>
                  <p className="text-slate-200">{cur.outcome}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs text-rose-200">
                  <strong className="text-rose-300">⚠️ UPSC Examiner Trap:</strong> {cur.upscTrap}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: DOCTRINES & CAUSAL WHEEL */}
      {activeTab === 'doctrines' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'dukkha', title: '1. Dukkha', sub: 'Life is Sorrow' },
              { id: 'samudaya', title: '2. Samudaya', sub: 'Craving (Trishna)' },
              { id: 'nirodha', title: '3. Nirodha', sub: 'Cessation of Desire' },
              { id: 'magga', title: '4. Magga', sub: 'Eightfold Path' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTruth(t.id)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedTruth === t.id
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xs font-black block">{t.title}</span>
                <span className="text-[10px] opacity-80 block">{t.sub}</span>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/50 text-white space-y-2 text-xs leading-relaxed">
            <h5 className="text-sm font-black text-amber-300">Pratityasamutpada (Dependent Origination)</h5>
            <p className="text-slate-300">
              \"When this exists, that comes to be; with the arising of this, that arises.\" Everything is conditioned and dependent on prior causes. Buddhism rejects a permanent creator God and an eternal unchanging soul (Anatta), yet affirms rebirth through karmic continuity.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px]">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-indigo-300 font-bold">Anatta: No Soul</div>
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 font-bold">Anicca: Impermanence</div>
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-emerald-300 font-bold">Nirvana: Extinction</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: JAINISM */}
      {activeTab === 'jainism' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950 via-slate-900 to-indigo-950 border border-amber-500/50 text-white space-y-3">
            <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider">
              Syadvada & Anekantavada (The Philosophy of Relativity)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Jainism posits that absolute truth is multifaceted. Blind men touching an elephant perceive only partial truths (fan, pillar, wall, rope). Syadvada asserts seven-fold conditional predication (Saptabhangi-Naya): statements are true only from specific viewpoints.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-amber-500/40">
                <span className="text-xl block">👁️</span>
                <span className="font-black text-amber-300 block">Samyag Darshana</span>
                <span className="text-slate-300 text-[9px]">Right Faith</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-amber-500/40">
                <span className="text-xl block">📖</span>
                <span className="font-black text-amber-300 block">Samyag Jnana</span>
                <span className="text-slate-300 text-[9px]">Right Knowledge</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-amber-500/40">
                <span className="text-xl block">🛡️</span>
                <span className="font-black text-amber-300 block">Samyag Charitra</span>
                <span className="text-slate-300 text-[9px]">Right Conduct</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONCEPT CHECK */}
      {activeTab === 'quiz' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 font-mono">
            UPSC PRELIMS CHECK
          </span>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Which Buddhist council finalized the Tripitaka by incorporating the Abhidhamma Pitaka?
          </h4>
          <div className="space-y-2">
            {[
              { id: 'A', text: 'First Council at Rajgriha under King Ajatashatru', isCorrect: false },
              { id: 'B', text: 'Second Council at Vaishali under King Kalasoka', isCorrect: false },
              { id: 'C', text: 'Third Council at Pataliputra under Emperor Ashoka', isCorrect: true },
              { id: 'D', text: 'Fourth Council at Kundalvana under King Kanishka', isCorrect: false }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={quizSubmitted}
                onClick={() => { setQuizAnswer(opt.id); setQuizSubmitted(true); }}
                className={`w-full text-left p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                  quizSubmitted
                    ? opt.isCorrect
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold'
                      : quizAnswer === opt.id
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200'
                      : 'border-slate-200 dark:border-slate-800 opacity-40'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span><strong>({opt.id})</strong> {opt.text}</span>
                {quizSubmitted && opt.isCorrect && <span className="text-emerald-600 font-black">✓ Correct</span>}
              </button>
            ))}
          </div>
          {quizSubmitted && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
              <strong>Explanation:</strong> The Abhidhamma Pitaka was composed and added during the Third Buddhist Council at Pataliputra presided over by Moggaliputta Tissa under Emperor Ashoka.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ========================================================
// 7. MAHAJANAPADAS & EMPIRES VISUALIZER (his_3)
// ========================================================
export function MahajanapadasVisualizer() {
  const [activePolity, setActivePolity] = useState('ganasangha');

  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn select-none">
      <div className="space-y-1">
        <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase font-mono">
          Second Urbanization: Monarchies vs Ganasanghas
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          The 6th century BCE marked the emergence of 16 Mahajanapadas split between hereditary kings and republican clan assemblies.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setActivePolity('monarchy')}
          className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
            activePolity === 'monarchy'
              ? 'bg-purple-600 text-white border-purple-700 shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          <span className="text-xs font-black block">👑 Hereditary Monarchies</span>
          <span className="text-[10px] opacity-80 block">Magadha, Kosala, Vatsa</span>
        </button>
        <button
          onClick={() => setActivePolity('ganasangha')}
          className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
            activePolity === 'ganasangha'
              ? 'bg-teal-600 text-white border-teal-700 shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          <span className="text-xs font-black block">🏛️ Ganasangha Republics</span>
          <span className="text-[10px] opacity-80 block">Vajji, Malla, Shakya</span>
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 text-white text-xs leading-relaxed space-y-2">
        {activePolity === 'monarchy' ? (
          <div>
            <h5 className="font-black text-purple-300">Monarchical Autocracy & Taxation</h5>
            <p className="text-slate-300 text-[11px] mt-1">
              Power was centralized in an absolute king supported by a standing army (Sena) funded through compulsory agricultural taxes (Bhaga, typically 1/6th of produce) and Bali. Upheld orthodox Brahminical rituals and varna hierarchy.
            </p>
          </div>
        ) : (
          <div>
            <h5 className="font-black text-teal-300">The Santhagara Clan Assembly</h5>
            <p className="text-slate-300 text-[11px] mt-1">
              Sovereignty was shared among Kshatriya clan heads who assembled in the Santhagara hall to debate policy using voting sticks (Salakas). More receptive to heterodox Shramanic ideas (Buddha and Mahavira both came from Ganasanghas).
            </p>
          </div>
        )}
      </div>

      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 font-bold text-center">
        ⚠️ <strong>UPSC Trap:</strong> Ganasanghas were oligarchies, NOT modern egalitarian democracies. Slaves (Dasa) and hired laborers (Karmakaras) had no voting rights!
      </div>
    </div>
  );
}

// ========================================================
// 8. SANGAM AGE 5 TINAIS VISUALIZER (his_4)
// ========================================================
export function SangamAgeVisualizer() {
  const [selectedTinai, setSelectedTinai] = useState('kurinji');

  const tinais = {
    kurinji: { name: 'Kurinji', land: 'Hilly / Mountainous Tracks', deity: 'Murugan (Seyon)', occupation: 'Hunting and honey collection' },
    mullai: { name: 'Mullai', land: 'Pastoral / Forest Tracts', deity: 'Mayon (Krishna/Vishnu)', occupation: 'Cattle rearing and dairy farming' },
    marudam: { name: 'Marudam', land: 'Fertile Agricultural Plains', deity: 'Vendan (Indra)', occupation: 'Wet rice cultivation and farming' },
    neydal: { name: 'Neydal', land: 'Coastal Seashores', deity: 'Varunan (Sea God)', occupation: 'Fishing and salt manufacturing' },
    palai: { name: 'Palai', land: 'Arid / Parched Desert', deity: 'Kotravai (Goddess of War)', occupation: 'Highway robbery and warrior raids' }
  };

  const cur = tinais[selectedTinai];

  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn select-none">
      <div className="space-y-1">
        <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase font-mono">
          The 5 Tinais: Sangam Eco-Landscapes
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Sangam literature categorized the Tamil country into five ecological zones, each defining livelihood, deity, and poetry moods.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {Object.entries(tinais).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setSelectedTinai(k)}
            className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
              selectedTinai === k
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md font-bold'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className="text-[11px] block">{v.name}</span>
          </button>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-500/40 text-white space-y-2 text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <span className="text-sm font-black text-emerald-300">{cur.name} Landscape</span>
          <span className="text-[10px] text-slate-300 font-mono">{cur.land}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <div className="p-2 rounded-xl bg-slate-800/80">
            <span className="text-[9px] uppercase text-emerald-400 font-bold block">🙏 Patron Deity</span>
            <span className="font-bold text-white mt-0.5 block">{cur.deity}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/80">
            <span className="text-[9px] uppercase text-emerald-400 font-bold block">🌾 Primary Occupation</span>
            <span className="font-bold text-white mt-0.5 block">{cur.occupation}</span>
          </div>
        </div>
      </div>

      <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 text-center font-bold">
        ⚓ <strong>Sangam Trade Hubs:</strong> Muziris and Arikamedu served as flourishing Indo-Roman trade ports exporting spices, pearls, and textiles for Roman gold coins.
      </div>
    </div>
  );
}

// ========================================================
// 9. MEDIEVAL SYSTEMS & MANSABDARI VISUALIZER (his_5 & his_6)
// ========================================================
export function MedievalSystemsVisualizer() {
  const [zat, setZat] = useState(5000);
  const [sawar, setSawar] = useState(3000);

  const getRankClass = () => {
    if (zat === sawar) return '1st Class Mansabdar (Zat = Sawar)';
    if (sawar >= zat / 2) return '2nd Class Mansabdar (Sawar >= Zat/2)';
    return '3rd Class Mansabdar (Sawar < Zat/2)';
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn select-none">
      <div className="space-y-1">
        <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase font-mono">
          Mughal Mansabdari Interactive Calculator
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Introduced by Akbar, Mansabdari was a dual-rank administrative and military grading system.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 block">
            Zat Rank (Personal Status): {zat}
          </label>
          <input
            type="range"
            min="1000"
            max="7000"
            step="500"
            value={zat}
            onChange={(e) => setZat(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 block">
            Sawar Rank (Cavalry Force): {sawar}
          </label>
          <input
            type="range"
            min="500"
            max={zat}
            step="500"
            value={Math.min(sawar, zat)}
            onChange={(e) => setSawar(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 text-white space-y-2 text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-1">
          <span className="font-bold text-amber-300">Official Mansab Status:</span>
          <span className="font-mono text-emerald-400 font-bold">{getRankClass()}</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          <strong>Zat</strong> determined personal salary and position in the court protocol. <strong>Sawar</strong> specified the number of armed cavalrymen the mansabdar had to maintain and present for royal inspection (Dagh system of branding horses).
        </p>
      </div>

      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 text-center font-bold">
        🛑 <strong>UPSC Prelims Trap:</strong> The Sawar rank could NEVER exceed the Zat rank! Furthermore, mansabdari was NOT hereditary; on an officer\'s death, all property escheated to the state.
      </div>
    </div>
  );
}

// ========================================================
// 10. MODERN FREEDOM MOVEMENTS VISUALIZER (his_11, 12, 13)
// ========================================================
export function ModernFreedomVisualizer() {
  const [selectedPhase, setSelectedPhase] = useState('champaran');

  const trilogy = {
    champaran: {
      name: 'Champaran (1917, Bihar)',
      tactic: 'First Civil Disobedience',
      issue: 'Oppressive Tinkathia system forcing indigo on 3/20th of peasant lands.',
      leader: 'Rajkumar Shukla invited Gandhi; supported by Rajendra Prasad and JB Kripalani.',
      outcome: 'Government abolished Tinkathia system and agreed to refund 25% of illegally extracted money.'
    },
    ahmedabad: {
      name: 'Ahmedabad Mill Strike (1918)',
      tactic: 'First Hunger Strike',
      issue: 'Mill owners discontinued the Wartime Plague Bonus; workers demanded 50% raise.',
      leader: 'Supported by Anasuya Sarabhai (sister of mill owner Ambalal Sarabhai).',
      outcome: 'Tribunal awarded workers a 35% wage increase following Gandhi\'s hunger fast.'
    },
    kheda: {
      name: 'Kheda Satyagraha (1918, Gujarat)',
      tactic: 'First Non-Cooperation',
      issue: 'Crops failed below 25% due to drought, entitling farmers to revenue remission under the Land Code.',
      leader: 'Sardar Vallabhbhai Patel, Indulal Yagnik, and Gandhi led revenue refusal.',
      outcome: 'Government secretly instructed tax collectors to collect revenue only from those who could afford to pay.'
    }
  };

  const cur = trilogy[selectedPhase];

  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn select-none">
      <div className="space-y-1">
        <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase font-mono">
          Gandhian Satyagraha Trilogy Matrix
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Gandhi\'s initial localized campaigns in India established his non-violent mass methodology.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Object.entries(trilogy).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setSelectedPhase(k)}
            className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
              selectedPhase === k
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md font-bold'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className="text-xs block font-black">{v.name.split(' ')[0]}</span>
            <span className="text-[9.5px] opacity-80 block">{v.tactic.split(' ')[1]}</span>
          </button>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/40 text-white space-y-2.5 text-xs leading-relaxed">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <span className="font-bold text-amber-300">{cur.name}</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold text-[10px]">
            {cur.tactic}
          </span>
        </div>
        <p className="text-slate-200"><strong>The Core Grievance:</strong> {cur.issue}</p>
        <p className="text-slate-200"><strong>Leadership Alignment:</strong> {cur.leader}</p>
        <p className="text-emerald-300"><strong>Movement Outcome:</strong> {cur.outcome}</p>
      </div>

      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 text-center font-bold">
        🎯 <strong>UPSC Direct Match:</strong> Champaran = 1st Civil Disobedience • Ahmedabad = 1st Hunger Strike • Kheda = 1st Non-Cooperation.
      </div>
    </div>
  );
}

// ========================================================
// 11. UNIVERSAL HISTORY FLOW & TRAP DETECTOR VISUALIZER
// Covers ANY History Subtopic with Interactive Analysis
// ========================================================
import detailsHistory from '../data/content/details_history.json';

export function UniversalHistoryFlowVisualizer({ subtopicKey }) {
  const [activeTab, setActiveTab] = useState('statement'); // 'statement', 'table', 'trap', 'revision'
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Reset tab and quiz state whenever user switches subtopic
  React.useEffect(() => {
    setActiveTab('statement');
    setQuizAnswer(null);
    setQuizSubmitted(false);
  }, [subtopicKey]);

  const item = detailsHistory.find((x) => x.subtopicKey === subtopicKey) || detailsHistory[0];

  const h2Match = item.paragraphs.match(/<h2[^>]*>(.*?)<\/h2>/i);
  const title = h2Match ? h2Match[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim() : (item.videoTitle || 'Historical Milestone');

  const stmtMatch = item.paragraphs.match(/<b>Statement:<\/b>(.*?)(?:<\/div>|<p>)/i);
  const statement = stmtMatch ? stmtMatch[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim() : 'Critical historical development in this phase.';

  const trapMatch = item.paragraphs.match(/<b>Exam Trap:<\/b>(.*?)(?:<\/div>|<p>)/i);
  const examTrap = trapMatch ? trapMatch[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim() : 'Watch for classification and sequence traps.';

  const revMatch = item.paragraphs.match(/<b>UPSC Revision:<\/b>(.*?)(?:<\/div>|<p>)/i);
  const revision = revMatch ? revMatch[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim() : statement;

  // Extract table rows if available
  const trMatches = item.paragraphs.match(/<tr[^>]*>.*?<\/tr>/gi) || [];
  const tableRows = [];
  trMatches.forEach((tr) => {
    const cells = (tr.match(/<t[hd][^>]*>(.*?)<\/t[hd]>/gi) || []).map((c) =>
      c.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim()
    );
    if (cells.length) tableRows.push(cells);
  });

  return (
    <div className="space-y-4 animate-fadeIn select-none">
      {/* Visual Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('statement')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'statement' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🗺️</span>
          <span>Core Concept Map</span>
        </button>
        {tableRows.length > 0 && (
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'table' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>📊</span>
            <span>Comparative Matrix</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab('trap')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'trap' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🎯</span>
          <span>Prelims Trap Detector</span>
        </button>
        <button
          onClick={() => setActiveTab('revision')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'revision' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>⚡</span>
          <span>Revision Formula</span>
        </button>
      </div>

      {/* TAB 1: CORE CONCEPT MAP */}
      {activeTab === 'statement' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 border border-indigo-500/40 text-white space-y-2.5">
            <span className="text-[10px] uppercase font-mono font-black text-amber-400 tracking-wider">
              OFFICIAL HISTORICAL THESIS
            </span>
            <h4 className="text-sm sm:text-base font-black text-white">{title}</h4>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
              \"{statement}\"
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 block">Syllabus Anchor</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">GS Paper 1 History & Culture</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40">
              <span className="font-bold text-emerald-700 dark:text-emerald-300 block">Civil Services Yield</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">High-Frequency Prelims Theme</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPARATIVE MATRIX TABLE */}
      {activeTab === 'table' && tableRows.length > 0 && (
        <div className="space-y-3 animate-fadeIn overflow-x-auto">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-indigo-500/40 text-amber-300 font-mono text-[10px] uppercase">
                  {tableRows[0].map((h, idx) => (
                    <th key={idx} className="p-2 font-black">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {tableRows.slice(1).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/60 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2 text-slate-200 text-[11px] leading-relaxed">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRELIMS TRAP DETECTOR */}
      {activeTab === 'trap' && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <div>
              <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 font-mono block">
                COMMISSION EXAM TRAP ALERT
              </span>
              <h5 className="text-xs font-black text-slate-900 dark:text-white">
                Don\'t lose negative marks to this classic misconception!
              </h5>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {examTrap}
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
              Concept Check: Have you locked this exception into your notes?
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={quizSubmitted}
                onClick={() => { setQuizAnswer('yes'); setQuizSubmitted(true); }}
                className="p-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all cursor-pointer"
              >
                ✓ Understood & Memorized
              </button>
              <button
                disabled={quizSubmitted}
                onClick={() => { setQuizAnswer('review'); setQuizSubmitted(true); }}
                className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 transition-all cursor-pointer"
              >
                🔄 Need Another Look
              </button>
            </div>
            {quizSubmitted && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-900 dark:text-emerald-200 font-bold text-center">
                ✨ Recorded in your mental revision archive for UPSC Civil Services!
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: REVISION FORMULA */}
      {activeTab === 'revision' && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/50 text-white space-y-2.5 animate-fadeIn">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">
            ⚡ 10-SECOND UPSC REVISION CAPSULE
          </span>
          <h4 className="text-sm font-black text-white">{title}</h4>
          <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
            {revision}
          </div>
        </div>
      )}
    </div>
  );
}
