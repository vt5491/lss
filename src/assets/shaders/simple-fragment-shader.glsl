#ifdef GL_ES
#precision highp float;
precision mediump float;
#endif

uniform sampler2D tOne;
uniform sampler2D tSec;

varying vec2 vUv;

void main(void)
{
  vec3 c;
  vec4 Ca = texture2D(tOne, vUv);
  vec4 Cb = texture2D(tSec, vUv);
  // c = Ca.rgb * Ca.a + Cb.rgb * Cb.a * (1.0 - Ca.a);
  c = Ca.rgb + Cb.rgb;
  gl_FragColor= vec4(c, 1.0);
}
