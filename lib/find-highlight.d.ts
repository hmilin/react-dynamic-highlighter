export declare type HighlightRule = {
    regexp?: RegExp;
    word?: string[];
    caseSensitive?: boolean;
    className: string;
    tagName?: string;
    getAttributes?: (text: string) => any;
};
export declare type Chunk = {
    highlight: boolean;
    rule?: HighlightRule;
    start: number;
    end: number;
};
/**
 * Creates an array of chunk objects representing both higlightable and non highlightable pieces of text that match each search word.
 * @return Array of "chunks" (where a Chunk is { start:number, end:number, highlight:boolean })
 */
export declare const findAll: ({ rules, textToHighlight, }: {
    rules: Array<HighlightRule>;
    textToHighlight: string;
}) => Array<Chunk>;
/**
 * Given a set of chunks to highlight, create an additional set of chunks
 * to represent the bits of text between the highlighted text.
 * @param chunksToHighlight {start:number, end:number}[]
 * @param totalLength number
 * @return {start:number, end:number, highlight:boolean}[]
 */
export declare const fillInChunks: ({ chunksToHighlight, totalLength, }: {
    chunksToHighlight: Array<Chunk>;
    totalLength: number;
}) => Array<Chunk>;
/**
 * Takes an array of {start:number, end:number} objects and combines chunks that overlap into single chunks.
 * @return {start:number, end:number}[]
 */
export declare const combineChunks: ({ chunks }: {
    chunks: Array<Chunk>;
}) => Array<Chunk>;
