/**
 * GLSL for the journey particle field, exported as template strings.
 */

export const particleVertexShader = /* glsl */ `
attribute vec3 aPositionTo;
attribute vec3 aBonsaiParent;
attribute vec3 aColorFrom;
attribute vec3 aColorTo;

uniform float uTime;
uniform float uProgress;
uniform vec3 uMouse;
uniform float uPointSize;
uniform float uDriftAmp;
uniform float uRepelRadius;
uniform float uRepelStrength;

uniform int uChapterIndex;
uniform float uInteractState;
uniform vec3 uInteractPos;

// Exclusion zones for text avoidance: [minX, minY, maxX, maxY]
// Array size must match MAX_EXCLUSION_ZONES in ParticleField.vue.
uniform vec4 uExclusionZones[8];
uniform int uExclusionCount;

// Counter-side field offset; scale.x gates side-slides (0 on mobile),
// scale.y keeps explicit vertical offsets alive everywhere.
uniform vec2 uOffsetFrom;
uniform vec2 uOffsetTo;
uniform vec2 uOffsetScale;
uniform float uFormationScale;

varying float vAlpha;
varying vec3 vColor;

float easeInOutCubic(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float h = hash(position.xy);
  float stagger = h * 0.05;
  float rawT = clamp((uProgress - stagger) / 0.95, 0.0, 1.0);
  float t = easeInOutCubic(rawT);
  
  vec3 pos;
  if (uChapterIndex == 0) {
    // Transition to Bonsai: Dropping like a sand timer
    float h1 = hash(position.xy + vec2(0.123, 0.456));
    float h2 = hash(position.yx + vec2(0.789, 0.111));
    float h3 = hash(position.xy + vec2(0.222, 0.333));
    
    // Sand timer neck/nozzle source (above the tree)
    vec3 posNozzle = vec3((h1 - 0.5) * 0.2, 2.8 + (h2 - 0.5) * 0.15, (h3 - 0.5) * 0.2);
    vec3 posTarget = aPositionTo;
    
    // Normalise tree Y (-2.3 to 1.2)
    float targetY = posTarget.y;
    float heightNorm = clamp((targetY + 2.3) / 3.5, 0.0, 1.0);
    
    // Higher points land first, lower points land last
    float startVal = (1.0 - heightNorm) * 0.5;
    float endVal = startVal + 0.5;
    
    // Add jitter to create organic particle streams
    float jitter = (h1 - 0.5) * 0.08;
    startVal = clamp(startVal + jitter, 0.0, 0.5);
    endVal = clamp(endVal + jitter, 0.5, 1.0);
    
    float pT = clamp((uProgress - startVal) / (endVal - startVal), 0.0, 1.0);
    float easePT = easeInOutCubic(pT);
    
    if (easePT < 0.35) {
      // Phase 1: Converge from initial position to nozzle
      float t1 = clamp(easePT / 0.35, 0.0, 1.0);
      pos = mix(position, posNozzle, easeInOutCubic(t1));
    } else {
      // Phase 2: Drop from nozzle to target on the tree
      float t2 = clamp((easePT - 0.35) / 0.65, 0.0, 1.0);
      float tVert = clamp(t2 / 0.7, 0.0, 1.0);
      float tHoriz = clamp((t2 - 0.55) / 0.45, 0.0, 1.0);
      
      float easeVert = tVert * tVert;
      
      pos.y = mix(posNozzle.y, posTarget.y, easeVert);
      pos.x = mix(posNozzle.x, posTarget.x, easeInOutCubic(tHoriz));
      pos.z = mix(posNozzle.z, posTarget.z, easeInOutCubic(tHoriz));
    }
    vColor = mix(aColorFrom, aColorTo, easePT);
  } else {
    // Standard linear mix for other chapters
    pos = mix(position, aPositionTo, t);
    vColor = mix(aColorFrom, aColorTo, t);
  }
  
  // Apply scaling and offsets
  pos.xy *= uFormationScale;
  pos.xy += mix(uOffsetFrom, uOffsetTo, t) * uOffsetScale;

  // Idle drift
  pos.x += sin(uTime * 0.30 + position.y * 2.0) * 0.02 * uDriftAmp;
  pos.y += cos(uTime * 0.25 + position.x * 2.0) * 0.02 * uDriftAmp;

  // Interactions (switch by chapter)
  float force = 0.0;
  
  if (uChapterIndex == 0) {
    // Prologue: Repel
    vec2 away = pos.xy - uMouse.xy;
    float dist = length(away);
    force = smoothstep(uRepelRadius, 0.0, dist);
    pos.xy += normalize(away + vec2(0.0001)) * force * uRepelStrength * uDriftAmp;
  } 
  else if (uChapterIndex == 1) {
    // Bonsai: Hover extend
    vec2 away = pos.xy - uMouse.xy;
    force = smoothstep(1.5, 0.0, length(away));
    pos.xy += normalize(pos.xy + vec2(0.0, 2.3)) * force * 0.1 * uDriftAmp;
  }
  else if (uChapterIndex == 2) {
    // Peso: Drag ripple/wave
    vec2 away = pos.xy - uInteractPos.xy;
    force = smoothstep(2.5, 0.0, length(away));
    pos.xy += sin(uTime * 5.0 - length(away) * 3.0) * normalize(away + vec2(0.0001)) * force * uInteractState * 0.35 * uDriftAmp;
  }
  else if (uChapterIndex == 3) {
    // SDGs: Lift Z
    vec2 away = pos.xy - uMouse.xy;
    force = smoothstep(0.8, 0.0, length(away));
    pos.z += force * 0.4 * uDriftAmp;
  }
  else if (uChapterIndex == 4) {
    // CBMS Logo: Rotate slightly on hover, and explode on click
    float angle = uInteractState * 1.5;
    float s = sin(angle);
    float c = cos(angle);
    float nx = pos.x * c - pos.z * s;
    float nz = pos.x * s + pos.z * c;
    pos.x = mix(pos.x, nx, uDriftAmp);
    pos.z = mix(pos.z, nz, uDriftAmp);

    vec2 away = pos.xy - uInteractPos.xy;
    force = smoothstep(3.0, 0.0, length(away));
    float impulse = sin(uInteractState * 3.14159);
    pos.xy += normalize(away + vec2(0.0001)) * force * impulse * 1.8 * uDriftAmp;
  }
  else if (uChapterIndex == 5) {
    // Portrait: Flow with cursor
    vec2 away = pos.xy - uMouse.xy;
    force = smoothstep(1.8, 0.0, length(away));
    pos.xy += away * force * 0.15 * uDriftAmp;
  }
  else if (uChapterIndex == 6) {
    // DAVXLOPER: Explode on click
    vec2 away = pos.xy - uInteractPos.xy;
    force = smoothstep(3.0, 0.0, length(away));
    float impulse = sin(uInteractState * 3.14159);
    pos.xy += normalize(away + vec2(0.0001)) * force * impulse * 1.8 * uDriftAmp;
  }

  // Dynamic Text Avoidance — every chapter, last so nothing re-enters a zone
  for (int j = 0; j < 8; j++) {
    if (j >= uExclusionCount) break;
    vec4 box = uExclusionZones[j]; // [minX, minY, maxX, maxY]
    vec2 center = (box.xy + box.zw) * 0.5;
    vec2 halfSize = (box.zw - box.xy) * 0.5 + vec2(0.28); // padded boundary

    vec2 d = pos.xy - center;
    vec2 absD = abs(d);

    if (absD.x < halfSize.x && absD.y < halfSize.y) {
      vec2 overlap = halfSize - absD;
      vec2 dir = sign(d);
      // Push out along the shallower overlap direction
      if (overlap.x < overlap.y) {
        pos.x += dir.x * overlap.x;
      } else {
        pos.y += dir.y * overlap.y;
      }
    }
  }

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uPointSize * (8.0 / -mvPosition.z);

  vAlpha = 1.0 - force * 0.3;
}
`

