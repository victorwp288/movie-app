import React, { useState } from "react";
import { useWordCloud } from "../services/WordCloudService";

export function WordCloud({ words, width, height }) {
  const [hoveredWord, setHoveredWord] = useState(null);
  const cloudWords = useWordCloud(words, width, height);

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {cloudWords.map((word, i) => (
            <text
              key={i}
              style={{
                fill: hoveredWord === word.text ? "#ff6b6b" : "#4a4a4a",
                fontSize: word.size,
                fontFamily: word.font,
                fontWeight: word.weight,
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
      {hoveredWord && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg">
          {hoveredWord}
        </div>
      )}
    </div>
  );
}
