const app = require('./app');

app.set('port', process.env.PORT || 3000);

const server = app.listen(3000);

require('./sockets').listen(server);