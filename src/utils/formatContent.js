/**
 * formatContent.js
 * Universal parser to convert markdown syntax (**bold**, *italic*) mixed inside HTML
 * into clean, standard, rendered HTML tags (<b>bold</b>, <i>italic</i>).
 */

export function formatContentHtml(content) {
  if (!content || typeof content !== 'string') return content || '';

  let res = content;

  // 1. Convert Markdown bold: **text** -> <b>text</b>
  res = res.replace(/\*\*([^*\r\n]+?)\*\*/g, '<b>$1</b>');

  // 2. Convert Markdown bold with underscores: __text__ -> <b>text</b>
  res = res.replace(/__([^_]+?)__/g, '<b>$1</b>');

  // 3. Convert Markdown italic: *text* -> <i>text</i> (negative lookbehind/lookahead for *)
  res = res.replace(/(?<!\*)\*([^*\r\n]+?)\*(?!\*)/g, '<i>$1</i>');

  return res;
}

export default formatContentHtml;
