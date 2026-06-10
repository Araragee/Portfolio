import type { PersonalContent } from '@/types/personal'

export const personalContent: PersonalContent = {
  intro: [
    'Off the clock, I go by Araragi. This is the side of me that does not ship tickets. It is the side that reads late, plays late, and argues about frame rates.',
    'The professional page is about the work. This page is about the person doing it.',
  ],
  story: [
    "I came into software the long way around. I was a CS student first (learning the lectures, the theory, and joining late-night study groups trying to make sense of recursion at 2 AM). School gave me the vocabulary, but it did not give me the fluency.",
    'Fluency came from building. I worked on small projects, broken projects, and projects that never shipped. I moved from static pages to jQuery to Vue, hunted down stack traces on forums, and slowly put together a mental model of how the web actually works underneath the tooling.',
    'A 3-month web-design internship at iPhitech in Clark from March to May 2023 was the first time I got paid to care about pixels. By October 2023, I landed at the Philippine Statistics Authority, where I\'ve worked on the CBMS Portal since 2023, building the thing and becoming the developer I wanted to be along the way.',
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
      body: 'The best interface is the one that gets out of the way. I delete features that do not earn their place.',
    },
    {
      title: 'Collaboration',
      body: 'Software is a team sport. I value clear writing, honest reviews, and assume the next developer is smarter than me.',
    },
  ],
  hobbies: [
    {
      name: 'Gaming',
      blurb:
        'Long-form RPGs, competitive shooters, and anything with a tight feedback loop. It sharpens pattern recognition.',
    },
    {
      name: 'Anime & Manga',
      blurb:
        'The handle "Araragi" is not an accident. I read widely across shonen, seinen, and slice-of-life genres. I think animation is a very under-rated storytelling medium.',
    },
    {
      name: 'Music',
      blurb:
        'Always something playing while I work. I listen to anything from OSTs to lo-fi to whatever the algorithm surfaces this week.',
    },
    {
      name: 'Fitness & Outdoors',
      blurb:
        'Balancing screen time with movement. I enjoy gym sessions, walks, and trips out of the city.',
    },
  ],
}
