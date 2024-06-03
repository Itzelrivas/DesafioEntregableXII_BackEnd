import dotenv from 'dotenv';
import {Command} from 'commander';

const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servidor', 9090)
    .option('--mode <mode>', 'Modo de trabajo', 'develop')
    .option('--mongo', 'Usar persistencia con MongoDB');
program.parse();

console.log("Mode Option: ", program.opts().mode);

const environment = program.opts().mode;

dotenv.config({
    path:environment==="production"?"./src/config/.env.production":"./src/config/.env.development"
});

dotenv.config();

// Exportamos las variables de entorno
export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET, 
    secret: process.env.SESSIONS_SECRET,
    email: process.env.GMAIL_ACCOUNT,
    appEmailPass: process.env.GMAIL_APP_PASSWORD,
    environment: environment,
    useMongo: program.opts().mongo
};