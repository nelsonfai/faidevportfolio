'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

let diagramId = 0;

export default function MermaidDiagram({ chart }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let active = true;
    const id = `case-study-diagram-${diagramId++}`;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'base',
      themeVariables: {
        fontFamily: 'Poppins, sans-serif',
        primaryColor: '#f4f4f4',
        primaryTextColor: '#1d1d1d',
        primaryBorderColor: '#1d1d1d',
        lineColor: '#1d1d1d',
      },
    });

    mermaid.render(id, chart).then(({ svg }) => {
      if (active && containerRef.current) containerRef.current.innerHTML = svg;
    });

    return () => { active = false; };
  }, [chart]);

  return <div className="mermaid-diagram" ref={containerRef} aria-label="Architecture diagram" />;
}
