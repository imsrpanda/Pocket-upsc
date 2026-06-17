import Dexie from 'dexie';
import defaultSyllabus from './syllabus.json';

// Initialize the pocketUpsc Database Instance
export const db = new Dexie('pocketUpscDatabase');

// Define tables and indexing criteria columns
db.version(1).stores({
  syllabusProgress: 'id', 
  questions: 'id, subjectId, topicId', 
  savedSnippets: 'id, topicId',
  userNotes: '++id, topicId, savedAt',
  detailedContent: 'subtopicKey', 
  quizSessions: 'topicId' 
});

export async function seedDatabaseIfEmpty() {
  const isDevelopment = import.meta.env.DEV;

  // ==========================================
  // PHASE 1: DYNAMIC & SAFE QUIZ QUESTIONS UPSERT
  // ==========================================
  try {
    console.log("⚡ Syncing question bundles safely via atomic non-destructive upserts...");
    
    const polity = await import('./quiz/quiz_polity.json');
    const economy = await import('./quiz/quiz_economy.json');
    const geography = await import('./quiz/quiz_geography.json');
    const environment = await import('./quiz/quiz_environment.json');
    const history = await import('./quiz/quiz_history.json');
    const science = await import('./quiz/quiz_science.json');
    
    const rawMasterPool = [
      ...(polity.default || polity),
      ...(economy.default || economy),
      ...(geography.default || geography),
      ...(environment.default || environment),
      ...(history.default || history),
      ...(science.default || science)
    ];

    const mappedQuestions = rawMasterPool.map((q, idx) => ({
      id: `${q.subjectId || 'sub'}_${q.topicId || 'top'}_${idx}`,
      subjectId: q.subjectId,
      topicId: q.topicId,
      q: q.q,
      options: q.options,
      correct: q.correct,
      ex: q.ex
    }));

    // 🎯 PRODUCTION SAFE: bulkPut upserts new/edited entries inline. 
    // Your users' personal tracking/notes tables are NEVER cleared or disturbed.
    await db.questions.bulkPut(mappedQuestions);
    console.log(`✅ Verified ${mappedQuestions.length} question rows synced up-to-date.`);

  } catch (error) {
    console.error("❌ Database quiz seeding encountered an asset parsing error:", error);
  }

  // ==========================================
  // PHASE 2: UPGRADE-SAFE DETAILED CONTENT UPSERT
  // ==========================================
  try {
    const detailFiles = import.meta.glob('./content/details_*.json');
    let combinedDetailsArray = [];

    for (const path in detailFiles) {
      const module = await detailFiles[path]();
      const fileData = module.default || module;
      if (Array.isArray(fileData)) {
        combinedDetailsArray.push(...fileData);
      }
    }

    if (combinedDetailsArray.length > 0) {
      const recordsToPut = combinedDetailsArray.map(entry => ({
        subtopicKey: entry.subtopicKey,
        paragraphs: entry.paragraphs,
        imageBlob: null 
      }));


      // 🎯 THE FIX: If you delete a topic in development files, we want the UI to reflect it immediately.
      // But in production, we skip the clear() completely, allowing bulkPut to cleanly add/edit entries!
      if (isDevelopment) {
        const currentDbCount = await db.detailedContent.count();
        // Only clear if the file sizes mismatched, preventing unnecessary write-flicker
        if (currentDbCount !== recordsToPut.length) {
          await db.detailedContent.clear();
        }
      }

      // Safe, non-destructive upsert loop pass. Leaves other database tables completely isolated.
      await db.detailedContent.bulkPut(recordsToPut);
      console.log(`✅ Verified ${recordsToPut.length} 'Learn More' cards sync-verified.`);
    }
  } catch (contentError) {
    console.error("❌ Local detailed content synchronization failed:", contentError);
  }

  // ==========================================
  // PHASE 3: NON-DESTRUCTIVE SYLLABUS CHECKLIST GROWTH
  // ==========================================
  try {
    const progressRows = defaultSyllabus.flatMap(subject => {
      const topicsList = subject.topics || subject.chapters || [];
      return topicsList.map(topic => ({ id: topic.id, completed: 0 }));
    });

    if (progressRows.length > 0) {
      // 🎯 THE FIX: Instead of checking if table count is exactly 0, we look for *new additions*
      // bulkAdd ignores keys that are already present, ensuring previous user checked marks remain safe!
      await db.syllabusProgress.bulkAdd(progressRows).catch(err => {
        // Dexie throws a bulk error if duplicates are ignored, which is exactly what we expect on updates!
        if (isDevelopment) console.log("ℹ️ Existing tracker keys verified.");
      });
      console.log("✅ Syllabus checklist verified up-to-date.");
    }
  } catch (syllabusErr) {
    console.error("❌ Checklist updates deferred:", syllabusErr);
  }
}
