// index.js

// Importa módulos
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');
const picoColors = require('picocolors');

// Carga variables de entorno desde el archivo .env
dotenv.config();

// Ruta del directorio de la aplicación
const appDirectory = process.cwd();

// Función para leer el contenido de un directorio
async function listarDirectorio(ruta) {
  try {
    const archivos = await fs.readdir(ruta);
    return archivos;
  } catch (error) {
    throw new Error(`Error al leer el directorio: ${error.message}`);
  }
}

// Crear un servidor HTTP
const server = http.createServer(async (req, res) => {
  try {
    // Manejar la ruta solicitada
    let filePath = path.join(appDirectory, req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath).toLowerCase();

    // Determinar el tipo de contenido según la extensión del archivo
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Leer el contenido del archivo
    const content = await fs.readFile(filePath);

    // Enviar la respuesta al cliente
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  } catch (error) {
    console.error('Error:', error.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error interno del servidor');
  }
});

// Obtener el puerto del entorno o usar el 3000 por defecto
const port = process.env.PORT || 3000;

// Iniciar el servidor
server.listen(port, () => {
  console.log(picoColors.green(`Servidor escuchando en http://localhost:${port}/`));
});

// Listar el contenido del directorio al iniciar el servidor
listarDirectorio(appDirectory)
  .then(archivos => console.log('Contenido del directorio:', archivos))
  .catch(error => console.error(error.message));
