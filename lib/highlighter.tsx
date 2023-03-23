import { isNil, uniq } from 'lodash';
import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { cloneElement, createElement, Fragment, useLayoutEffect, useState } from 'react';
import { findAll, HighlightRule } from './find-highlight';

function sumHighlightedCount(count: HighlightedCount, subCount: HighlightedCount) {
  for (const k of uniq([...Object.keys(count), ...Object.keys(subCount)])) {
    count[k] = (count[k] || 0) + (subCount[k] || 0);
  }
  return count;
}

function calcHighligter(rules: HighlightRule[], target: number | string | boolean) {
  const count: HighlightedCount = {};
  const textToHighlight = target + '';
  const chunks = findAll({
    rules,
    textToHighlight,
  });
  const node = createElement(
    Fragment,
    {},
    chunks.map(({ start, end, highlight, rule = {} }) => {
      const text = textToHighlight.substr(start, end - start);
      if (highlight) {
        const { className, tagName, getAttributes = () => {} } = rule;
        if (className) {
          count[className] = (count[className] || 0) + 1;
        }
        return createElement(tagName || 'span', { ...getAttributes(text), className }, text);
      } else {
        return text;
      }
    }),
  );
  return {
    node,
    count,
  };
}

function setHighlighter(
  children: ReactNode,
  rules: HighlightRule[],
  count: HighlightedCount,
): ReactNode {
  if (isNil(children)) return;
  switch (typeof children) {
    case 'number':
    case 'string':
    case 'boolean':
      const { node, count: c } = calcHighligter(rules, children);
      sumHighlightedCount(count, c);
      return node;
    default:
      if (Array.isArray((children as ReactElement)?.props.children)) {
        return cloneElement(children as ReactElement, {
          children: (children as ReactElement).props.children.map((child: ReactNode) =>
            setHighlighter(child, rules, count),
          ),
        });
      } else {
        return cloneElement(children as ReactElement, {
          children: setHighlighter((children as ReactElement).props.children, rules, count),
        });
      }
  }
}

type HighlightedCount = Record<string, number>;

export interface HighlighterProps {
  rules: HighlightRule[];
  onHighlightChange?: (count: HighlightedCount) => void;
}

const Highlighter: React.FC<PropsWithChildren<HighlighterProps>> = ({
  children,
  rules,
  onHighlightChange,
}) => {
  const [childrenModified, setChildrenModified] = useState<ReactNode>();

  useLayoutEffect(() => {
    const count: HighlightedCount = {};
    setChildrenModified(setHighlighter(children, rules, count));
    onHighlightChange?.(count);
  }, [children, onHighlightChange, rules]);

  return <div>{childrenModified}</div>;
};

export default Highlighter;
