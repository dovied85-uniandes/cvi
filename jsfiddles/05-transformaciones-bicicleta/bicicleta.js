"use strict";

var m = ThreeDMath;

var canvas = document.getElementById("c");
var gl = canvas.getContext("webgl");
if (!gl) {
  alert("no webgl");
}

var program = webglUtils.createProgramFromScripts(
  gl, ["2d-vertex-shader", "2d-fragment-shader"]);
gl.useProgram(program);

/*Ubicaciones de las uniforms en el shader*/
var colorLoc = gl.getUniformLocation(program, "vColor");
var matrixLoc = gl.getUniformLocation(program, "m_world");

/*--------------------FUNCIONES GEOMETRICAS (ANGULOS, MATRICES)-------------------*/
// MinDelta
function minDelta(a, b) {
  if (b < a) {
    return minDelta(b, a);
  }
  return Math.min(b-a, 360-(b-a));
}
// Limitar ángulo entre (-180, 180]:
function angle(t) {
  if (t > 180) {
    return t - 360;
  }
  if (t <= -180) {
    return t + 360;
  }
  return t;
}
// Inversa de una matriz 4x4: 
function inverse(m) {
  var tmp_0 = m[2*4+2] * m[3*4+3];
  var tmp_1 = m[3*4+2] * m[2*4+3];
  var tmp_2 = m[1*4+2] * m[3*4+3];
  var tmp_3 = m[3*4+2] * m[1*4+3];
  var tmp_4 = m[1*4+2] * m[2*4+3];
  var tmp_5 = m[2*4+2] * m[1*4+3];
  var tmp_6 = m[0*4+2] * m[3*4+3];
  var tmp_7 = m[3*4+2] * m[0*4+3];
  var tmp_8 = m[0*4+2] * m[2*4+3];
  var tmp_9 = m[2*4+2] * m[0*4+3];
  var tmp_10 = m[0*4+2] * m[1*4+3];
  var tmp_11 = m[1*4+2] * m[0*4+3];
  var tmp_12 = m[2*4+0] * m[3*4+1];
  var tmp_13 = m[3*4+0] * m[2*4+1];
  var tmp_14 = m[1*4+0] * m[3*4+1];
  var tmp_15 = m[3*4+0] * m[1*4+1];
  var tmp_16 = m[1*4+0] * m[2*4+1];
  var tmp_17 = m[2*4+0] * m[1*4+1];
  var tmp_18 = m[0*4+0] * m[3*4+1];
  var tmp_19 = m[3*4+0] * m[0*4+1];
  var tmp_20 = m[0*4+0] * m[2*4+1];
  var tmp_21 = m[2*4+0] * m[0*4+1];
  var tmp_22 = m[0*4+0] * m[1*4+1];
  var tmp_23 = m[1*4+0] * m[0*4+1];

  var t0 = (tmp_0 * m[1*4+1] + tmp_3 * m[2*4+1] + tmp_4 * m[3*4+1]) -
      (tmp_1 * m[1*4+1] + tmp_2 * m[2*4+1] + tmp_5 * m[3*4+1]);
  var t1 = (tmp_1 * m[0*4+1] + tmp_6 * m[2*4+1] + tmp_9 * m[3*4+1]) -
      (tmp_0 * m[0*4+1] + tmp_7 * m[2*4+1] + tmp_8 * m[3*4+1]);
  var t2 = (tmp_2 * m[0*4+1] + tmp_7 * m[1*4+1] + tmp_10 * m[3*4+1]) -
      (tmp_3 * m[0*4+1] + tmp_6 * m[1*4+1] + tmp_11 * m[3*4+1]);
  var t3 = (tmp_5 * m[0*4+1] + tmp_8 * m[1*4+1] + tmp_11 * m[2*4+1]) -
      (tmp_4 * m[0*4+1] + tmp_9 * m[1*4+1] + tmp_10 * m[2*4+1]);

  var d = 1.0 / (m[0*4+0] * t0 + m[1*4+0] * t1 + m[2*4+0] * t2 + m[3*4+0] * t3);

  return [d * t0, d * t1, d * t2, d * t3,
       d * ((tmp_1 * m[1*4+0] + tmp_2 * m[2*4+0] + tmp_5 * m[3*4+0]) -
          (tmp_0 * m[1*4+0] + tmp_3 * m[2*4+0] + tmp_4 * m[3*4+0])),
       d * ((tmp_0 * m[0*4+0] + tmp_7 * m[2*4+0] + tmp_8 * m[3*4+0]) -
          (tmp_1 * m[0*4+0] + tmp_6 * m[2*4+0] + tmp_9 * m[3*4+0])),
       d * ((tmp_3 * m[0*4+0] + tmp_6 * m[1*4+0] + tmp_11 * m[3*4+0]) -
          (tmp_2 * m[0*4+0] + tmp_7 * m[1*4+0] + tmp_10 * m[3*4+0])),
       d * ((tmp_4 * m[0*4+0] + tmp_9 * m[1*4+0] + tmp_10 * m[2*4+0]) -
          (tmp_5 * m[0*4+0] + tmp_8 * m[1*4+0] + tmp_11 * m[2*4+0])),
       d * ((tmp_12 * m[1*4+3] + tmp_15 * m[2*4+3] + tmp_16 * m[3*4+3]) -
          (tmp_13 * m[1*4+3] + tmp_14 * m[2*4+3] + tmp_17 * m[3*4+3])),
       d * ((tmp_13 * m[0*4+3] + tmp_18 * m[2*4+3] + tmp_21 * m[3*4+3]) -
          (tmp_12 * m[0*4+3] + tmp_19 * m[2*4+3] + tmp_20 * m[3*4+3])),
       d * ((tmp_14 * m[0*4+3] + tmp_19 * m[1*4+3] + tmp_22 * m[3*4+3]) -
          (tmp_15 * m[0*4+3] + tmp_18 * m[1*4+3] + tmp_23 * m[3*4+3])),
       d * ((tmp_17 * m[0*4+3] + tmp_20 * m[1*4+3] + tmp_23 * m[2*4+3]) -
          (tmp_16 * m[0*4+3] + tmp_21 * m[1*4+3] + tmp_22 * m[2*4+3])),
       d * ((tmp_14 * m[2*4+2] + tmp_17 * m[3*4+2] + tmp_13 * m[1*4+2]) -
          (tmp_16 * m[3*4+2] + tmp_12 * m[1*4+2] + tmp_15 * m[2*4+2])),
       d * ((tmp_20 * m[3*4+2] + tmp_12 * m[0*4+2] + tmp_19 * m[2*4+2]) -
          (tmp_18 * m[2*4+2] + tmp_21 * m[3*4+2] + tmp_13 * m[0*4+2])),
       d * ((tmp_18 * m[1*4+2] + tmp_23 * m[3*4+2] + tmp_15 * m[0*4+2]) -
          (tmp_22 * m[3*4+2] + tmp_14 * m[0*4+2] + tmp_19 * m[1*4+2])),
       d * ((tmp_22 * m[2*4+2] + tmp_16 * m[0*4+2] + tmp_21 * m[1*4+2]) -
          (tmp_20 * m[1*4+2] + tmp_23 * m[2*4+2] + tmp_17 * m[0*4+2]))];
}
/*Esta función genera la matriz de transformación (ya transpuesta), dados:
  - escalamiento s [  Sx,    Sy,  Sz]
  - rotación     r [roll, pitch, yaw]
  - posición     p [   X,     Y,   Z]*/
