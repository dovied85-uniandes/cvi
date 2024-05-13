"use strict";

var m = ThreeDMath;
var imageUrl_0 = "https://raw.githubusercontent.com/dovied85-uniandes/cvi/main/textura_cara.jpg";
var imageUrl_1 = "https://raw.githubusercontent.com/dovied85-uniandes/cvi/main/textura_tapas.jpg";

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // textura de un solo texel azul
  gl.texImage2D(gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  const image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

// Operaciones con vectores:
function suma(a, b) {
  return [b[0]+a[0], b[1]+a[1], b[2]+a[2]]
}
function delta(a, b) {
  return [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
}
function norm(a) {
  return Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
}
function dotP(a, b) {
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}
function crossP(a, b) {
  return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-b[2]*a[0], a[0]*b[1]-a[1]*b[0]];
}
function proy(a, b) { //de a sobre b
  return b.map(e => dotP(a, b)/(norm(b)**2)*e);
}

// Matriz de rotación 4x4 (traspuesta) dado eje k, sin(theta) y cos(theta):
function rotEjeAngulo(k, s, c) {
  return [
         k[0]*k[0]*(1-c)+c, k[0]*k[1]*(1-c)+k[2]*s, k[0]*k[2]*(1-c)-k[1]*s, 0,
    k[0]*k[1]*(1-c)-k[2]*s,      k[1]*k[1]*(1-c)+c, k[1]*k[2]*(1-c)+k[0]*s, 0,
    k[0]*k[2]*(1-c)+k[1]*s, k[1]*k[2]*(1-c)-k[0]*s,      k[2]*k[2]*(1-c)+c, 0,
                         0,                      0,                      0, 1
  ]
}
// Dados 2 vectores unitarios (u, v), da la matriz de rotación para rotar de u hacia v:
function rotVectores(u, v) {
  var k = crossP(u, v);
  return rotEjeAngulo(k.map(e => e/norm(k)), norm(k), dotP(u, v));
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

/*
Esta función genera la matriz de transformación, dados:
  - escalamiento s [  Sx,    Sy,  Sz]
  - rotación     r [roll, pitch, yaw]
  - posición     p [   X,     Y,   Z]
  */
function srp_matrix(s, r, p) {
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

// Esta función halla la matriz de transformación para una linea, dados sus 2 extremos:
function srp_line(pt1, pt2) {
  var x = pt2[0] - pt1[0];
  var y = pt2[1] - pt1[1];
  var z = pt2[2] - pt1[2];
  var size = Math.sqrt(x*x + y*y + z*z);
  var sz =                    y / size; 
  var cz = Math.sqrt(x*x + z*z) / size;
  var sy = z / Math.sqrt(x*x + z*z);
  var cy = x / Math.sqrt(x*x + z*z);
  return [
             size*cz*cy,             size*sz,          size*cz*sy, 0,
            -size*sz*cy,             size*cz,         -size*sz*sy, 0,
               -size*sy,                   0,                  cy, 0,
    (pt1[0] + pt2[0])/2, (pt1[1] + pt2[1])/2, (pt1[2] + pt2[2])/2, 1
  ];
}

// Divide un triángulo en 2 triángulos rectos:
function splitInRights(pt1, pt2, pt3) {
  function split(p1,p2,p3,u_,v_,w_) {
    return [[p1, p2, delta(proy(u_, v_), p2)], [p1, p3, suma(p3, proy(w_, v_))]]
  }
  var u = delta(pt1, pt2);
  var v = delta(pt2, pt3);
  var w = delta(pt3, pt1);
  var a = norm(u);
  var b = norm(v);
  var c = norm(w);
  var max = Math.max(a, b, c);
  if (max == b) {
    return split(pt1, pt2, pt3, u, v, w);
  }
  else if (max == c) {
    return split(pt2, pt3, pt1, v, w, u);
  }
  else {
    return split(pt3, pt1, pt2, w, u, v);
  }
}

// Esta función halla la matriz de transformación para un triángulo rectángulo:
// Versión vieja /187 (solo servía para triángulos agudos)
function srp_triangle(pt1, pt2, pt3) {
  var u = delta(pt1, pt2);
  var v = delta(pt2, pt3);
  var w = delta(pt3, pt1);
  var a = norm(u);
  var b = norm(v);
  var c = norm(w);
  u = u.map(e => e/a);
  v = v.map(e => e/b);
  var n1 = [0,0,-1];
  var n2 = crossP(u, v);
  n2 = n2.map(e => e/norm(n2));
  var R1 = rotVectores(n1, n2);
  var R2 = rotVectores(m.transformPoint(R1, [-1,0,0]), v);
  var RT = m.multiplyMatrix(R1, R2);
  var  t = delta(m.transformPoint(RT, [0,c,0]), pt1);
  return [b*RT[0], b*RT[1],  b*RT[2], 0,
          c*RT[4], c*RT[5],  c*RT[6], 0,
            RT[8],   RT[9],   RT[10], 0,
             t[0],    t[1],     t[2], 1];
}

function main() {
  
  var canvas = document.getElementById("c");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    alert("no webgl");
    return;
  }
  
  const program = webglUtils.createProgramFromScripts(
      gl, ["2d-vertex-shader", "2d-fragment-shader"]);
  gl.useProgram(program);
  // Shader program locations:
  const positionLoc = gl.getAttribLocation(program, "a_position");
  const textureLoc = gl.getAttribLocation(program, "a_textureCoord");
  const samplerLoc = gl.getUniformLocation(program, "uSampler");
  const worldViewProjectionLoc = gl.getUniformLocation(program, "u_worldViewProj");
  const matrixLoc = gl.getUniformLocation(program, "u_modelView");
    
  
  //-------FUNCIONES PARA MANIPULAR LA ESTRUCTURA DE DATOS-------
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
  function updateGlobalMatrices(node, new_srp) {
    //var newM = srp_matrix(new_s, new_r, new_p);
    // Se multiplica por la inversa para cancelar la anterior, y luego por la nueva
    node.mGlobal = m.multiplyMatrix(
      new_srp, m.multiplyMatrix(inverse(node.mLocal), node.mGlobal)
    );
    node.mLocal = new_srp;
    updateChildrenGlobalMatrices(node);
  }
  
  // Esta funcion carga el componente en el buffer y genera el offset para cada hoja:
  function loadComponent(component) {
    var vertices = [];
    var indices = [];
    var textures = [];
    
    function loadLeaves(node) {
      if (node.hasOwnProperty('primitive')) {
        node.offset = 2 * indices.length; // el 2 es por el tamaño en bytes del int16
        indices  =  indices.concat(node.primitive.indices.map(n=>n+vertices.length/3));
        vertices = vertices.concat(node.primitive.vertices);
        textures = textures.concat(node.primitive.textures);
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
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    
    // Create and store data into texture buffer
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textures), gl.STATIC_DRAW);
    // Associate texture coordinates attribute to vertex shader
    gl.vertexAttribPointer(textureLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(textureLoc);
    
    // Create and store data into index buffer
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  }
  
  
  /*
  -------PRIMITIVAS-------
  Definimos las 5 primitivas que usaremos para construir todos los elementos:
  - Polígono 2D de N lados, en el plano xz, de radio 1.
  - Cara 3D del polígono de N lados, de altura 1 y radio 1.
  - Linea sobre el eje x de magnitud 1 centrada en 0,0
  - Esfera de radio 1, de 2N lados por circunferencia
  - Triángulo x+y+z=1 (con x,y,z > 0)
  */
  function createNPolygon(N) {
    var vertices = [0, 0, 0];
    var indices = [0];
    var textures = [0.5, 0.5]; //centro de la imagen
    for (var i = 0; i <= N; i++) {
      var theta = 2*Math.PI*i/N;
      vertices.push(Math.cos(theta), 0, Math.sin(theta));
      textures.push(0.5 + 0.5*Math.cos(theta), 0.5 + 0.5*Math.sin(theta));
      indices.push(i+1);
    }
    return {
      type: gl.TRIANGLE_FAN,
      vertices: vertices,
      indices: indices,
      textures: textures
    };
  }
  
  function createNPolygonFace(N) {
    var vertices = [];
    var indices = [];
    var textures = [];
    for (var i = 0; i <= N; i++) {
      var theta = 2*Math.PI*i/N;
      vertices.push(Math.cos(theta), 0.5, Math.sin(theta),
                    Math.cos(theta),-0.5, Math.sin(theta),);
      indices.push(2*i,2*i+1);
      textures.push(i/N,0,i/N,1);
    }
    return {
      type: gl.TRIANGLE_STRIP,
      vertices: vertices,
      indices: indices,
      textures: textures
    };
  }
  
  function createLine() {
    var vertices = [-0.5,0,0,0.5,0,0];
    var indices = [0,1];
    return {
      type: gl.LINES,
      vertices: vertices,
      indices: indices
    };
  }
  
  function createNSphere(N) {
    var vertices = [0, 1, 0];
    var indices = [];

    // solo si len(a) = 1 o len(a) == len(b)
    function createStrip(a, b) {
      for (var i = 0; i < b.length-1; i++) {
        if (a.length == 1) {
          indices.push(a[0], b[i], b[i+1]);
        }
        else {
          indices.push(a[i], b[i], b[i+1], a[i], b[i+1], a[i+1]);
        }
      }
      if (a.length == 1) {
        indices.push(a[0], b[i], b[0]);
      }
      else {
        indices.push(a[i], b[i], b[0], a[i], b[0], a[0]);
      }
    }

    var arr1 = [0];
    var cnt = 1;
    for (var i = 1; i <= N-1; i++) {
      var phi = (1/2 - i/N)*Math.PI;
      var arr2 = [];
      for (var j = 0; j < 2*N; j++) {
        var theta = (j/N)*Math.PI;
        var x = Math.cos(phi)*Math.cos(theta);
        var y = Math.sin(phi);
        var z = Math.cos(phi)*Math.sin(theta);
        vertices.push(x, y, z);
        arr2.push(cnt);
        cnt += 1;
      }
      createStrip(arr1, arr2);
      arr1 = [...arr2];
    }
    vertices.push(0, -1, 0);
    createStrip([cnt], arr1);
    return {
      type: gl.TRIANGLES,
      vertices: vertices,
      indices: indices
    };
  }
  
  function createRightTriangle() {
    var vertices = [0,1,0,1,0,0,0,0,0];
    var indices = [0,1,2];
    return {
      type: gl.TRIANGLES,
      vertices: vertices,
      indices: indices
    };
  }
  
  // Con esta función instanciamos la primitiva de tamaño, orientación y posición deseada
  // Esta vez, en vez de color pasamos una dirección de una imagen
  function createLeaf(primitive, s, r, p, imageNo) {
    return {
      mLocal: srp_matrix(s, r, p),
      mGlobal: srp_matrix(s, r, p),
      primitive: primitive,
      texture: imageNo
    };
  }
  
  // Finalmente, definimos la función para pintar la primitiva:
  function drawLeaf(leaf) {
    // Load texture data
    gl.uniform1i(samplerLoc, leaf.texture);
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
  
  /*
  -------ELEMENTOS-------
  Ahora que podemos crear y pintar primitivas, comenzamos a crear elementos con ellas.
  
  
  Cilindro, cuyas dimensiones estándar (s=[1,1,1], r=[0,0,0], p=[0,0,0]) son:
  - Altura: 1
  - Radio: 1
  - Eje principal: y
  - Origen: centro del cilindro
  */
  function createNCylinder(N, s, r, p, imageNo) {
    var a = 0;
    // Si es un cuadrado (N=4) lo giramos 45° (para que los lados se alinien con ejes x,z)
    if (N == 4) {
      a = 45;
    }
    var cylinder = {
      mLocal: srp_matrix(s, r, p),
      mGlobal: srp_matrix(s, r, p),
      children: [
         //tapa superior:
         createLeaf(    createNPolygon(N), [1,1,1], [0,0,a], [0, 0.5,0], imageNo),
         //tapa inferior:
         createLeaf(    createNPolygon(N), [1,1,1], [0,0,a], [0,-0.5,0], imageNo),
         //cuerpo:
         createLeaf(createNPolygonFace(N), [1,1,1], [0,0,a],    [0,0,0], imageNo)
      ]
    };
    updateChildrenGlobalMatrices(cylinder);
    return cylinder;
  }
  
  // Nodo genérico:
  function createElement(s,r,p,children) {
    var element = {
      mLocal: srp_matrix(s, r, p),
      mGlobal: srp_matrix(s, r, p),
      children: children
    }
    updateChildrenGlobalMatrices(element);
    return element;
  }
  
  // Finalmente, definimos la función para pintar los elementos:
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
  
  // Instanciamos la escena y la cargamos en el buffer:
  var myCylinder1 = createNCylinder(50, [1,1,1], [0,0,0], [-1.2,0,0], 0);
  var myCylinder2 = createNCylinder(50, [1,1,1], [0,0,0], [ 1.2,0,0], 1);
  var scene = createElement([1,1,1], [0,0,0], [0,0,0], [myCylinder1, myCylinder2]);
  loadComponent(scene);
  
  // Cargamos la(s) textura(s) que vamos a usar en la escena (máximo 8):
  const texture0 = loadTexture(gl, imageUrl_0);
  const texture1 = loadTexture(gl, imageUrl_1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture0);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  
  function render(clock) {
    clock *= 0.001;

    webglUtils.resizeCanvasToDisplaySize(gl.canvas, window.devicePixelRatio);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); //setea el clearing color (luego se llama a clear())
    gl.clearDepth(1.0);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var fieldOfViewY = Math.PI * 0.25;
    var aspect = canvas.clientWidth / canvas.clientHeight;
    var near = 0.0001;
    var far = 500;
    var projection = m.perspective(fieldOfViewY, aspect, near, far);
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
    
    // camara:
    gl.uniformMatrix4fv(worldViewProjectionLoc, false, worldViewProjection);

    drawNode(scene);
    requestAnimationFrame(render);
  }
  
  // -------------DIBUJAR--------------
  requestAnimationFrame(render);
  
}

main();