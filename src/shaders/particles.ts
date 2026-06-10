/**
 * GLSL for the journey particle field, exported as template strings
 * (no vite glsl plugin needed — keeps the toolchain stock).
 *
 * Morphing happens entirely on the GPU: `position` holds the FROM state,
 * `aPositionTo` the TO state, and `uProgress` (0–1) scrubs between them.
 * The CPU only swaps attribute buffers at chapter boundaries.
 */

export const particleVertexShader = /* glsl */ `
attribute vec3 aPositionTo;

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

// Counter-side field offset (docs/TWEAKS/A-field-offset.md):
// slides the whole formation away from the chapter's text column,
// interpolated with the same eased t as the morph so it travels with it.
uniform vec2 uOffsetFrom;
uniform vec2 uOffsetTo;
uniform float uOffsetScale;
// Shrinks formations on narrow viewports so half a screen fits them
uniform float uFormationScale;

varying float vAlpha;

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
  vec3 pos = mix(position, aPositionTo, t);
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
    // Tree: Hover extend (push slightly outwards from origin)
    vec2 away = pos.xy - uMouse.xy;
    force = smoothstep(1.5, 0.0, length(away));
    pos.xy += normalize(pos.xy + vec2(0.0, 2.5)) * force * 0.15 * uDriftAmp;
  }
  else if (uChapterIndex == 2) {
    // Grid: Drag displace
    vec2 away = pos.xy - uInteractPos.xy;
    force = smoothstep(2.0, 0.0, length(away));
    vec2 dragDelta = uMouse.xy - uInteractPos.xy;
    pos.xy += dragDelta * force * uInteractState * uDriftAmp;
  }
  else if (uChapterIndex == 3) {
    // Archipelago: Lift Z
    vec2 away = pos.xy - uMouse.xy;
    force = smoothstep(0.8, 0.0, length(away));
    pos.z += force * 0.4 * uDriftAmp;
  }
  else if (uChapterIndex == 4) {
    // PSA Logo: Spin Globe slightly on hover
    // Rotate around Y axis based on interact state
    float angle = uInteractState * 1.5;
    float s = sin(angle);
    float c = cos(angle);
    float nx = pos.x * c - pos.z * s;
    float nz = pos.x * s + pos.z * c;
    pos.x = mix(pos.x, nx, uDriftAmp);
    pos.z = mix(pos.z, nz, uDriftAmp);
  }
  else if (uChapterIndex == 5) {
    // Artifact: Converge on click
    pos = mix(pos, vec3(0.0), uInteractState * 0.8 * uDriftAmp);
  }
  else if (uChapterIndex == 6) {
    // TALK: Radial impulse
    vec2 away = pos.xy - uInteractPos.xy;
    force = smoothstep(2.5, 0.0, length(away));
    float impulse = sin(uInteractState * 3.14159);
    pos.xy += normalize(away + vec2(0.0001)) * force * impulse * 1.5 * uDriftAmp;
  }

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uPointSize * (8.0 / -mvPosition.z);

  vAlpha = 1.0 - force * 0.5;
}
`

export const particleFragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
uniform float uDither;

varying float vAlpha;

// Bayer 4×4 ordered dither using float comparisons only (avoids constant
// array literals which are unsupported in WebKit GLSL ES 3.0).
// Returns threshold in [0,1] for the given screen-space position.
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
    // 1-bit ordered dither — quantise alpha to 0 or 1 per screen pixel
    alpha = step(bayerThreshold(gl_FragCoord.xy), alpha);
  }
  gl_FragColor = vec4(uColor, alpha);
}
`