function srp2matrix(s, r, p) {
  var cx = Math.cos(r[0]*Math.PI/180);
  var sx = Math.sin(r[0]*Math.PI/180);
  var cz = Math.cos(r[1]*Math.PI/180);
  var sz = Math.sin(r[1]*Math.PI/180);
  var cy = Math.cos(r[2]*Math.PI/180);
  var sy = Math.sin(r[2]*Math.PI/180);
  var r11 = cy*cz;
  var r12 = -sz;
  var r13 = sy*cz;
  var r21 = cx*cy*sz + sx*sy
  var r22 = cx*cz;
  var r23 = cx*sy*sz - sx*cy;
  var r31 = sx*cy*sz - cx*sy;
  var r32 = sx*cz;
  var r33 = sx*sy*sz + cx*cy;
  return [
    s[0]*r11, s[0]*r21, s[0]*r31, 0,
    s[1]*r12, s[1]*r22, s[1]*r32, 0,
    s[2]*r13, s[2]*r23, s[2]*r33, 0,
        p[0],     p[1],     p[2], 1
  ];
}
// Calcula la nueva orientación dadas la orientacion actual y un cambio en marco local:
function updateRPYFromDelta(RPY, dRPY) {
  var  R = srp2matrix([1,1,1],  RPY, [0,0,0]);
  var dR = srp2matrix([1,1,1], dRPY, [0,0,0]);
  var  M = m.multiplyMatrix(dR, R);
  var sz = -M[4];
  if (sz ==  1) {
    return [angle(RPY[2] - Math.atan2(-M[2],M[1])),  90, RPY[2]];
  }
  if (sz == -1) {
    return [angle(Math.atan2(-M[2],M[1]) - RPY[2]), -90, RPY[2]];
  }
  // 2 casos para el nuevo pitch: coseno + y coseno -
  var z1 = Math.atan2(sz, Math.sqrt(1 - sz**2))*180/Math.PI;
  var z2 = Math.atan2(sz,-Math.sqrt(1 - sz**2))*180/Math.PI;
  var newPitch = minDelta(RPY[1], z1) < minDelta(RPY[1], z2) ? z1 : z2;
  var cz = Math.cos(newPitch*Math.PI/180);
  var newRoll = Math.atan2(M[6]/cz,M[5]/cz)*180/Math.PI;
  var newYaw  = Math.atan2(M[8]/cz,M[0]/cz)*180/Math.PI;
  return [newRoll, newPitch, newYaw];
}
/*-------------------------------------------------------------------------------*/

