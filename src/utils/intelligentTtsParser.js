/**
 * intelligentTtsParser.js
 * 
 * Intelligent UPSC Audio Parser with Fluid Uninterrupted Sentences:
 * - When <h2> is encountered: says "Now you are listening to the topic: [Header]"
 * - When #fff3cd (Statement box) is encountered: says "Important points to remember in this topic: [Statement]"
 * - When bold terms (<b> / <strong>) are encountered: keeps the full sentence 100% continuous
 *   with NO mid-sentence pauses. Extracts boldWords metadata so SubtopicAudioPlayer can trigger
 *   an innovative soft attentive chime and real-time visual spotlight!
 * - When <table> is encountered: says "Remember this table", then reads row by row: Point 1: <td> ... <td>, Next point: <td> ... <td>
 * - When #fee2e2 (Exam Trap) is encountered: says "Caution! Common Exam Trap to remember: [Trap]" with elevated attention pitch
 * - When <b>UPSC Revision</b> is encountered: SKIPS IT COMPLETELY as requested
 */

const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function numberToTwoDigitWords(n) {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  const ten = Math.floor(n / 10);
  const one = n % 10;
  return one === 0 ? TENS[ten] : `${TENS[ten]} ${ONES[one]}`;
}

/**
 * Converts a 4-digit or 3-digit year into standard spoken English.
 * e.g., 1773 -> "seventeen seventy three", 1857 -> "eighteen fifty seven",
 *       1905 -> "nineteen oh five", 1500 -> "fifteen hundred"
 */
export function convertYearToWords(yearStr) {
  const y = parseInt(yearStr, 10);
  if (isNaN(y)) return yearStr;

  // 4-digit years: 1000 to 2099
  if (y >= 1000 && y <= 2099) {
    if (y === 2000) return 'two thousand';
    if (y > 2000 && y < 2010) {
      return `two thousand ${ONES[y - 2000]}`;
    }
    if (y === 1000) return 'one thousand';

    const century = Math.floor(y / 100);
    const remainder = y % 100;
    const centuryWord = numberToTwoDigitWords(century);

    if (remainder === 0) {
      return `${centuryWord} hundred`;
    } else if (remainder < 10) {
      return `${centuryWord} oh ${ONES[remainder]}`;
    } else {
      return `${centuryWord} ${numberToTwoDigitWords(remainder)}`;
    }
  }

  // 3-digit BCE/CE years: 100 to 999
  if (y >= 100 && y <= 999) {
    const hundred = Math.floor(y / 100);
    const remainder = y % 100;
    const hundredWord = ONES[hundred] + ' hundred';
    if (remainder === 0) return hundredWord;
    return `${hundredWord} and ${numberToTwoDigitWords(remainder)}`;
  }

  return yearStr;
}

/**
 * Standardizes years, historical eras, and acronyms for crystal clear speech:
 * - 1773 -> "seventeen seventy three"
 * - 1773–1784 -> "seventeen seventy three to seventeen eighty four"
 * - c. 1500 BCE -> "circa fifteen hundred B C E"
 * - BCE / CE / BC / AD -> spelled out clearly as "B C E", "C E", etc.
 */
