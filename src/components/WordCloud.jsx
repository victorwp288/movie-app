import React, { useState } from "react";
import { useWordCloud } from "../services/WordCloudService";

export function WordCloud({ words, width, height }) {
  const [hoveredWord, setHoveredWord] = useState(null);
  const cloudWords = useWordCloud(words, width, height);

  if (!words || words.length === 0) {
    return <div>No words available for cloud visualization</div>;
  }

  return (
    <div style={{ position: 'relative', width, height }}>
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {cloudWords.map((word, i) => (
            <text
              key={i}
              style={{
                fill: hoveredWord === word.text ? "#ff6b6b" : "#4a4a4a",
                fontSize: word.size,
                fontFamily: "Arial",
                fontWeight: word.size > 40 ? "bold" : "normal",
                textAnchor: "middle",
                cursor: "pointer",
                transition: "fill 0.3s ease",
              }}
              transform={`translate(${word.x},${word.y})rotate(${word.rotate})`}
              onMouseEnter={() => setHoveredWord(word.text)}
              onMouseLeave={() => setHoveredWord(null)}
            >
              {word.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