/*---------------------------DEFINICION DE PRIMITIVAS----------------------------*/
//Polígono 2D de N lados, en el plano xz, de radio 1.
function createNPolygon(N) {
  var vertices = [0, 0, 0];
  var indices = [0];
  for (var i = 0; i <= N; i++) {
    var theta = 2*Math.PI*i/N;
    vertices.push(Math.cos(theta), 0, Math.sin(theta));
    indices.push(i+1);
  }
  return { type: gl.TRIANGLE_FAN, vertices: vertices, indices: indices };
}
//Cara circular del polígono 2D de N lados, de radio 1 y altura 1.
function createNPolygonFace(N) {
  var vertices = [];
  var indices = [];
  for (var i = 0; i <= N; i++) {
    var theta = 2*Math.PI*i/N;
    vertices.push(Math.cos(theta), 0.5, Math.sin(theta),
                  Math.cos(theta),-0.5, Math.sin(theta),);
    indices.push(2*i,2*i+1);
  }
  return {
    type: gl.TRIANGLE_STRIP,
    vertices: vertices,
    indices: indices
  };
}
/*-------------------------------------------------------------------------------*/

/*----------------FUNCIONES PARA MANIPULAR LA ESTRUCTURA DE DATOS----------------*/
// Crear una hoja del árbol, con tamaño, orientación, posición y color deseado:
function createLeaf(primitive, s, r, p, color) {
  return {
    scaling: s,
    rotation: r,
    position: p,
    mLocal: srp2matrix(s, r, p),
    mGlobal: srp2matrix(s, r, p),
    primitive: primitive,
    color: color
  };
}
// Pintar la primitiva (hoja del árbol):
function drawLeaf(leaf) {
  // Load color data
  gl.uniform4fv(colorLoc, leaf.color);
  // Load matrix data
  gl.uniformMatrix4fv(matrixLoc, false, leaf.mGlobal);
  // Draw element
  gl.drawElements(
    leaf.primitive.type, 
    leaf.primitive.indices.length, 
    gl.UNSIGNED_SHORT, 
    leaf.offset
  );
}
// Crear un nodo (no hoja) del árbol, con tamaño, orientación y posición deseadas:
function createElement(children, s, r, p) {
  var element = {
    scaling: s,
    rotation: r,
    position: p,
    mLocal: srp2matrix(s, r, p),
    mGlobal: srp2matrix(s, r, p),
    children: children
  }
  updateChildrenGlobalMatrices(element);
  return element;
}
// Pintar el elemento:
function drawNode(node) {
  if (node.hasOwnProperty('children')) {
    node.children.forEach(function (child, index) {
      drawNode(child);
    });
  }
  else {
    drawLeaf(node);
  }
}
// Esta función actualiza las matrices globales de los hijos de un elemento
function updateChildrenGlobalMatrices(node) {
  if (node.hasOwnProperty('children')) {
    node.children.forEach(function (child, index) {
      // Se quiere C^T = (A*B)^T = (B^T)*(A^T)
      child.mGlobal = m.multiplyMatrix(child.mLocal, node.mGlobal);
      updateChildrenGlobalMatrices(child);
    });
  }
}
// Actualiza la matriz global del elemento y sus hijos, dadas unas nuevas s,r y p:
function updateGlobalMatrices(node, new_s, new_r, new_p) {
  node.scaling = new_s;
  node.rotation = new_r;
  node.translation = new_p;
  var newM = srp2matrix(new_s, new_r, new_p);
  // Se multiplica por la inversa para cancelar la anterior, y luego por la nueva
  node.mGlobal = m.multiplyMatrix(
    newM, m.multiplyMatrix(inverse(node.mLocal), node.mGlobal)
  );
  node.mLocal = newM;
  updateChildrenGlobalMatrices(node);
}
// Actualiza la matriz global del elemento y sus hijos, dado un nuevo s, r o p:
// param debe ser "scaling", "rotation" o "position"
function updateGlobalParameter(node, param, new_value) {
  param == "scaling" ? node.scaling = new_value : 
  (param == "rotation" ? node.rotation = new_value : node.position = new_value);
  var newM = srp2matrix(node.scaling, node.rotation, node.position);
  // Se multiplica por la inversa para cancelar la anterior, y luego por la nueva
  node.mGlobal = m.multiplyMatrix(
    newM, m.multiplyMatrix(inverse(node.mLocal), node.mGlobal)
  );
  node.mLocal = newM;
  updateChildrenGlobalMatrices(node);
}
// Actualiza la posición del elemento agregando desplazamiento en marco local:
function addLocalDeltaPos(node, deltaP) {
  node.position.forEach(function (p, idx) {
    node.position[idx] += 
      deltaP[0]*node.mLocal[idx+0]+
      deltaP[1]*node.mLocal[idx+4]+
      deltaP[2]*node.mLocal[idx+8];
  });
  updateGlobalParameter(node, "position", node.position);
}
// Actualiza la orientación del elemento agregando un giro en marco local:
function addLocalDeltaAngle(node, deltaAngle, axis) {
  if (axis == "yaw") {
    node.rotation[2] += deltaAngle;
  }
  else if (axis == "roll") {
    node.rotation = updateRPYFromDelta(node.rotation, [deltaAngle, 0, 0]);
  }
  else if (axis == "pitch") {
    node.rotation = updateRPYFromDelta(node.rotation, [0, deltaAngle, 0]);
  }
  updateGlobalParameter(node, "rotation", node.rotation);
}
// Esta funcion carga el componente en el buffer y genera el offset para cada hoja:
function loadComponent(component) {
  var vertices = [];
  var indices = [];
  var totalVertices = 0;

  function loadLeaves(node) {
    if (node.hasOwnProperty('primitive')) {
      vertices = vertices.concat(node.primitive.vertices);
      node.offset = 2 * indices.length; // el 2 es por el tamaño en bytes del int16
      indices = indices.concat(node.primitive.indices.map(n => n + totalVertices));
      totalVertices += node.primitive.vertices.length / 3;
    }
    else {
      node.children.forEach(function (child, index) { loadLeaves(child); });
    }
  }
  loadLeaves(component);

  // Create and store data into vertex buffer
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  // Associate position attribute to vertex shader
  var positionLoc = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

  // Create and store data into index buffer
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}
/*-------------------------------------------------------------------------------*/

