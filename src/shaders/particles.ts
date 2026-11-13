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
// Sprung, normalised scroll velocity (~-1..1) and smoothed pointer velocity
// (world units/s) — see ParticleField.vue. Both are 0 at rest.
uniform float uScrollVel;
uniform vec2 uMouseVel;
uniform vec3 uInk;

// Live-tunable (customizer panel): hover reach/strength, apply-everywhere flag,
// turbulence, scroll drag, and the share of a morph spent on staggered starts.
uniform float uHoverRadius;
uniform float uHoverStrength;
uniform float uHoverAll;
uniform float uStir;
uniform float uDrag;
uniform float uStagger;

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

// Divergence-free flow: curl of an analytic sin/cos potential (two octaves).
// Neighbours share a current, so mid-morph reads as dust in wind, not jitter.
vec2 flowField(vec2 p, float time) {
  vec2 a = p * 0.9 + vec2(time * 0.21, -time * 0.17);
  vec2 b = p * 2.3 + vec2(-time * 0.13, time * 0.29);
  return vec2(
    sin(a.x) * cos(a.y) + 0.5 * sin(b.x) * cos(b.y) * 2.3 / 0.9,
    -cos(a.x) * sin(a.y) - 0.5 * cos(b.x) * sin(b.y) * 2.3 / 0.9
  ) * 0.5;
}

