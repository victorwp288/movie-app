import { useState, useEffect } from "react";
import cloud from "d3-cloud";

export function useWordCloud(words, width, height) {
  const [cloudWords, setCloudWords] = useState([]);

  useEffect(() => {
    // Clean the words by removing special characters and converting to lowercase
    const cleanWords = words.map(word => ({
      ...word,
      text: word.text
        .toLowerCase()
        .replace(/[.,;:?!'"`(){}[\]]/g, '') // Remove punctuation
        .trim()
    }))
    .filter(word => word.text.length > 0); // Remove any words that become empty after cleaning

    const layout = cloud()
      .size([width, height])
      .words(cleanWords)
      .padding(5)
      .rotate(() => (~~(Math.random() * 6) - 3) * 30)
      .font("Arial")
      .fontSize((d) => d.size)
      .on("end", (cloudWords) => setCloudWords(cloudWords));

    layout.start();
  }, [words, width, height]);

  return cloudWords;
}
