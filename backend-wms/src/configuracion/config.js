require("dotenv").config();

const configuracion = {
  servidor: {
    puerto: process.env.PORT || 3001,
    entorno: process.env.NODE_ENV || "development",
  },

  baseDatos: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://usuario:password@localhost:5432/wms_ranco_cherries",
  },

  jwt: {
    secreto:
      process.env.JWT_SECRET ||
      "mi-secreto-super-seguro-para-jwt-ranco-cherries-2024",
    tiempoExpiracion: process.env.JWT_EXPIRATION || "24h",
    issuer: "WMS Ranco Cherries",
    audience: "sistema-trazabilidad",
  },

  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
  },

  cors: {
    origen: process.env.CORS_ORIGIN || [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10000, // máximo 10000 requests por ventana por IP (muy alto para desarrollo)
    message:
      "Demasiadas solicitudes desde esta IP, intente nuevamente más tarde.",
  },

  logs: {
    nivel: process.env.LOG_LEVEL || "info",
    archivo: process.env.LOG_FILE || "logs/aplicacion.log",
    maxSize: "20m",
    maxFiles: "14d",
  },

  aplicacion: {
    nombre: "WMS Ranco Cherries",
    version: "1.0.0",
    descripcion: "Sistema de Trazabilidad de Materiales",
  },

  plantas: {
    rancagua: "RANCAGUA",
    chimbarongo: "CHIMBARONGO",
  },

  temporadas: {
    actual: process.env.TEMPORADA_ACTUAL || "R9",
  },
};

module.exports = configuracion;
