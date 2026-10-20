// src/config/multimediaConfig.js

/**
 * FEATURE FLAGS: Topic-by-Topic Multimedia Activation
 *
 * Use this registry to enable or disable the "🗺️ Interactive Flow" and
 * "🎬 Shorts Reel (9:16)" tabs for users topic-by-topic with each release.
 *
 * Current Status: ALL TOPICS DISABLED FOR NOW (including Topic 1).
 *
 * To enable any topic for a release:
 * 1. Add / uncomment its subtopicKey below, OR
 * 2. Set "hasInteractiveDiagram": true or "hasVideo": true in details_history.json.
 */

export const ENABLED_INTERACTIVE_TOPICS = new Set([
  // ========================================================
  // TOPIC 1: INDUS VALLEY CIVILISATION & VEDIC AGE
  // ========================================================
  // 'his_1_p0_s0_b0', // The Citadel vs Lower Town Layout (3D Blueprint & Drainage)
  // 'his_1_p0_s0_b1', // Lothal Dockyard Tidal Sluice & Dholavira Reservoirs
  // 'his_1_p0_s1_b0', // Meluha Trade & Chert Binary Weights Scale Puzzle
  // 'his_1_p0_s1_b1', // Lost-Wax Metallurgy & Pashupati Seal Hotspots
  // 'his_1_p1_s0_b0', // Rig Vedic Pastoralism & Cattle Wealth Converter
  // 'his_1_p1_s0_b1', // Tribal Democratic Assemblies (Sabha vs Samiti vs Vidatha)

  // ========================================================
  // TOPIC 2 ONWARDS (Ready for upcoming releases)
  // ========================================================
  // 'his_2_p0_s0_b0', // Material and Varna Conflict: Rise of Vaishyas
  // 'his_2_p0_s0_b1', // Agrarian Conflict: Animal Husbandry vs Ritual Slaughter
  // 'his_2_p1_s0_b0', // Buddhism: Core Doctrines & Philosophical Pillars
  // 'his_2_p1_s0_b1', // Canonical Stratigraphy: The Structural Tripitakas
  // 'his_2_p1_s0_b2', // The Four Buddhist Councils & Ideological Schisms
  // 'his_2_p1_s1_b0', // Jainism: Metaphysics, Triratna, & Syadvada
  // 'his_2_p1_s1_b1', // The Great Jain Schism: Digambaras vs Shvetambaras
  // 'his_2_p2_s0_b0', // Ajivika Philosophy: Absolute Fatalism
  // 'his_2_p2_s0_b1', // Charvaka / Lokayata: Radical Materialism
  // 'his_3_p0_s0_b0', // 16 Mahajanapadas & Ganasanghas
  // 'his_4_p0_s0_b0', // Sangam Age: Five Tinais Matrix
  // 'his_5_p0_s0_b0', // Delhi Sultanate: Four Centralized Ministries
  // 'his_6_p0_s0_b0', // Mughal Mansabdari System: Zat vs Sawar
  // 'his_7_p0_s0_b0', // Mauryan Rock-Cut Cave Foundations
  // 'his_8_p0_s0_b0', // The European Arrival Sequence
  // 'his_9_p0_s0_b0', // The Santhal Rebellion (Hool - 1855-56)
  // 'his_10_p0_s0_b0', // Raja Ram Mohan Roy & Brahmo Foundation
  // 'his_11_p0_s0_b0', // Pre-INC Political Formations & Swadeshi
  // 'his_12_p0_s0_b0', // The Early Trilogy: Regional Laboratories of Satyagraha
  // 'his_13_p0_s0_b0', // The First Wave: Bengal Secret Societies
  // 'his_14_p0_s0_b0', // Geopolitical Consolidation & Accession Triumvirate
]);

export const ENABLED_VIDEO_TOPICS = new Set([
  // ========================================================
  // TOPIC 1: INDUS VALLEY CIVILISATION & VEDIC AGE
  // ========================================================
  // 'his_1_p0_s0_b0', // Citadel vs Lower Town (9:16 Short with Indian Narration)
  // 'his_1_p0_s0_b1', // Lothal Hydraulic Docks (9:16 Short with Indian Narration)
  // 'his_1_p0_s1_b0', // Trade, Weights & Script (9:16 Short with Indian Narration)
  // 'his_1_p0_s1_b1', // Metallurgy & Lost-Wax Casting (9:16 Short with Indian Narration)
  // 'his_1_p1_s0_b0', // Rig Vedic Pastoralism (9:16 Short with Indian Narration)
  // 'his_1_p1_s0_b1', // Tribal Democratic Assemblies (9:16 Short with Indian Narration)

  // ========================================================
  // TOPIC 2 ONWARDS (Ready for upcoming releases)
  // ========================================================
  // 'his_2_p0_s0_b0',
  // 'his_2_p0_s0_b1',
  // 'his_2_p1_s0_b0',
  // 'his_2_p1_s0_b2',
  // 'his_3_p0_s0_b0',
  // 'his_4_p0_s0_b0',
  // 'his_5_p0_s0_b0',
  // 'his_6_p0_s0_b0',
  // 'his_12_p0_s0_b0',
]);

/**
 * Returns true if the Interactive Flow Diagram tab should be displayed to the user
 */
export function isInteractiveEnabled(subtopicKey) {
  if (!subtopicKey) return false;
  return ENABLED_INTERACTIVE_TOPICS.has(subtopicKey);
}

/**
 * Returns true if the 9:16 Shorts Reel tab should be displayed to the user
 */
export function isVideoEnabled(subtopicKey) {
  if (!subtopicKey) return false;
  return ENABLED_VIDEO_TOPICS.has(subtopicKey);
}
