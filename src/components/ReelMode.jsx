import React, { useState, useMemo, useRef } from 'react';

export default function ReelMode({ 
  selectedTopicId, 
  learningContent, 
  toggleSnippetHighlight, 
  highlightedSnippetsSet 
}) {
  // 🗺️ Active Stack Pointer Tracking State
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 🧪 Touch Physics Tracking Coordinates
  const touchStartPos = useRef(0);
  const touchDeltaPos = useRef(0);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  // Flatten the structural syllabus branches into an iterable stream
  const allReelCards = useMemo(() => {
    const cards = [];
    learningContent[selectedTopicId]?.phases.forEach((phase) => {
      phase.subtopics.forEach((sub) => {
        sub.bullets.forEach((bullet, bIdx) => {
          cards.push({
            phaseName: phase.phaseName,
            subtopicName: sub.name,
            text: bullet,
            index: bIdx
          });
        });
      });
    });
    return cards;
  }, [selectedTopicId, learningContent]);

  if (allReelCards.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs font-medium text-slate-400 h-[50vh]">
        No cards available for this module.
      </div>
    );
  }

  // 🖲️ Gesture Event Handlers: Track Touch Input
  const handleTouchStart = (e) => {
    touchStartPos.current = e.touches[0].clientY;
    touchDeltaPos.current = 0;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartPos.current;
    
    // Boundary dampening resistance math to simulate native tension loops
    if ((currentIndex === 0 && deltaY > 0) || (currentIndex === allReelCards.length - 1 && deltaY < 0)) {
      touchDeltaPos.current = deltaY * 0.25; // Apply 75% resistance push drag past limits
    } else {
      touchDeltaPos.current = deltaY;
    }

    // Apply interactive real-time visual drag tracking to card frame via pure style assignment
    if (containerRef.current) {
      const baseTranslate = -currentIndex * 100;
      // Map pixel pull distance into percentage shifts relative to parent boundaries
      const dynamicPercentShift = (touchDeltaPos.current / containerRef.current.offsetHeight) * 100;
      containerRef.current.style.transform = `translateY(${baseTranslate + dynamicPercentShift}%)`;
      containerRef.current.style.transition = 'none';
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const pullDistanceThreshold = 60; // Absolute minimum swipe pull distance trigger in pixels
    let targetIndex = currentIndex;

    // Evaluate swipe metrics and update index pointers accordingly
    if (touchDeltaPos.current < -pullDistanceThreshold && currentIndex < allReelCards.length - 1) {
      targetIndex = currentIndex + 1; // Trigger Swipe Up Next Card
    } else if (touchDeltaPos.current > pullDistanceThreshold && currentIndex > 0) {
      targetIndex = currentIndex - 1; // Trigger Swipe Down Prior Card
    }

    // Snap cleanly onto target index layout vector using smooth ease out velocity curve
    setCurrentIndex(targetIndex);
    if (containerRef.current) {
      containerRef.current.style.transform = `translateY(${-targetIndex * 100}%)`;
      containerRef.current.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
    }
  };

  return (
    <div className="flex-1 min-h-0 -mx-4 -mb-24 pb-24 relative overflow-hidden bg-slate-900 rounded-b-3xl">
      
      {/* 🚀 Dynamic Fixed Floating Meta Header HUD */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none drop-shadow-xs">
        <span className="text-[9px] font-black text-indigo-400 bg-indigo-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-indigo-900/50 uppercase tracking-widest">
          {allReelCards[currentIndex]?.phaseName.substring(0, 24)}...
        </span>
        <span className="text-[10px] font-black text-slate-400 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-md">
          {currentIndex + 1} / {allReelCards.length}
        </span>
      </div>

      {/* 🎬 The Master Reel Window Wrapper Canvas */}
      <div 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full flex flex-col transition-transform duration-300 pointer-events-auto"
        style={{ transform: `translateY(${-currentIndex * 100}%)`, touchAction: 'none' }}
      >
        {allReelCards.map((card, idx) => {
          const currentId = `${selectedTopicId}_${card.text.replace(/<[^>]*>/g, '').substring(0, 24).replace(/\s+/g, '_')}`;
          const isHighlighted = highlightedSnippetsSet.has(currentId);

          return (
            <div 
              key={idx} 
              className="w-full h-full shrink-0 p-6 pt-16 pb-12 flex flex-col justify-between select-none"
            >
              {/* Inner Styled Focal Revision Plate Card */}
              <div className="w-full h-full bg-slate-800 rounded-3xl border border-slate-700/60 p-6 flex flex-col shadow-2xl relative overflow-hidden justify-between">
                
                {/* Secondary Title Heading Label */}
                <h4 className="text-xs font-black text-indigo-300 uppercase tracking-wider border-b border-slate-700 pb-2.5 shrink-0">
                  {card.subtopicName}
                </h4>

                {/* Core UPSC Content Summary Focus Point */}
                <div className="flex-1 flex items-center justify-center my-4 overflow-y-auto max-h-[38vh] pr-1">
                  <p 
                    dangerouslySetInnerHTML={{ __html: card.text }}
                    className="text-sm font-bold leading-relaxed text-slate-100 text-center tracking-normal px-2"
                  />
                </div>

                {/* Interaction Footer Controls Panel */}
                <div className="flex items-center justify-between border-t border-slate-700/80 pt-4 shrink-0">
                  <button
                    onClick={() => toggleSnippetHighlight(card.text, selectedTopicId)}
                    className={`text-xs font-black px-4 py-2.5 rounded-xl border flex items-center gap-2 tracking-tight transition-all active:scale-95 ${
                      isHighlighted 
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/10' 
                        : 'bg-slate-700 text-slate-300 border-slate-600'
                    }`}
                  >
                    <span>{isHighlighted ? '📌 Bookmarked' : '▫️ Bookmark'}</span>
                  </button>

                  <div className="text-[9px] font-black tracking-widest uppercase text-slate-500 animate-pulse flex items-center gap-1.5 select-none">
                    Next Point ⬆
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}