const app = require('./app');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  console.log(`Server running at ${protocol}://${HOST}:${PORT}`);
});

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });

module.exports = server;
