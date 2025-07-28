const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" })


const app = require('./app');

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1'


app.listen(port, host, () => {
    console.log('Server is Running and ready to accept requests on port 3000');
});

