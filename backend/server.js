const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

app.use(cors({ origin: ['http://localhost:4200', 'http://127.0.0.1:4200'] }));
app.use(express.json({ limit: '100kb' }));

async function readDatabase() {
  return JSON.parse(await fs.readFile(DB_FILE, 'utf8'));
}

// Serializa las operaciones de lectura-modificación-escritura para evitar
// que dos POST simultáneos sobrescriban los cambios del otro.
let databaseQueue = Promise.resolve();
function withDatabase(work) {
  const operation = databaseQueue.then(async () => {
    const db = await readDatabase();
    return work(db);
  });
  databaseQueue = operation.then(() => undefined, () => undefined);
  return operation;
}

async function writeDatabase(data) {
  const temporaryFile = DB_FILE + '.tmp';
  await fs.writeFile(temporaryFile, JSON.stringify(data, null, 2) + '\n', 'utf8');
  await fs.rename(temporaryFile, DB_FILE);
}

function nextId(items) {
  return items.reduce((maximum, item) => Math.max(maximum, item.id), 0) + 1;
}
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'OptiStock API' }));

app.get('/api/productos', async (_req, res, next) => {
  try {
    const productos = await withDatabase((db) => db.productos);
    res.json(productos);
  } catch (error) { next(error); }
});

app.post('/api/productos', async (req, res, next) => {
  try {
    const { nombre, categoria, precio, cantidad, stockMinimo } = req.body || {};
    if (!isNonEmptyString(nombre) || !isNonEmptyString(categoria)) {
      return res.status(400).json({ mensaje: 'El nombre y la categoría son obligatorios.' });
    }
    if (!Number.isFinite(precio) || precio <= 0) {
      return res.status(400).json({ mensaje: 'El precio debe ser un número mayor que cero.' });
    }
    if (!Number.isInteger(cantidad) || cantidad < 0 || !Number.isInteger(stockMinimo) || stockMinimo < 0) {
      return res.status(400).json({ mensaje: 'La cantidad y el stock mínimo deben ser enteros iguales o mayores que cero.' });
    }

    const producto = await withDatabase(async (db) => {
      const nuevo = { id: nextId(db.productos), nombre: nombre.trim(), categoria: categoria.trim(), precio, cantidad, stockMinimo };
      db.productos.push(nuevo);
      if (cantidad > 0) {
        db.movimientos.push({
          id: nextId(db.movimientos), fecha: new Date().toISOString().slice(0, 10),
          producto: nuevo.nombre, tipo: 'Entrada', cantidad
        });
      }
      await writeDatabase(db);
      return nuevo;
    });
    return res.status(201).json(producto);
  } catch (error) { next(error); }
});

app.get('/api/movimientos', async (_req, res, next) => {
  try {
    const movimientos = await withDatabase((db) => db.movimientos);
    res.json(movimientos);
  } catch (error) { next(error); }
});

app.post('/api/movimientos', async (req, res, next) => {
  try {
    const { productoId, tipo, cantidad } = req.body || {};
    if (!Number.isInteger(productoId) || productoId <= 0) {
      return res.status(400).json({ mensaje: 'Selecciona un producto válido.' });
    }
    if (tipo !== 'Entrada' && tipo !== 'Salida') {
      return res.status(400).json({ mensaje: 'El tipo debe ser Entrada o Salida.' });
    }
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({ mensaje: 'La cantidad debe ser un entero mayor que cero.' });
    }

    const movimiento = await withDatabase(async (db) => {
      const producto = db.productos.find((item) => item.id === productoId);
      if (!producto) {
        const error = new Error('El producto seleccionado no existe.');
        error.status = 404;
        throw error;
      }
      if (tipo === 'Salida' && producto.cantidad < cantidad) {
        const error = new Error('No hay existencias suficientes para registrar esta salida.');
        error.status = 409;
        throw error;
      }

      producto.cantidad += tipo === 'Entrada' ? cantidad : -cantidad;
      const nuevo = {
        id: nextId(db.movimientos), fecha: new Date().toISOString().slice(0, 10),
        producto: producto.nombre, tipo, cantidad
      };
      db.movimientos.push(nuevo);
      await writeDatabase(db);
      return nuevo;
    });
    return res.status(201).json(movimiento);
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => {
  if (error.status === 404 || error.status === 409) {
    return res.status(error.status).json({ mensaje: error.message });
  }
  console.error('[OptiStock API]', error);
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ mensaje: 'El cuerpo de la solicitud debe contener JSON válido.' });
  }
  return res.status(500).json({ mensaje: 'Ocurrió un error interno al procesar la solicitud.' });
});

app.listen(PORT, () => console.log('OptiStock API disponible en http://localhost:' + PORT));
