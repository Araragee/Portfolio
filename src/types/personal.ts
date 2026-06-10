export interface Hobby {
  name: string
  blurb: string
}

export interface Value {
  title: string
  body: string
}

export interface PersonalContent {
  intro: string[]
  story: string[]
  values: Value[]
  hobbies: Hobby[]
  nowPlaying?: string[]
}
