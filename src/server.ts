import app from './app';
import config from './config/config';

const port = config.PORT;
const server = config.SERVER_URL;
const environment = config.ENV;

app.listen(port, () => {
    console.log(
        `🚀 Server started:\n` + `  URL: ${server}:${port}\n` + `  Environment: ${environment}\n`,
    );
});
