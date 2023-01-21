#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float factor;
uniform float ojo;
const float PI = 3.14159265359;

vec3 hash3(float n) {
  return vec3(-0.5, -0.5, 0.0) + fract(sin(vec3(n, n + 1.0, n + 2.0)) * vec3(13.5453123, 31.1459123, 37.3490423));
}

vec3 noise(in float x) {
  float p = floor(x);
  float f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(hash3(p + 0.0), hash3(p + 1.0), f);
}

vec4 rgb(in int r, in int g, in int b) {
  float rf = float(r);
  float gf = float(g);
  float bf = float(b);

  return vec4(rf / 255.0, gf / 255.0, bf / 255.0, 1.0);
}

void eye(inout vec4 c, in vec2 coord, in vec2 pos, in float size, in vec2 mouse, in vec4 col1, in vec4 col2, float s) {
  vec4 e = c;
  vec2 iris = pos + noise(pos.x * 37.0 + pos.y * 123.0 + float(u_time / 3.0)).xy / 2.0 * size;
  vec2 almond = coord;

  almond = vec2(almond.x, almond.y - sign(pos.y - almond.y) * size * 0.9);

  coord -= (vec2(0.5, 0.5) - coord) * 0.6 * size;

  if(length(almond - pos) < size * 1.5) {
    if(length(pos - coord) < size) {
      if(length(coord - iris) > 0.6 * size)
        e = rgb(255, 255, 255);
      else {
        if(length(coord - iris) > s * size) {
          e = rgb(0, 0, 0);
        } else {
          e = vec4(1.0);
        }
      }
    } else {
      e = rgb(255, 255, 255);
    }
  }
  c = e;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.y = 1.0 - uv.y;
  uv = vec2(uv.x, uv.y * (u_resolution.y / u_resolution.x));

  // vec4 c = mix(rgb(226, 210, 145), rgb(244, 138, 96), gl_FragCoord.y / u_resolution.y / 2.0);
  vec2 mouse = u_mouse.xy / u_resolution.xy;
  mouse = vec2(mouse.x, mouse.y * (u_resolution.y / u_resolution.x));

  float offset = factor * sin(u_time);
  vec2 center = vec2(1.0, 1.0);
  float bright = 1.0 - factor * mod(distance(center, uv), 0.5);
  bright += offset;
  bright = mod(bright, 1.0);

  vec4 c = vec4(bright, bright, bright, 1.0);

  // gl_FragColor = vec4(bright, bright, bright, 1.0);

  eye(c, uv, vec2(0.5, 0.4), 0.1, mouse, rgb(145, 210, 218), rgb(84, 133, 139), ojo);
  eye(c, uv, vec2(0.75, 0.3), 0.06, mouse, rgb(255, 152, 184), rgb(255, 120, 234), ojo);
  eye(c, uv, vec2(0.15, 0.1), 0.06, mouse, rgb(255, 152, 184), rgb(255, 120, 234), ojo);
  eye(c, uv, vec2(0.4, 0.2), 0.12, mouse, rgb(192, 228, 80), rgb(98, 193, 51), ojo);

  eye(c, uv, vec2(0.75, 0.74), 0.2, mouse, rgb(145, 210, 218), rgb(84, 133, 139), ojo);
  eye(c, uv, vec2(0.25, 0.72), 0.08, mouse, rgb(255, 152, 184), rgb(255, 120, 234), ojo);
  eye(c, uv, vec2(0.25, 0.51), 0.16, mouse, rgb(255, 152, 184), rgb(255, 120, 234), ojo);
  eye(c, uv, vec2(0.4, 0.2), 0.12, mouse, rgb(192, 228, 80), rgb(98, 193, 51), ojo);

  // // gl_FragColor = vec4(1.0, 0.0, 0.0, 1);
  gl_FragColor = c;
}