/*-----------------------------DEFINICION DE ELEMENTOS-------------------------------
Ahora que podemos crear y pintar primitivas, comenzamos a crear elementos con ellas*/
//Cilindro, cuyas dimensiones estándar (s=[1,1,1], r=[0,0,0], p=[0,0,0]) son:
//Altura: 1, Radio: 1, Eje principal: y, Origen: centro del cilindro
function createNCylinder(N, s, r, p, color) {
  var a = 0;
  // Si es un cuadrado (N=4) lo giramos 45° (para que los lados se alinien con ejes x,z)
  if (N == 4) {
    a = 45;
  }
  var cylinder = {
    scaling: s,
    rotation: r,
    position: p,
    mLocal: srp2matrix(s, r, p),
    mGlobal: srp2matrix(s, r, p),
    children: [
      //tapa superior
      createLeaf(    createNPolygon(N), [1,1,1], [0,0,a], [0, 0.5,0], color),
      //tapa inferior
      createLeaf(    createNPolygon(N), [1,1,1], [0,0,a], [0,-0.5,0], color),
      //cuerpo
      createLeaf(createNPolygonFace(N), [1,1,1], [0,0,a],    [0,0,0], color)  
    ]
  };
  updateChildrenGlobalMatrices(cylinder);
  return cylinder;
}

