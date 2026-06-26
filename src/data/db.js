import Dexie from 'dexie';
import defaultSyllabus from './syllabus.json';

// Initialize the pocketUpsc Database Instance
export const db = new Dexie('pocketUpscDatabase');

// Define tables and indexing criteria columns
db.version(1).stores({
  syllabusProgress: 'id', 
  questions: 'id, subjectId, topicId', 
  pastPapers: 'id, year, paper', // Dedicated table tracking official Commission archives
  savedSnippets: 'id, topicId',
  userNotes: '++id, topicId, savedAt',
  detailedContent: 'subtopicKey', 
  quizSessions: 'topicId' 
});

export async function seedDatabaseIfEmpty() {
  const isDevelopment = import.meta.env.DEV;

  // ==========================================
  // PHASE 1: BULLETPROOF LOCAL-INDEXED QUIZ UPSERT
  // ==========================================
  try {
    console.log("⚡ Syncing question bundles via file-isolated localized indexing...");
    
    const polity = await import('./quiz/quiz_polity.json');
    const economy = await import('./quiz/quiz_economy.json');
    const geography = await import('./quiz/quiz_geography.json');
    const environment = await import('./quiz/quiz_environment.json');
    const history = await import('./quiz/quiz_history.json');
    const science = await import('./quiz/quiz_science.json');
    
    const bundles = {
      polity: polity.default || polity,
      economy: economy.default || economy,
      geography: geography.default || geography,
      environment: environment.default || environment,
      history: history.default || history,
      science: science.default || science
    };

    const mappedQuestions = [];

    Object.entries(bundles).forEach(([subjectKey, questionsArray]) => {
      if (!Array.isArray(questionsArray)) return;

      questionsArray.forEach((q, localIdx) => {
        if (!q.q) return;

        const normalizedSubject = subjectKey.toLowerCase().trim();
        const normalizedTopic = (q.topicId || 'top').toLowerCase().trim();

        mappedQuestions.push({
          id: `${normalizedSubject}_${normalizedTopic}_q${localIdx}`,
          subjectId: normalizedSubject,
          topicId: q.topicId,
          q: q.q,
          options: q.options,
          correct: q.correct,
          ex: q.ex
        });
      });
    });

    if (isDevelopment) {
      await db.questions.clear();
    }

    await db.questions.bulkPut(mappedQuestions);
    console.log(`✅ Verified ${mappedQuestions.length} master question rows synced up-to-date.`);

  } catch (error) {
    console.error("❌ Database quiz seeding encountered an asset parsing error:", error);
  }

  // ==========================================
  // PHASE 1.5: AUTOMATED INGESTION FOR OFFICIAL PAPERS
  // ==========================================
  try {
    console.log("⚡ Checking for official UPSC paper archives...");
    // Read every single file structure sitting in your archives folder dynamically
    const archiveFiles = import.meta.glob('./archives/**/*.json');
    let mappedPastQuestions = [];

    for (const path in archiveFiles) {
      const module = await archiveFiles[path]();
      const paperDataArray = module.default || module;
      
      if (Array.isArray(paperDataArray)) {
        paperDataArray.forEach((item) => {
          if (!item.q) return;
          
          const paperYear = item.year || 2026;
          const paperType = (item.paper || 'GS1').toUpperCase().trim();
          const questionNum = item.question || 1;

          mappedPastQuestions.push({
            // Primary key layout: 2026_gs1_q6
            id: `${paperYear}_${paperType.toLowerCase()}_q${questionNum}`,
            year: paperYear,
            paper: paperType,
            question: questionNum,
            q: item.q, // ✅ Fixed item variable tracking mapping mismatch
            options: item.options,
            correct: item.correct,
            ex: item.ex
          });
        });
      }
    }

    if (mappedPastQuestions.length > 0) {
      if (isDevelopment) {
        await db.pastPapers.clear();
      }
      await db.pastPapers.bulkPut(mappedPastQuestions);
      console.log(`📜 Verified ${mappedPastQuestions.length} official UPSC PYQ rows synchronized.`);
    }
  } catch (archiveError) {
    console.error("❌ Automated past papers ingestion run failed:", archiveError);
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

      if (isDevelopment) {
        const currentDbCount = await db.detailedContent.count();
        if (currentDbCount !== recordsToPut.length) {
          await db.detailedContent.clear();
        }
      }

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
      await db.syllabusProgress.bulkAdd(progressRows).catch(err => {
        if (isDevelopment) console.log("ℹ️ Existing tracker keys verified.");
      });
      console.log("✅ Syllabus checklist verified up-to-date.");
    }
  } catch (syllabusErr) {
    console.error("❌ Checklist updates deferred:", syllabusErr);
  }
}