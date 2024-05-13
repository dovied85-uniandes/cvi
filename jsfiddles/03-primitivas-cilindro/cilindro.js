"use strict";

var m = ThreeDMath;

function main() {
  var N = 50;
  var r = 1;
  var h = 1;
  var x0 = 2;
  var y0 = 3;
  var z0 = 0;
  var cylinderVertices = [];
  var indices = [];
  var colorVertices = [];
  // centro de la base de arriba
  cylinderVertices.push(x0, z0 + h/2, y0);
  indices.push(0);
  colorVertices.push(1,0,0,1);
  // puntos de la base de arriba
  for (var i = 0; i <= N; i++) {
    cylinderVertices.push(
      x0 + r*Math.cos(2*Math.PI*i/N), z0 + h/2, y0 + r*Math.sin(2*Math.PI*i/N)
    );
    indices.push(i+1);
    colorVertices.push(1,0,0,1);
  }
  // centro de la base de abajo
  cylinderVertices.push(x0, z0 - h/2, y0);
  indices.push(N+2);
  colorVertices.push(0,1,0,1);
  // puntos de la base de abajo
  for (var i = 0; i <= N; i++) {
    cylinderVertices.push(
      x0 + r*Math.cos(2*Math.PI*i/N), z0 - h/2, y0 + r*Math.sin(2*Math.PI*i/N)
    );
    indices.push(N+3+i);
    colorVertices.push(0,1,0,1);
  }
  // puntos de la cara del cilindro
  for (var i = 0; i <= N; i++) {
    cylinderVertices.push(
      x0 + r*Math.cos(2*Math.PI*i/N), z0 + h/2, y0 + r*Math.sin(2*Math.PI*i/N)
    );
    cylinderVertices.push(
      x0 + r*Math.cos(2*Math.PI*i/N), z0 - h/2, y0 + r*Math.sin(2*Math.PI*i/N)
    );
    indices.push(2*N+4+2*i,2*N+4+2*i+1);
    colorVertices.push(0,0,1,0.2,0,0,1,0.2);
  }
  
  var canvas = document.getElementById("c");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    alert("no webgl");
    return;
  }

  var program = webglUtils.createProgramFromScripts(
      gl, ["2d-vertex-shader", "2d-fragment-shader"]);
  gl.useProgram(program);

  var worldViewProjectionLoc = gl.getUniformLocation(program, "u_worldViewProjection");
      
  // Create and store data into vertex buffer
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderVertices), gl.STATIC_DRAW);
  // Associate position attribute to vertex shader
  var positionLoc = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
  
  // Create and store data into color buffer
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorVertices), gl.STATIC_DRAW);
  // Associate color attribute to vertex shader
  var color = gl.getAttribLocation(program, "color");
  gl.enableVertexAttribArray(color);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  
  // Create and store data into index buffer
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  
  function render(clock) {
    clock *= 0.001;

    var scale = 4;

    webglUtils.resizeCanvasToDisplaySize(gl.canvas, window.devicePixelRatio);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(1.0);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var fieldOfView = Math.PI * 0.25;
    var aspect = canvas.clientWidth / canvas.clientHeight;
    var projection = m.perspective(fieldOfView, aspect, 0.0001, 500);
    var radius = 5;
    var eye = [
        Math.sin(clock) * radius,
        1,
        Math.cos(clock) * radius,
    ];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var view = m.lookAt(eye, target, up);

    var worldViewProjection = m.multiplyMatrix(view, projection);
    gl.uniformMatrix4fv(worldViewProjectionLoc, false, worldViewProjection);

    gl.drawElements(gl.TRIANGLE_FAN, N+2, gl.UNSIGNED_SHORT, 0);
    gl.drawElements(gl.TRIANGLE_FAN, N+2, gl.UNSIGNED_SHORT, 2*(N+2));
    gl.drawElements(gl.TRIANGLE_STRIP, 2*(N+1), gl.UNSIGNED_SHORT, 4*(N+2));
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
