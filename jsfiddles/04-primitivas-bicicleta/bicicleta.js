"use strict";

var m = ThreeDMath;

function main() {

  function makeComponent(N, scaling, k, theta, position, color) {
    var cyl = {vertices:[], indices:[], colors:[]};
    cyl.N = N;
    cyl.size = 2*N + 4;
    // centro de la base de arriba
    cyl.vertices.push(0, 0.5, 0);
    cyl.indices.push(0);
    cyl.colors.push(color[0], color[1], color[2], color[3]);
    // puntos de la base de arriba
    for (var i = 0; i <= N; i++) {
      cyl.vertices.push(Math.cos(2*Math.PI*i/N), 0.5, Math.sin(2*Math.PI*i/N));
      cyl.indices.push(i+1);
      cyl.colors.push(color[0], color[1], color[2], color[3]);
    }
    // centro de la base de abajo
    cyl.vertices.push(0, -0.5, 0);
    cyl.indices.push(N+2);
    cyl.colors.push(color[0], color[1], color[2], color[3]);
    // puntos de la base de abajo
    for (var i = 0; i <= N; i++) {
      cyl.vertices.push(Math.cos(2*Math.PI*i/N), -0.5, Math.sin(2*Math.PI*i/N));
      cyl.indices.push(N+3+i);
      cyl.colors.push(color[0], color[1], color[2], color[3]);
    }
    // puntos de la cara del cilindro
    for (var i = 0; i <= N; i++) {
      cyl.indices.push(i+1,N+i+3);
    }
    // SCALING
    for (var i = 0; i < cyl.size; i++) {
      cyl.vertices[3*i] *= scaling[0];
      cyl.vertices[3*i+1] *= scaling[1];
      cyl.vertices[3*i+2] *= scaling[2];
    }
    // ROTATION
    var c = Math.cos(theta*Math.PI/180);
    var s = Math.sin(theta*Math.PI/180);
    var a11 = k[0]*k[0]*(1-c) + c;
    var a12 = k[0]*k[1]*(1-c) - k[2]*s;
    var a13 = k[0]*k[2]*(1-c) + k[1]*s;
    var a21 = k[0]*k[1]*(1-c) + k[2]*s;
    var a22 = k[1]*k[1]*(1-c) + c;
    var a23 = k[1]*k[2]*(1-c) - k[0]*s;
    var a31 = k[0]*k[2]*(1-c) - k[1]*s;
    var a32 = k[1]*k[2]*(1-c) + k[0]*s;
    var a33 = k[2]*k[2]*(1-c) + c;
    for (var i = 0; i < cyl.size; i++) {
      var nx = a11*cyl.vertices[3*i]+a21*cyl.vertices[3*i+1]+a31*cyl.vertices[3*i+2];
      var ny = a12*cyl.vertices[3*i]+a22*cyl.vertices[3*i+1]+a32*cyl.vertices[3*i+2];
      var nz = a13*cyl.vertices[3*i]+a23*cyl.vertices[3*i+1]+a33*cyl.vertices[3*i+2];
      cyl.vertices[3*i] = nx;
      cyl.vertices[3*i+1] = ny;
      cyl.vertices[3*i+2] = nz;
    }
    // TRANSLATION
    for (var i = 0; i < cyl.size; i++) {
      cyl.vertices[3*i] += position[0];
      cyl.vertices[3*i+1] += position[1];
      cyl.vertices[3*i+2] += position[2];
    }
    return cyl;
  }
  
  function loadElements(comps) {
    var vertices = [];
    var indices = [];
    var colors = [];
    var elements = [];
    var offset = 0;
    var totalVertices = 0;
    for (var i=0; i<comps.length; i++) {
      vertices = vertices.concat(comps[i].vertices);
      indices = indices.concat(comps[i].indices.map(n => n + totalVertices));
      totalVertices += comps[i].size;
      colors = colors.concat(comps[i].colors);
      elements.push({
        type: gl.TRIANGLE_FAN, 
        size: comps[i].N+2, 
        offset: offset});
      elements.push({
        type: gl.TRIANGLE_FAN, 
        size: comps[i].N+2, 
        offset: offset + 2*(comps[i].N+2)});
      elements.push({
        type: gl.TRIANGLE_STRIP, 
        size: 2*(comps[i].N+1), 
        offset: offset + 4*(comps[i].N+2)});
      offset += 2*(4*comps[i].N + 6);
    }
    
    // Create and store data into vertex buffer
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Associate position attribute to vertex shader
    var positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

    // Create and store data into color buffer
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    // Associate color attribute to vertex shader
    var color = gl.getAttribLocation(program, "color");
    gl.enableVertexAttribArray(color);
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);

    // Create and store data into index buffer
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    return elements;
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
  
  // Creamos los componentes de la bici
  // Llantas:
  var lWheel = makeComponent(50, [0.38,0.10,0.38], [1,0,0], 90, [-0.59,-0.21, 0.00], [0,0,0,1]);
  var lWheelRim = makeComponent(50, [0.28,0.10,0.28], [1,0,0], 90, [-0.59,-0.21, 0.00], [1,1,1,1]);
  var rWheel = makeComponent(50, [0.38,0.10,0.38], [1,0,0], 90, [ 0.61,-0.21, 0.00], [0,0,0,1]);
  var rWheelRim = makeComponent(50, [0.28,0.10,0.28], [1,0,0], 90, [ 0.61,-0.21, 0.00], [1,1,1,1]);
  // Marco:
  var barra1 = makeComponent(50, [0.03,0.51,0.03], [0,0,1], 20, [-0.48, 0.04, 0.08], [0,0,1,1]);
  var barra2 = makeComponent(50, [0.03,0.51,0.03], [0,0,1], 20, [-0.48, 0.04,-0.08], [0,0,1,1]);
  var barra3 = makeComponent(50, [0.03,0.23,0.03], [0,0,1], 24, [-0.34, 0.39, 0.00], [0,0,1,1]);
  var barra4 = makeComponent(50, [0.03,0.65,0.03], [0,0,1],106, [-0.02, 0.30, 0.00], [0,0,1,1]);
  var barra5 = makeComponent(50, [0.03,0.80,0.03], [0,0,1],143, [-0.11, 0.07, 0.00], [0,0,1,1]);
  var barra6 = makeComponent(50, [0.03,0.75,0.03], [0,0,1], 18, [ 0.26, 0.12, 0.00], [0,0,1,1]);
  var barra7 = makeComponent(50, [0.03,0.46,0.03], [0,0,1], 86, [ 0.38,-0.22, 0.08], [0,0,1,1]);
  var barra8 = makeComponent(50, [0.03,0.46,0.03], [0,0,1], 86, [ 0.38,-0.22,-0.08], [0,0,1,1]);
  var barra9 = makeComponent(50, [0.03,0.53,0.03], [0,0,1],143, [ 0.45, 0.00, 0.08], [0,0,1,1]);
  var barra10 = makeComponent(50,[0.03,0.53,0.03], [0,0,1],143, [ 0.45, 0.00,-0.08], [0,0,1,1]);
  var conex1 = makeComponent(50, [0.03,0.20,0.03], [1,0,0], 90, [-0.39, 0.28, 0.00], [0,0,1,1]);
  var conex2 = makeComponent(50, [0.03,0.20,0.03], [1,0,0], 90, [ 0.15,-0.24, 0.00], [0,0,1,1]);
  var conex3 = makeComponent(50, [0.03,0.20,0.03], [1,0,0], 90, [ 0.29, 0.21, 0.00], [0,0,1,1]);
  // Manubrio:
  var barra11 = makeComponent(50,[0.03,0.12,0.03], [0,0,1],-50, [-0.35, 0.51, 0.00], [0,0,1,1]);
  var conex4 = makeComponent(50, [0.03,0.4,0.03], [1,0,0], 90, [-0.40, 0.55, 0.00], [0,0,0,1]);
  var manI = makeComponent(50, [0.05,0.20,0.04], [1,0,0], 90, [-0.40, 0.55, 0.3], [1,0,0,1]);
  var manD = makeComponent(50, [0.05,0.20,0.04], [1,0,0], 90, [-0.40, 0.55,-0.3], [1,0,0,1]);
  // Silla:
  var silla = makeComponent(3, [0.2,0.08,0.15], [0,1,0], 180, [ 0.39, 0.50, 0.0], [0,1,0,1]);
  // Pedales:
  var polea = makeComponent(50, [0.08,0.02,0.08], [1,0,0], 90, [ 0.15,-0.24, 0.08], [0.5,0.5,0.5,1]);
  
  // Se agregan los componentes de la bici:
  var elements = loadElements([lWheel, lWheelRim, rWheel, rWheelRim,
    barra1, barra2, barra3, barra4, barra5, barra6, barra7, barra8, barra9, barra10,
    conex1, conex2, conex3,
    barra11, conex4, manI, manD,
    silla,
    polea]);
  
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
    
    //Draw the elements
    for (var i=0; i<elements.length; i++) {
      gl.drawElements(
        elements[i].type, 
        elements[i].size, 
        gl.UNSIGNED_SHORT, 
        elements[i].offset);
    }
    
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