export function normalizeYearsAndSpeech(text) {
  if (!text) return '';

  let res = text;

  // 1. Expand "c. 1500" / "c.1500" -> "circa 1500"
  res = res.replace(/\bc\.\s*(\d+)/gi, 'circa $1');

  // 2. Expand 4-digit year ranges like "1773–1784" or "1773-1784"
  res = res.replace(/\b(1\d{3}|20\d{2})\s*[–—\-]\s*(1\d{3}|20\d{2})\b/g, (match, y1, y2) => {
    return `${convertYearToWords(y1)} to ${convertYearToWords(y2)}`;
  });

  // 3. Year ranges with BCE/CE/BC/AD (e.g. "1500 BCE – 1000 BCE" or "1000 – 600 BCE")
  res = res.replace(/\b(1\d{3}|\d{3})\s*(BCE|BC|CE|AD)?\s*[–—\-]\s*(\d{3,4})\s*(BCE|BC|CE|AD)\b/gi, (match, y1, era1, y2, era2) => {
    const era1Str = era1 ? ` ${era1.toUpperCase().split('').join(' ')}` : '';
    const era2Str = ` ${era2.toUpperCase().split('').join(' ')}`;
    return `${convertYearToWords(y1)}${era1Str} to ${convertYearToWords(y2)}${era2Str}`;
  });

  // 4. Standalone 4-digit years: 1000 to 2099 (e.g. 1773 -> seventeen seventy three, 1857 -> eighteen fifty seven)
  res = res.replace(/(?<!\d\.)\b(1\d{3}|20\d{2})\b(?!\.\d)/g, (match) => {
    return convertYearToWords(match);
  });

  // 5. 3-digit years followed by BCE / BC / CE / AD (e.g. "600 BCE" -> "six hundred B C E")
  res = res.replace(/\b([1-9]\d{2})\s*(BCE|BC|CE|AD)\b/gi, (match, num, era) => {
    return `${convertYearToWords(num)} ${era.toUpperCase().split('').join(' ')}`;
  });

  // 6. Ensure era acronyms are spoken with clear separation so TTS doesn't say "bee-cee" or "bce"
  res = res.replace(/\bBCE\b/g, 'B C E')
           .replace(/\bBC\b/g, 'B C')
           .replace(/\bCE\b/g, 'C E')
           .replace(/\bAD\b/g, 'A D');

  return res;
}

function cleanText(text) {
  if (!text) return '';
  const sanitized = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, ' and ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  return normalizeYearsAndSpeech(sanitized);
}

function hasBgColor(element, hexColor) {
  if (!element || !element.getAttribute) return false;
  const style = (element.getAttribute('style') || '').toLowerCase();
  const hex = hexColor.toLowerCase().replace('#', '');
  return style.includes(hex);
}

/**
 * Extracts clean full text and array of bold terms from a paragraph node
 * without breaking the sentence into awkward fragments.
 */
function extractParagraphWithBoldMetadata(pNode) {
  const boldWords = [];
  const boldElements = pNode.querySelectorAll('b, strong');
  boldElements.forEach((b) => {
    const text = cleanText(b.textContent);
    if (text) {
      boldWords.push(text);
    }
  });

  const fullText = cleanText(pNode.textContent);
  return {
    fullText,
    boldWords
  };
}

/**
 * Main parser: takes detailed HTML string (or fallback bullet text)
 * and generates smooth, continuous speech segments with bold metadata.
 */
