export type HighlightRule = {
  regexp?: RegExp;
  word?: string[];
  caseSensitive?: boolean;
  className: string;
  tagName?: string;
  getAttributes?: (text: string) => any;
};

export type Chunk = {
  highlight: boolean;
  rule?: HighlightRule;
  start: number;
  end: number;
};

/**
 * Creates an array of chunk objects representing both higlightable and non highlightable pieces of text that match each search word.
 * @return Array of "chunks" (where a Chunk is { start:number, end:number, highlight:boolean })
 */
export const findAll = ({
  rules,
  textToHighlight,
}: {
  rules: Array<HighlightRule>;
  textToHighlight: string;
}): Array<Chunk> =>
  fillInChunks({
    chunksToHighlight: combineChunks({
      chunks: findChunks({
        rules,
        textToHighlight,
      }),
    }),
    totalLength: textToHighlight ? textToHighlight.length : 0,
  });

/**
 * Given a set of chunks to highlight, create an additional set of chunks
 * to represent the bits of text between the highlighted text.
 * @param chunksToHighlight {start:number, end:number}[]
 * @param totalLength number
 * @return {start:number, end:number, highlight:boolean}[]
 */
export const fillInChunks = ({
  chunksToHighlight,
  totalLength,
}: {
  chunksToHighlight: Array<Chunk>;
  totalLength: number;
}): Array<Chunk> => {
  const allChunks: Chunk[] = [];
  const append = (start: number, end: number, highlight: boolean, rule?: HighlightRule) => {
    if (end - start > 0) {
      allChunks.push({
        start,
        end,
        highlight,
        rule,
      });
    }
  };

  if (chunksToHighlight.length === 0) {
    append(0, totalLength, false);
  } else {
    let lastIndex = 0;
    chunksToHighlight.forEach((chunk) => {
      append(lastIndex, chunk.start, false);
      append(chunk.start, chunk.end, true, chunk.rule);
      lastIndex = chunk.end;
    });
    append(lastIndex, totalLength, false);
  }
  return allChunks;
};

/**
 * Takes an array of {start:number, end:number} objects and combines chunks that overlap into single chunks.
 * @return {start:number, end:number}[]
 */
export const combineChunks = ({ chunks }: { chunks: Array<Chunk> }): Array<Chunk> => {
  const newChunks = chunks
    .sort((first, second) => first.start - second.start)
    .reduce<Chunk[]>((processedChunks, nextChunk) => {
      // First chunk just goes straight in the array...
      if (processedChunks.length === 0) {
        return [nextChunk];
      } else {
        // ... subsequent chunks get checked to see if they overlap...
        const prevChunk = processedChunks.pop();
        if (!prevChunk) {
          return processedChunks;
        }
        if (nextChunk.start <= prevChunk.end) {
          // It may be the case that prevChunk completely surrounds nextChunk, so take the
          // largest of the end indeces.
          const endIndex = Math.max(prevChunk.end, nextChunk.end);
          processedChunks.push({ highlight: false, start: prevChunk.start, end: endIndex });
        } else {
          processedChunks.push(prevChunk, nextChunk);
        }
        return processedChunks;
      }
    }, []);

  return newChunks;
};

/**
 * Examine text for any matches.
 * If we find matches, add them to the returned array as a "chunk" object ({start:number, end:number}).
 * @return {start:number, end:number}[]
 */
const findChunks = ({
  rules,
  textToHighlight,
}: {
  rules: Array<HighlightRule>;
  textToHighlight: string;
}): Array<Chunk> => {
  return rules
    .filter(({ word, regexp }) => word || regexp) // Remove empty words
    .reduce<Chunk[]>((chunks, rule) => {
      let regex: RegExp;
      if (rule.word) {
        regex = new RegExp(
          rule.word.map(escapeRegExpFn).join('|'),
          rule.caseSensitive ? 'g' : 'gi',
        );
      } else {
        regex = rule.regexp!;
      }

      let match;
      while ((match = regex.exec(textToHighlight))) {
        let start = match.index;
        let end = regex.lastIndex;
        // We do not return zero-length matches
        if (end > start) {
          chunks.push({ highlight: false, start, end, rule });
        }

        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }

      return chunks;
    }, []);
};

function escapeRegExpFn(string: string): string {
  return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
