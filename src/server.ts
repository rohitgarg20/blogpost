import dotenv from 'dotenv';

dotenv.config({
	path: 'config.env'
});
import { app } from './index';
import mongoose from 'mongoose';

const envVariables: any = process.env;

const connectionUrl: string = envVariables.DBURL
	.replace('<password>', envVariables.DBPASSWORD)
    .replace('<dbname>', envVariables.DBUSERNAME);

mongoose
	.connect(connectionUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
	.then(() => console.log('successfully connected to db'))
    .catch(() => console.log('error while connecting to db'));

app.listen(3000, () => {
	console.log('connected to port succesfully')
});
