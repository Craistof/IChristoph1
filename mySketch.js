let cabeza;
let cuerpo;
let points = [];
let ditherSize = 5; // Tamaño de los puntos para el patrón de dithering
let attractionRadius = 100; // Radio de interacción con el mouse
let originalPositions = []; // Almacenará las posiciones originales de los puntos
let speed = 2; // Velocidad de los gusanos

function preload() {
  // Cargar las imágenes
  cabeza = loadImage('CABEZA2.png');
  cuerpo = loadImage('CUERPO.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('crimson'); // Fondo de la composición

  // Calcular las posiciones de los puntos del patrón de dithering en "CABEZA2.png"
  cabeza.loadPixels();
  let offsetX = (width - cabeza.width) / 2; // Centramos la imagen en X
  let offsetY = (height - cabeza.height) / 2; // Centramos la imagen en Y

  for (let y = 0; y < cabeza.height; y += ditherSize) {
    for (let x = 0; x < cabeza.width; x += ditherSize) {
      let index = (x + y * cabeza.width) * 4;
      let brightness = cabeza.pixels[index]; // Tomamos el valor de brillo de la imagen
      let pointX = x + offsetX;
      let pointY = y + offsetY;

      // Añadimos el punto solo si no es transparente y no es blanco
      if (cabeza.pixels[index + 3] > 128 && brightness < 250) { // Eliminamos blancos
        points.push({
          x: pointX,
          y: pointY,
          vx: 0,
          vy: 0,
          brightness: brightness,
          history: [] // Almacena la trayectoria para el efecto de gusano
        });
        originalPositions.push({ x: pointX, y: pointY }); // Guardamos posición original
      }
    }
  }
}

function draw() {
  background('d6c7b9'); // Fondo

  // Centramos y dibujamos el cuerpo en el centro de la pantalla
  image(cuerpo, (width - cuerpo.width) / 2, (height - cuerpo.height) / 2);

  // Centramos y dibujamos la cabeza
  image(cabeza, (width - cabeza.width) / 2, (height - cabeza.height) / 2);

  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    let original = originalPositions[i];

    // Detectar si el mouse está cerca del punto (interacción)
    let distance = dist(mouseX, mouseY, point.x, point.y);
    if (distance < attractionRadius) {
      // Movimiento de los puntos hacia el mouse, con efecto de gusano
      let angle = atan2(mouseY - point.y, mouseX - point.x);
      point.vx = cos(angle) * speed;
      point.vy = sin(angle) * speed;

      // Añadir el punto actual a la historia para crear la estela
      point.history.push({ x: point.x, y: point.y });

      // Limitar la longitud de la estela
      if (point.history.length > 10) {
        point.history.shift();
      }

      // Mover el punto siguiendo el mouse
      point.x += point.vx;
      point.y += point.vy;
    } else {
      // Los puntos vuelven lentamente a su posición original
      point.x = lerp(point.x, original.x, 0.05);
      point.y = lerp(point.y, original.y, 0.05);

      // Limpiar la historia cuando vuelve a su posición original
      if (point.history.length > 0) {
        point.history.shift();
      }
    }

    // Dibujar la estela del gusano (trayectoria)
    for (let j = 0; j < point.history.length; j++) {
      let pos = point.history[j];
      let col = 0; // Solo puntos oscuros, eliminamos el blanco
      fill(col, map(j, 0, point.history.length, 255, 50)); // Transparencia para el efecto de estela
      noStroke();
      ellipse(pos.x, pos.y, ditherSize, ditherSize);
    }

    // Dibujar puntos principales
    fill(0); // Solo puntos oscuros
    noStroke();
    ellipse(point.x, point.y, ditherSize, ditherSize);
  }
}