export const particleFragmentShader = /* glsl */ `
uniform float uOpacity;
uniform float uDither;

varying float vAlpha;
varying vec3 vColor;

// Bayer 4×4 ordered dither
float bayerThreshold(vec2 fragCoord) {
  float x = mod(floor(fragCoord.x), 4.0);
  float y = mod(floor(fragCoord.y), 4.0);
  float v = 0.0;
  if (x < 1.0) {
    if (y < 1.0)      v =  0.0;
    else if (y < 2.0) v = 12.0;
    else if (y < 3.0) v =  3.0;
    else              v = 15.0;
  } else if (x < 2.0) {
    if (y < 1.0)      v =  8.0;
    else if (y < 2.0) v =  4.0;
    else if (y < 3.0) v = 11.0;
    else              v =  7.0;
  } else if (x < 3.0) {
    if (y < 1.0)      v =  2.0;
    else if (y < 2.0) v = 14.0;
    else if (y < 3.0) v =  1.0;
    else              v = 13.0;
  } else {
    if (y < 1.0)      v = 10.0;
    else if (y < 2.0) v =  6.0;
    else if (y < 3.0) v =  9.0;
    else              v =  5.0;
  }
  return (v + 0.5) / 16.0;
}

void main() {
  float alpha = uOpacity * vAlpha;
  if (uDither > 0.5) {
    alpha = step(bayerThreshold(gl_FragCoord.xy), alpha);
  }
  gl_FragColor = vec4(vColor, alpha);
}
`