void main() {
  float h = hash(position.xy);
  float mass = hash(position.yx + 17.0); // 0 = light, 1 = heavy

  // Whole-field eased progress: offsets slide rigidly on this.
  // /0.95 keeps the old slack: some store windows top out just short of 1.
  float p = clamp(uProgress / 0.95, 0.0, 1.0);
  float t = easeInOutCubic(p);

  // Per-particle progress: staggered start (random + left-to-right sweep), all
  // arrive by uProgress = 1, so formations assemble in waves. Exact at 0 and 1.
  float delay = (0.6 * h + 0.4 * clamp(position.x / 9.0 + 0.5, 0.0, 1.0)) * uStagger;
  float ti = easeInOutCubic(clamp((p - delay) / (1.0 - uStagger), 0.0, 1.0));
  // 0 at rest, 1 mid-flight — gates everything that must vanish once formed.
  // travel = 0 for a particle whose target equals its start (same formation on
  // both ends, e.g. the deck's last stretch) — it must not scatter or re-grey.
  float travel = smoothstep(0.0, 0.05, distance(position, aPositionTo));
  float flight = sin(ti * 3.14159265) * travel;

  vec3 pos = mix(position, aPositionTo, ti);
  // Boring → interesting: every formation lands in grey, then its colour
  // floods in over the last stretch of the flight.
  float greyTo = dot(aColorTo, vec3(0.299, 0.587, 0.114));
  vec3 colorTo = mix(vec3(greyTo), aColorTo, max(smoothstep(0.6, 1.0, ti), 1.0 - travel));
  vColor = mix(aColorFrom, colorTo, ti);
  // Near-black "ink" particles take the world's ink colour (light on dark worlds).
  float lum = dot(vColor, vec3(0.299, 0.587, 0.114));
  vColor = mix(uInk, vColor, smoothstep(0.08, 0.2, lum));

  // Hero (face) particles break apart into a diffuse cloud as the crisp portrait
  // PNG resolves over them, gathering back as it releases — "shatter / reform"
  // instead of a flat dissolve. Only the face block (aIsHero) scatters, so the
  // floating project icons hold. uDriftAmp gate => reduced motion snaps, no scatter.
  if (aIsHero > 0.5 && uFaceCrispProgress > 0.0) {
    // Target center of the image (0, 0 in local space)
    vec2 targetCenter = vec2(0.0, 0.0);
    
    // Variation so particles arrive at slightly different rates
    float collapseSpeed = 0.8 + 0.4 * hash(position.yx);
    float tCollapse = clamp(uFaceCrispProgress * collapseSpeed, 0.0, 1.0);
    
    // Ease the collapse (cubic in) so it starts slow and snaps into the center
    tCollapse = tCollapse * tCollapse * tCollapse;
    
    // Tiny noise so it's an organic cluster rather than a perfect dot
    float ang = h * 6.28318;
    vec2 noise = vec2(cos(ang), sin(ang)) * 0.05 * uFaceCrispProgress;
    
    pos.xy = mix(pos.xy, targetCenter, tCollapse) + noise;
    pos.z  -= (0.2 + 0.5 * h) * 0.6 * uFaceCrispProgress * uDriftAmp;
  }
  
  // Apply scaling and offsets
  pos.xy *= uFormationScale;
  pos.xy += mix(uOffsetFrom, uOffsetTo, t) * uOffsetScale;

  // In-flight turbulence: particles ride the flow field between formations and
  // burst in depth (size follows via perspective). Fast scroll stirs it harder.
  float stir = flight * (0.35 + 0.5 * h) * (1.0 + abs(uScrollVel)) * uStir * uDriftAmp;
  pos.xy += flowField(pos.xy + h * 0.6, uTime) * stir;
  pos.z += (mass - 0.5) * 1.4 * flight * uStir * uDriftAmp;

  // Scroll inertia, in flight only: particles leaving a formation are dragged
  // with the page (heavy ones trail further). Held formations stay rock still.
  pos.y += uScrollVel * (0.12 + 0.3 * mass) * flight * uDrag * uDriftAmp;

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
  float sizeBoost = 1.0;
  
  if (uChapterIndex == 0 || uHoverAll > 0.5) {
    // Hover styles (customizer picks uHoverMode; reach/strength are live too)
    vec2 away = pos.xy - uMouse.xy;
    float dist = length(away);
    vec2 dir = normalize(away + vec2(0.0001));
    float R = max(uHoverRadius, 0.001);
    float S = uHoverStrength * uDriftAmp;
    float fall = smoothstep(R, 0.0, dist);
    if (uHoverMode == 0) {
      // scatter (original): blast outward plus per-particle noise
      force = fall;
      float angle = h * 6.28318 + uTime * 2.0;
      vec2 scatterNoise = vec2(cos(angle), sin(angle)) * 0.5;
      pos.xy += (dir * 1.2 + scatterNoise) * fall * S;
    } else if (uHoverMode == 1) {
      // vortex: swirl around the cursor
      force = fall;
      pos.xy += vec2(-dir.y, dir.x) * fall * 0.5 * S;
    } else if (uHoverMode == 2) {
      // ripple: rings travel outward through the formation
      float reach = smoothstep(R * 1.5, 0.0, dist);
      force = reach * 0.5;
      pos.xy += dir * sin(dist * 4.0 - uTime * 6.0) * reach * 0.4 * S;
    } else if (uHoverMode == 3) {
      // attract: pulled toward the cursor, never past it
      force = fall;
      pos.xy -= dir * min(dist, fall * 0.8 * S);
    } else if (uHoverMode == 4) {
      // lens: magnify under the cursor, shape stays legible
      pos.xy = uMouse.xy + away * (1.0 + fall * 0.8 * S);
      sizeBoost = 1.0 + fall * 0.6 * S;
    } else if (uHoverMode == 5) {
      // dent: pressed back in depth — smaller and dimmer where touched
      pos.z -= fall * 1.6 * S;
      force = fall * 1.5;
    } else if (uHoverMode == 7) {
      // comb: dragged into streaks along the cursor's travel
      pos.xy += uMouseVel * fall * (0.1 + 0.3 * h) * S;
    } else if (uHoverMode == 8) {
      // ink reveal: nothing moves; colour blooms under the cursor
      vec3 bloom = 0.5 + 0.5 * cos(6.28318 * (pos.x * 0.12 + pos.y * 0.07 + vec3(0.0, 0.33, 0.67)) + uTime * 0.4);
      vColor = mix(vColor, bloom * 0.85, clamp(fall * 1.4 * S, 0.0, 1.0));
      sizeBoost = 1.0 + fall * 0.25 * S;
    } else if (uHoverMode == 9) {
      // soft scatter: outward push only, no noise
      force = fall * 0.5;
      pos.xy += dir * fall * 0.9 * S;
    }
    // mode 6 (wake only): no hover force — just the cursor wake below
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

  // Cursor wake (every chapter): a moving pointer shoves nearby particles along
  // its velocity; light ones go further. Zero when the pointer is still.
  float wake = smoothstep(1.6, 0.0, length(pos.xy - uMouse.xy));
  pos.xy += uMouseVel * wake * (0.9 - 0.5 * mass) * 0.1 * uDriftAmp;

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
  gl_PointSize = uPointSize * pulseFactor * sizeBoost * (8.0 / -mvPosition.z);

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