//Conjunto engranaje-pedales de la bici:
var myPedals = createElement([
  //eje:
  createNCylinder(50,[0.12,0.85,0.12],[90,0,0],[0, 0.0, 0.00],[0.00,0.00,0.00,1]),
  //engranaje cadena:
  createNCylinder(50,[0.45,0.05,0.45],[90,0,0],[0, 0.0, 0.20],[0.70,0.70,0.70,1]),
  // bielas:
  createNCylinder(50,[0.10,1.00,0.10],[ 0,0,0],[0, 0.4, 0.45],[0.00,0.00,0.00,1]),
  createNCylinder(50,[0.10,1.00,0.10],[ 0,0,0],[0,-0.4,-0.45],[0.00,0.00,0.00,1]),
  // pedales:
  createNCylinder( 4,[0.28,0.20,0.35],[ 0,0,0],[0, 0.8, 0.65],[0.95,0.60,0.05,1]),
  createNCylinder( 4,[0.28,0.20,0.35],[ 0,0,0],[0,-0.8,-0.65],[0.95,0.60,0.05,1])], 
  // S-R-P:
  [0.25,0.25,0.25], [0,0,0], [-0.15,-0.24,0]);
  
//Bici completa:
var myBike = createElement([
  // Llanta der:
  createNCylinder(50,[0.38,0.10,0.38], [90, 0,0], [ 0.59,-0.21, 0.00], [0,0,0,1]),
  createNCylinder(50,[0.30,0.10,0.30], [90, 0,0], [ 0.59,-0.21, 0.00], [1,1,1,1]),
  // Llanta izq:
  createNCylinder(50,[0.38,0.10,0.38], [90, 0,0], [-0.61,-0.21, 0.00], [0,0,0,1]),
  createNCylinder(50,[0.30,0.10,0.30], [90, 0,0], [-0.61,-0.21, 0.00], [1,1,1,1]),
  // Marco:
  createNCylinder(50,[0.03,0.51,0.03], [0, 20,0], [ 0.48, 0.04, 0.08], [0,0,1,1]),
  createNCylinder(50,[0.03,0.51,0.03], [0, 20,0], [ 0.48, 0.04,-0.08], [0,0,1,1]),
  createNCylinder(50,[0.03,0.23,0.03], [0, 24,0], [ 0.34, 0.39, 0.00], [0,0,1,1]),
  createNCylinder(50,[0.03,0.65,0.03], [0,106,0], [ 0.02, 0.30, 0.00], [0,0,1,1]),
  createNCylinder(50,[0.03,0.80,0.03], [0,143,0], [ 0.11, 0.07, 0.00], [0,0,1,1]),
  createNCylinder(50,[0.03,0.75,0.03], [0, 18,0], [-0.26, 0.12, 0.00], [0,0,1,1]),
  createNCylinder(50,[0.03,0.46,0.03], [0, 86,0], [-0.38,-0.22, 0.08], [0,0,1,1]),
  createNCylinder(50,[0.03,0.46,0.03], [0, 86,0], [-0.38,-0.22,-0.08], [0,0,1,1]),
  createNCylinder(50,[0.03,0.53,0.03], [0,143,0], [-0.45, 0.00, 0.08], [0,0,1,1]),
  createNCylinder(50,[0.03,0.53,0.03], [0,143,0], [-0.45, 0.00,-0.08], [0,0,1,1]),
  createNCylinder(50,[0.03,0.20,0.03], [90, 0,0], [ 0.39, 0.28, 0.00], [0,0,1,1]),
  createNCylinder(50,[0.03,0.20,0.03], [90, 0,0], [-0.15,-0.24, 0.00], [0,0,1,1]),
  createNCylinder(50,[0.03,0.20,0.03], [90, 0,0], [-0.29, 0.21, 0.00], [0,0,1,1]),
  // Manubrio:
  createNCylinder(50,[0.03,0.12,0.03], [0,-50,0], [ 0.35, 0.51, 0.00], [0,0,1,1]),
  createNCylinder(50,[0.03,0.40,0.03], [90, 0,0], [ 0.40, 0.55, 0.00], [0,0,0,1]),
  createNCylinder(50,[0.05,0.20,0.04], [90, 0,0], [ 0.40, 0.55, 0.30], [1,0,0,1]),
  createNCylinder(50,[0.05,0.20,0.04], [90, 0,0], [ 0.40, 0.55,-0.30], [1,0,0,1]),
  // Silla:
  createNCylinder(3, [0.20,0.08,0.15], [ 0, 0,0], [-0.39, 0.50, 0.00], [0,1,0,1]),
  // Pedales:
  myPedals], 
  // S-R-P:
  [1,1,1], [0,0,0], [0,0,0]);
