"use strict";

var m = ThreeDMath;

function main() {
  var treeVertices = [
  //cubo (8 vértices)
    -0.2,-0.75,0.2,  -0.2,-0.75,-0.2,  0.2,-0.75,-0.2,  0.2,-0.75,0.2,
    -0.2,-0.25,0.2,  -0.2,-0.25,-0.2,  0.2,-0.25,-0.2,  0.2,-0.25,0.2,
  //pirámide 1 (5 vértices)
    -0.75,-0.25,0.75,  -0.75,-0.25,-0.75,  0.75,-0.25,-0.75,  0.75,-0.25,0.75,  0,0.5,0,
  //pirámide 2 (5 vértices)
    -0.5,0.25,0.5,  -0.5,0.25,-0.5,  0.5,0.25,-0.5,  0.5,0.25,0.5,  0,0.75,0,   
  ];
  var colorVertices = [
  //café (8 vértices)
     0.55,0.30,0.25,  0.55,0.30,0.25,  0.55,0.30,0.25,  0.55,0.30,0.25, 
     0.55,0.30,0.25,  0.55,0.30,0.25,  0.55,0.30,0.25,  0.55,0.30,0.25, 
  //verde 1 (5 vértices)
     0.15,0.60,0.06,  0.15,0.60,0.06,  0.15,0.60,0.06,  0.15,0.60,0.06,  0.15,0.60,0.06,
  //verde 2 (5 vértices)
     0.15,0.60,0.06,  0.15,0.60,0.06,  0.15,0.60,0.06,  0.15,0.60,0.06,  0.15,0.60,0.06,
  ];
  var indices = [
  //cubo (12 fragmentos)
     0,1,2, 0,2,3, 0,4,7, 0,3,7, 0,1,5, 0,4,5, 2,3,6, 3,6,7, 4,5,7, 5,6,7, 1,2,5, 1,5,6,
  //pirámide 1 (6 fragmentos)
     8,9,12, 8,11,12, 9,10,12, 10,11,12, 8,9,11, 9,10,11,
  //pirámide 2 (6 fragmentos)
     13,14,17, 13,16,17, 14,15,17, 15,16,17, 13,14,16, 14,15,16,
  ];
  
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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(treeVertices), gl.STATIC_DRAW);
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
  gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
  
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

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
