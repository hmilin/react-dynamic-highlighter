import type { PropsWithChildren } from 'react';
import { HighlightRule } from './find-highlight';
declare type HighlightedCount = Record<string, number>;
export interface HighlighterProps {
    rules: HighlightRule[];
    onHighlightChange?: (count: HighlightedCount) => void;
}
declare const Highlighter: React.FC<PropsWithChildren<HighlighterProps>>;
export default Highlighter;
