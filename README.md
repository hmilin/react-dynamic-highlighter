# React Dynamic Highlighter

A react component for highlight words, supports custom className, tagName and other attributes.

demo: http://highlighter.meiling.fun/

## Installation

```
$ npm install --save react-dynamic-highlighter
```

## Usage

### simple

```typescript
import React from 'react';
import Highlighter from 'react-dynamic-highlighter';

const App = () => {
  return (
    <div>
      <Highlighter
        rules={[
          {
            word: ['stay'],
            caseSensitive: false,
            className: 'search-word-highlight',
          },
        ]}
      >
        Stay hungry, stay foolish
      </Highlighter>
    </div>
  );
};
```

```css
.search-word-highlight {
  background-color: aquamarine;
}
```

### custom React children

```typescript
import React from 'react';
import Highlighter from 'react-dynamic-highlighter';

const App = () => {
  return (
    <Highlighter
      rules={[
        {
          word: ['warning', 'WARNING', 'Warning'],
          className: 'log-display-warning',
        },
        {
          regexp: /err(or)?/gi,
          className: 'log-display-error',
        },
        {
          regexp: /(http(s){0,1}:\/\/)([\S]+)/gi,
          tagName: 'a',
          className: 'log-link',
          getAttributes: (text) => ({
            href: text,
            target: '__blank',
            rel: 'noopener noreferrer',
          }),
        },
      ]}
    >
      <pre className="log-display-container">
        <code>{logData}</code>
      </pre>
    </Highlighter>
  );
};
```

```css
.log-display-container {
  width: 600px;
  padding: 16px;
  color: #c6c6c6;
  white-space: pre-wrap;
  word-break: break-all;
  background: #1e1e1e;
}

.log-display-warning {
  color: #fdbd72;
}

.log-display-error {
  color: #ff4b79;
}
```

## Props

| Property | Type | Requiired | Description |
| --- | --- | --- | --- |
| children | ReactNode | true | Any React Node |
| rule | HighlightRule[] | true | Describe how to highlight the words |
| onHighlightChange | (count: Record<string, number>) => void; | false | A function called when highlighting count changing |

### HighlightRule

| Property | Type | Requiired | Description |
| --- | --- | --- | --- |
| regexp | RegExp | false | A regexp to match highlighting words |
| word | string[] | false | The highlighting words |
| caseSensitive | boolean | false | Case sensitivity. The default value is false |
| className | string | true | The className will be added the highlighting node |
| tagName | string | false | The highlighting node Html TagName. The default value is span |
| getAttributes | (text: string) => any | false | Setting highlighting node with highlighting content |
