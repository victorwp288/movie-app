import { useState, useEffect } from 'react'
import * as d3 from 'd3'
import cloud from 'd3-cloud'


export function useWordCloud(words, width, height) {
  const [cloudWords, setCloudWords] = useState([])

  useEffect(() => {
    const layout = cloud()
      .size([width, height])
      .words(words)
      .padding(5)
      .rotate(() => (~~(Math.random() * 6) - 3) * 30)
      .font("Arial")
      .fontSize((d) => d.size)
      .on("end", (cloudWords) => setCloudWords(cloudWords))

    layout.start()
  }, [words, width, height])

  return cloudWords
}

