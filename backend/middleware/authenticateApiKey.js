const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  console.log('Clave API recibida en middleware:', apiKey);

  if (!apiKey) {
    return res.status(401).json({ error: 'Acceso no autorizado: Se requiere una clave API.' });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Acceso denegado: Clave API inválida.' });
  }

  next();
};

module.exports = authenticateApiKey;
