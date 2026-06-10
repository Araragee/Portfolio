import { buildMorphTargets } from './src/utils/morphTargets'

const targets = buildMorphTargets(16000)
const arch = targets.archipelago

let match = true
const expectedBars = targets.barTerrain
for (let i = 0; i < 16000; i++) {
  if (arch[i] !== expectedBars[i]) {
    match = false
    break
  }
}
console.log('Archipelago is identical to barTerrain:', match)
