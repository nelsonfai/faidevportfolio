'use client';

import { useEffect, useRef } from 'react';
let diagramId = 0;
let mermaidPromise;

function loadMermaid() {
  mermaidPromise ??= import('mermaid').then((module) => module.default);
  return mermaidPromise;
}

export default function MermaidDiagram({ chart }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let active = true;
    const id = `case-study-diagram-${diagramId++}`;

    loadMermaid().then(async (mermaid) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        themeVariables: {
          fontFamily: 'Poppins, sans-serif',
          primaryColor: '#f4f4f4',
          primaryTextColor: '#1d1d1d',
          primaryBorderColor: '#1d1d1d',
          lineColor: '#1d1d1d',
        },
      });

      const { svg } = await mermaid.render(id, chart);
      if (active && containerRef.current) containerRef.current.innerHTML = svg;
    }).catch((error) => {
      if (active) console.error('Unable to render architecture diagram:', error);
    });

    return () => { active = false; };
  }, [chart]);

  return <div className="mermaid-diagram" ref={containerRef} role="img" aria-label="Architecture diagram" />;
}