/*-------------------------------------------------------------------------------*/

/*----------------------------------USER INPUTS----------------------------------*/
var rpy = [0,0,0]
var scale = 1;
var pos = [0,0,0];
webglLessonsUI.setupSlider("#X", { slide: updatePos(0), min: -200, max: 200 });
webglLessonsUI.setupSlider("#Y", { slide: updatePos(1), min: -200, max: 200 });
webglLessonsUI.setupSlider("#Z", { slide: updatePos(2), min: -200, max: 200 });
webglLessonsUI.setupSlider("#roll",  { slide: updateRPY(0), min: -180, max: 180 });
webglLessonsUI.setupSlider("#pitch", { slide: updateRPY(1), min: -180, max: 180 });
webglLessonsUI.setupSlider("#yaw",   { slide: updateRPY(2), min: -180, max: 180 });
webglLessonsUI.setupSlider("#scale", { value: 100*scale, slide: updateScale(), min: 10, max: 250 });
function updatePos(idx) {
  return function(event, ui) {
    pos[idx] = ui.value/100;
    updateGlobalParameter(myBike, "position", pos);
  }
}
function updateRPY(idx) {
  return function(event, ui) {
    rpy[idx] = ui.value;
    updateGlobalParameter(myBike, "rotation", rpy);
  }
}
function updateScale() {
  return function(event, ui) {
    scale = ui.value/100;
    updateGlobalParameter(myBike, "scaling", [scale, scale, scale]);
  }
}
/*-------------------------------------------------------------------------------*/

/*-------------------------------------MAIN--------------------------------------*/
function main() {
  
  // Cargamos la bici en el buffer:
  loadComponent(myBike);
  
  // Render loop:
  var pitch_ped = 0;
  function render(clock) {
    clock *= 0.001;
    webglUtils.resizeCanvasToDisplaySize(gl.canvas, window.devicePixelRatio);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(1.0);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /*---------ANIMACION----------*/
    // ángulo de los pedales:
    pitch_ped = angle(pitch_ped + 2);
    // Animamos el eje de los pedales:
    updateGlobalMatrices(
      myBike.children[22], [0.25,0.25,0.25], [0,-pitch_ped,0], [-0.15,-0.24,0]
    );
    // Animamos los 2 pedales en sentido contrario para que queden quietos relativos al piso:
    updateGlobalMatrices(
      myBike.children[22].children[4], [0.28,0.2,0.35], [0,pitch_ped,0], [0, 0.8, 0.65]
    );
    updateGlobalMatrices(
      myBike.children[22].children[5], [0.28,0.2,0.35], [0,pitch_ped,0], [0,-0.8,-0.65]
    );
    /*----------------------------*/
       
    /*-----------CAMERA-----------*/
    var fieldOfView = Math.PI * 0.25;
    var aspect = canvas.clientWidth / canvas.clientHeight;
    var projection = m.perspective(fieldOfView, aspect, 0.0001, 500);
    var radius = 5;
    var eye = [
        Math.sin(0) * radius,
        1,
        Math.cos(0) * radius,
    ];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var view = m.lookAt(eye, target, up);

    var worldViewProjLoc = gl.getUniformLocation(program, "u_worldViewProjection");
    var worldViewProj = m.multiplyMatrix(view, projection);
    gl.uniformMatrix4fv(worldViewProjLoc, false, worldViewProj);
    /*----------------------------*/

    drawNode(myBike);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
  
}

main();