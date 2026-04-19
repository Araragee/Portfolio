import type { PersonalContent } from '@/types/personal'

export const personalContent: PersonalContent = {
  intro: [
    'Off the clock, I go by Araragi. This is the side of me that does not ship tickets — the one that reads late, plays late, and argues about frame rates.',
    'The professional page is about the work. This page is about the person doing it.',
  ],
  story: [
    "I came into software the long way around. A CS student first — the lectures, the theory, the late-night study groups trying to make sense of recursion at 2 AM. School gave me the vocabulary; it did not give me the fluency.",
    'Fluency came from building. Small projects, broken projects, projects that never shipped. I moved from static pages to jQuery to Vue, hunted down stack traces on forums, and slowly put together a mental model of how the web actually works underneath the tooling.',
    'A 3-month web-design internship at iPhitech in Clark was the first time I got paid to care about pixels. Shortly after, I landed at the Philippine Statistics Authority, where I have now spent three years on the CBMS Portal — building the thing, and becoming the developer I wanted to be along the way.',
  ],
  values: [
    {
      title: 'Craftsmanship',
      body: 'I would rather ship one well-made component than ten half-working ones. Quality compounds; shortcuts do not.',
    },
    {
      title: 'Curiosity',
      body: 'Every unfamiliar tool is a door. I read docs for fun, wander through changelogs, and keep a running list of things to break open next.',
    },
    {
      title: 'Restraint',
      body: 'The best interface is the one that gets out of the way. If a feature does not earn its place, it does not belong.',
    },
    {
      title: 'Collaboration',
      body: 'Software is a team sport. Clear writing, honest reviews, and the assumption that the next developer is smarter than me.',
    },
  ],
  hobbies: [
    {
      name: 'Gaming',
      blurb:
        'Long-form RPGs, competitive shooters, anything with a tight feedback loop. The kind of hobby that sharpens pattern recognition and teaches you how to lose well.',
    },
    {
      name: 'Anime & Manga',
      blurb:
        'The handle "Araragi" is not an accident. I read widely — shonen, seinen, slice-of-life — and think animation is one of the most under-rated storytelling mediums of the last thirty years.',
    },
    {
      name: 'Music',
      blurb:
        'Always something playing while I work. Anything from OSTs to lo-fi to whatever the algorithm surfaces this week. The shuffle is the playlist.',
    },
    {
      name: 'Fitness & Outdoors',
      blurb:
        'Balancing screen time with movement — gym sessions, walks, trips out of the city. The best debugging happens away from the keyboard.',
    },
  ],
}
