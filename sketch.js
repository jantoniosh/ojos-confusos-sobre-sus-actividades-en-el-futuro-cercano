// the shader variable
let theShader;
let count = 0;
let iteration = 0;
let tone;
let vibrato;
let fft;
let freq;
let ojo;

function preload() {
  // load the shader
  theShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(864, 864, WEBGL);
  pixelDensity(1);
  vibrato = new p5.Oscillator();
  vibrato.freq(5);
  vibrato.amp(15);
  vibrato.disconnect();
  tone = new p5.Oscillator();
  tone.setType('sine');
  tone.amp(0.5);
  tone.freq(220);
  tone.freq(vibrato);
  fft = new p5.FFT(0.8, 16);
  noCursor();
}

function draw() {
  // send resolution of sketch into shader
  let spectrum = fft.analyze();

  freq = map(mouseX, 0, width, 200, 700);
  ojo = map(mouseX, 0, width, 0.05, 0.4);

  if (freq > 700) {
    freq = 700;
    ojo = 0.4;
  }
  if (freq < 200) {
    freq = 200;
    ojo = 0.05;
  }
  console.log(freq);
  tone.freq(freq);

  theShader.setUniform('u_resolution', [width, height]);
  theShader.setUniform('u_mouse', [mouseX, mouseY]);
  theShader.setUniform('u_time', frameCount * 0.05);
  theShader.setUniform('factor', spectrum[8]);
  theShader.setUniform('ojo', ojo);

  shader(theShader);
  rect(0, 0, width, height);
}

function mousePressed() {
  vibrato.start();
  tone.start();
}
