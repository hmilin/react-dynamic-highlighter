import Highlighter from 'react-dynamic-highlighter';
import './App.css';
import logData from './log-data';

function App() {
  return (
    <div className="App">
      <h1>Demo</h1>
      <section>
        <h2>simple usage</h2>
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
      </section>
      <section>
        <h2>custom React children</h2>
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
      </section>
    </div>
  );
}

export default App;
