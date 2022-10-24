var ThreeDeeMath = (function(){

// OPERACIONES PARA ANGULOS
var minDelta = function(a, b) {
  if (b < a) {
    return minDelta(b, a);
  }
  return Math.min(b-a, 360-(b-a));
};
var angle = function(t) {
  if (t > 180) {
    return t - 360;
  }
  if (t <= -180) {
    return t + 360;
  }
  return t;
};

// OPERACIONES PARA VECTORES
var suma = function(a, b) {
  return [b[0]+a[0], b[1]+a[1], b[2]+a[2]]
};
var delta = function(a, b) {
  return [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
};
var norm = function(a) {
  return Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
};
var dotP = function(a, b) {
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
};
var crossP = function(a, b) {
  return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-b[2]*a[0], a[0]*b[1]-a[1]*b[0]];
};
var proy = function(a, b) { //de a sobre b
  return b.map(e => dotP(a, b)/(norm(b)**2)*e);
};
// Dados 2 vectores unitarios (u, v), da la matriz de rotación para rotar de u hacia v:
var rotVectores = function(u, v) {
  var k = crossP(u, v);
  return rotEjeAngulo(k.map(e => e/norm(k)), norm(k), dotP(u, v));
};

// OPERACIONES PARA MATRICES
var inverse = function(m) {
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
};
/*
Esta función genera la matriz de transformación, dados:
  - escalamiento s [  Sx,    Sy,  Sz]
  - rotación     r [roll, pitch, yaw]
  - posición     p [   X,     Y,   Z]
  */
var srp_matrix = function(s, r, p) {
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
};
// Esta función halla la matriz de transformación para una linea, dados sus 2 extremos:
var srp_line = function(pt1, pt2) {
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
};
// Matriz de rotación 4x4 (traspuesta) dado eje k, sin(theta) y cos(theta):
var rotEjeAngulo = function(k, s, c) {
  return [
         k[0]*k[0]*(1-c)+c, k[0]*k[1]*(1-c)+k[2]*s, k[0]*k[2]*(1-c)-k[1]*s, 0,
    k[0]*k[1]*(1-c)-k[2]*s,      k[1]*k[1]*(1-c)+c, k[1]*k[2]*(1-c)+k[0]*s, 0,
    k[0]*k[2]*(1-c)+k[1]*s, k[1]*k[2]*(1-c)-k[0]*s,      k[2]*k[2]*(1-c)+c, 0,
                         0,                      0,                      0, 1
  ]
};
// Calcula la nueva orientación dadas la orientacion actual y un cambio en marco local:
var updateRPYFromDelta = function(RPY, dRPY) {
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
};

// OPERACIONES PARA TRIANGULOS
// Divide un triángulo en 2 triángulos rectos:
var splitInRights = function(pt1, pt2, pt3) {
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
};
// Esta función halla la matriz de transformación para un triángulo rectángulo:
var srp_triangle = function(pt1, pt2, pt3) {
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
};

return {
  minDelta: minDelta,
  angle: angle,
  suma: suma,
  delta: delta,
  norm: norm,
  dotP: dotP,
  crossP: crossP,
  proy: proy,
  rotVectores: rotVectores,
  inverse: inverse,
  srp_matrix: srp_matrix,
  srp_line: srp_line,
  rotEjeAngulo: rotEjeAngulo,
  updateRPYFromDelta: updateRPYFromDelta,
  splitInRights: splitInRights,
  srp_triangle: srp_triangle
};

})();
