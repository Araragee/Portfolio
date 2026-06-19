/**
 * GLSL for the journey particle field, exported as template strings.
 */

export const particleVertexShader = /* glsl */ `
attribute vec3 aPositionTo;
attribute vec3 aBonsaiParent;
attribute vec3 aColorFrom;
attribute vec3 aColorTo;
attribute float aIsHero;

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
uniform int uDriftMode;
uniform int uHoverMode;
uniform float uPulse;
uniform float uFaceCrispProgress;

varying float vAlpha;
varying vec3 vColor;
varying float vIsHero;

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
  float stagger = 0.0;
  float rawT = clamp((uProgress - stagger) / 0.95, 0.0, 1.0);
  float t = easeInOutCubic(rawT);
  
  vec3 pos;
  // Standard linear mix for all chapters
  pos = mix(position, aPositionTo, t);
  vColor = mix(aColorFrom, aColorTo, t);
  
  // Apply scaling and offsets
  pos.xy *= uFormationScale;
  pos.xy += mix(uOffsetFrom, uOffsetTo, t) * uOffsetScale;

  // Hero (face) particles break apart into a diffuse cloud as the crisp portrait
  // PNG resolves over them, gathering back as it releases — "shatter / reform"
  // instead of a flat dissolve. Only the face block (aIsHero) scatters, so the
  // floating project icons hold. uDriftAmp gate => reduced motion snaps, no scatter.
  if (aIsHero > 0.5 && uFaceCrispProgress > 0.0) {
    float ang = h * 6.28318;
    float rad = (0.35 + 0.65 * hash(position.yx)) * 1.6; // diffuse disc, ~world units
    pos.xy += vec2(cos(ang), sin(ang)) * rad * uFaceCrispProgress * uDriftAmp;
    pos.z  += (h - 0.5) * 1.2 * uFaceCrispProgress * uDriftAmp;
  }

  // Idle drift
  if (uDriftMode == 0) {
    pos.x += sin(uTime * 0.30 + position.y * 2.0) * 0.02 * uDriftAmp;
    pos.y += cos(uTime * 0.25 + position.x * 2.0) * 0.02 * uDriftAmp;
  } else if (uDriftMode == 1) {
    float nx = sin(pos.y * 2.1 + uTime * 0.4) + 0.5 * sin(pos.y * 4.3 + uTime * 0.8);
    float ny = cos(pos.x * 2.1 + uTime * 0.4) + 0.5 * cos(pos.x * 4.3 + uTime * 0.8);
    pos.x += ny * 0.025 * uDriftAmp;
    pos.y -= nx * 0.025 * uDriftAmp;
  } else if (uDriftMode == 2) {
    pos.y += sin(uTime * 1.2 + pos.x * 2.5) * 0.035 * uDriftAmp;
    pos.x += cos(uTime * 0.9 + pos.y * 1.8) * 0.012 * uDriftAmp;
  } else if (uDriftMode == 3) {
    float angle = uTime * 0.35 + h * 6.28318;
    pos.x += cos(angle) * 0.018 * uDriftAmp;
    pos.y += sin(angle) * 0.018 * uDriftAmp;
  }

  // Interactions (switch by chapter)
  float force = 0.0;
  
  if (uChapterIndex == 0) {
    vec2 away = pos.xy - uMouse.xy;
    float dist = length(away);
    if (uHoverMode == 0) {
      // scatter (original)
      force = smoothstep(2.0, 0.0, dist);
      float angle = h * 6.28318 + uTime * 2.0;
      vec2 scatterNoise = vec2(cos(angle), sin(angle)) * 0.5;
      pos.xy += (normalize(away + vec2(0.0001)) * 1.2 + scatterNoise) * force * uDriftAmp;
    } else if (uHoverMode == 1) {
      // vortex
      force = smoothstep(2.0, 0.0, dist);
      vec2 tangent = vec2(-away.y, away.x) / max(dist, 0.001);
      pos.xy += tangent * force * 0.5 * uDriftAmp;
    } else if (uHoverMode == 2) {
      // radial ripple
      force = smoothstep(3.0, 0.0, dist) * 0.5;
      float wave = sin(dist * 4.0 - uTime * 6.0) * smoothstep(3.0, 0.0, dist) * 0.4;
      pos.xy += normalize(away + vec2(0.0001)) * wave * uDriftAmp;
    } else if (uHoverMode == 3) {
      // attract
      force = smoothstep(2.0, 0.0, dist);
      pos.xy -= normalize(away + vec2(0.0001)) * force * 0.8 * uDriftAmp;
    }
  }
  else if (uChapterIndex == 1) {
    // Bonsai: Hover extend
    vec2 away = pos.xy - uMouse.xy;
    force = smoothstep(1.5, 0.0, length(away));
    pos.xy += normalize(pos.xy + vec2(0.0, 2.3)) * force * 0.1 * uDriftAmp;
  }
  else if (uChapterIndex == 2 || uChapterIndex == 3) {
    // Peso / CBMS Logo: Drag ripple/wave
    vec2 away = pos.xy - uInteractPos.xy;
    force = smoothstep(2.5, 0.0, length(away));
    pos.xy += sin(uTime * 5.0 - length(away) * 3.0) * normalize(away + vec2(0.0001)) * force * uInteractState * 0.35 * uDriftAmp;
  }
  else if (uChapterIndex == 4) {
    // SDGs: Lift Z
    vec2 away = pos.xy - uMouse.xy;
    force = smoothstep(0.8, 0.0, length(away));
    pos.z += force * 0.4 * uDriftAmp;
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
    pos.xy += normalize(away + vec2(0.0001)) * force * uInteractState * 1.8 * uDriftAmp;
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
  float pulseFactor = 1.0 + uPulse * 0.3 * sin(uTime * 1.4 + h * 6.28318);
  gl_PointSize = uPointSize * pulseFactor * (8.0 / -mvPosition.z);

  vAlpha = 1.0 - force * 0.3;
  vIsHero = aIsHero;
}
`

export const particleFragmentShader = /* glsl */ `
uniform float uOpacity;
uniform float uDither;
uniform float uSoftCircle;
uniform float uFaceCrispProgress;

varying float vAlpha;
varying vec3 vColor;
varying float vIsHero;

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
  
  // Fade out only the hero (face) particles when the crisp PNG is showing
  alpha *= mix(1.0, 1.0 - uFaceCrispProgress, vIsHero);

  if (uSoftCircle > 0.5) {
    vec2 coord = gl_PointCoord - 0.5;
    float circle = 1.0 - smoothstep(0.35, 0.5, length(coord));
    alpha *= circle;
  }
  if (uDither > 0.5) {
    alpha = step(bayerThreshold(gl_FragCoord.xy), alpha);
  }
  gl_FragColor = vec4(vColor, alpha);
}
`