export function parseIntelligentSpeechSegments(htmlContent, rawBulletText, fallbackTitle = 'Topic') {
  const segments = [];

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    const text = cleanText((htmlContent || rawBulletText || '').replace(/<[^>]*>/g, ''));
    return [{
      text: `Now you are listening to the topic, ${fallbackTitle}. ${text}`,
      pitch: 1.16,
      boldWords: []
    }];
  }

  const parser = new DOMParser();
  let doc = null;

  try {
    doc = parser.parseFromString(htmlContent || '', 'text/html');
  } catch (e) {
    // fallback
  }

  let root = doc?.body?.firstElementChild || doc?.body;

  // Fallback: If no structured HTML in htmlContent, parse rawBulletText
  if (!root || !root.children || root.children.length === 0) {
    const bulletDoc = parser.parseFromString(rawBulletText || '', 'text/html');
    const bulletRoot = bulletDoc?.body;

    let extractedTitle = fallbackTitle;
    const boldTag = bulletRoot?.querySelector('b') || bulletRoot?.querySelector('strong');
    if (boldTag) {
      extractedTitle = cleanText(boldTag.textContent).replace(/[:\-–—\s]+$/, '');
    }

    segments.push({
      text: `Now you are listening to the topic, "${extractedTitle}".`,
      pitch: 1.20,
      isHeader: true,
      pauseAfterMs: 400,
      boldWords: [extractedTitle]
    });

    if (bulletRoot) {
      const { fullText, boldWords } = extractParagraphWithBoldMetadata(bulletRoot);
      if (fullText) {
        segments.push({
          text: fullText,
          pitch: 1.16,
          boldWords,
          pauseAfterMs: 300
        });
      }
    }
    return segments;
  }

  // Structured HTML from detailedContent
  const childElements = Array.from(root.children);
  const elementsToProcess =
    childElements.length === 1 && childElements[0].children.length > 1
      ? Array.from(childElements[0].children)
      : childElements;

  for (const el of elementsToProcess) {
    const tagName = el.tagName.toUpperCase();
    const textContent = cleanText(el.textContent);

    // RULE 5: Skip UPSC Revision completely
    if (
      textContent.includes('UPSC Revision') ||
      el.innerHTML.includes('UPSC Revision') ||
      hasBgColor(el, '#d1fae5')
    ) {
      continue;
    }

    // RULE 1: Header Tag start of page (H1 / H2 / H3)
    if (tagName === 'H1' || tagName === 'H2' || tagName === 'H3') {
      const title = textContent.replace(/[:\-–—\s]+$/, '');
      segments.push({
        text: `Now you are listening to the topic, "${title}".`,
        pitch: 1.20,
        isHeader: true,
        pauseAfterMs: 450,
        boldWords: [title]
      });
      continue;
    }

    // RULE 2: DIV with #fff3cd background (Statement / Important Concept box)
    if (tagName === 'DIV' && (hasBgColor(el, '#fff3cd') || hasBgColor(el, 'fff3cd') || textContent.startsWith('Statement:'))) {
      const statementClean = textContent.replace(/^Statement:\s*/i, '').trim();
      const { boldWords } = extractParagraphWithBoldMetadata(el);
      segments.push({
        text: `Important points to remember in this topic: ${statementClean}`,
        pitch: 1.18,
        isImportant: true,
        pauseAfterMs: 450,
        boldWords
      });
      continue;
    }

    // Exam Trap: DIV with #fee2e2 background
    if (tagName === 'DIV' && (hasBgColor(el, '#fee2e2') || hasBgColor(el, 'fee2e2') || textContent.startsWith('Exam Trap:'))) {
      const trapClean = textContent.replace(/^Exam Trap:\s*/i, '').trim();
      const { boldWords } = extractParagraphWithBoldMetadata(el);
      segments.push({
        text: `Caution! Common Exam Trap to remember: ${trapClean}`,
        pitch: 1.26,
        isExamTrap: true,
        pauseAfterMs: 450,
        boldWords
      });
      continue;
    }

    // RULE 4: TABLE (Row by row reading)
    if (tagName === 'TABLE') {
      segments.push({
        text: 'Remember this table.',
        pitch: 1.22,
        isTableIntro: true,
        pauseAfterMs: 400,
        boldWords: []
      });

      const rows = Array.from(el.querySelectorAll('tr'));
      let dataRowCounter = 0;

      for (const row of rows) {
        const tdCells = Array.from(row.querySelectorAll('td'));
        if (tdCells.length === 0) continue;

        dataRowCounter++;
        const rowPrefix = dataRowCounter === 1 ? 'Point 1: ' : 'Next point: ';

        const boldWordsInRow = [];
        row.querySelectorAll('b, strong').forEach((b) => {
          const w = cleanText(b.textContent);
          if (w) boldWordsInRow.push(w);
        });

        const cellPhrases = tdCells.map((td) => cleanText(td.textContent)).filter(Boolean);

        if (cellPhrases.length > 0) {
          const rowText = rowPrefix + cellPhrases.join(' ... ');
          segments.push({
            text: rowText,
            pitch: 1.16,
            isTableRow: true,
            pauseAfterMs: 450,
            boldWords: boldWordsInRow
          });
        }
      }
      continue;
    }

    // RULE 3 & Regular Paragraphs: Keep sentence 100% continuous, NO mid-sentence pauses
    if (tagName === 'P') {
      const { fullText, boldWords } = extractParagraphWithBoldMetadata(el);
      if (fullText) {
        segments.push({
          text: fullText,
          pitch: 1.16,
          pauseAfterMs: 350,
          boldWords
        });
      }
      continue;
    }

    // Any other text block fallback
    if (textContent) {
      const { fullText, boldWords } = extractParagraphWithBoldMetadata(el);
      if (fullText) {
        segments.push({
          text: fullText,
          pitch: 1.16,
          pauseAfterMs: 300,
          boldWords
        });
      }
    }
  }

  if (segments.length === 0) {
    const rawClean = cleanText((rawBulletText || fallbackTitle).replace(/<[^>]*>/g, ''));
    segments.push({
      text: `Now you are listening to the topic, "${fallbackTitle}". ${rawClean}`,
      pitch: 1.16,
      boldWords: []
    });
  }

  return segments;
}
