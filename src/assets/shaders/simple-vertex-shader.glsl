varying vec2 vUv;

void main()
{
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0  );
  gl_Position = projectionMatrix * mvPosition;
  //gl_Position = vec4(0,0,0,0);
}

