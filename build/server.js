"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: 'config.env'
});
const index_1 = require("./index");
const mongoose_1 = __importDefault(require("mongoose"));
const envVariables = process.env;
const connectionUrl = envVariables.DBURL
    .replace('<password>', envVariables.DBPASSWORD)
    .replace('<dbname>', envVariables.DBUSERNAME);
mongoose_1.default
    .connect(connectionUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log('successfully connected to db'))
    .catch(() => console.log('error while connecting to db'));
index_1.app.listen(3000, () => {
    console.log('connected to port succesfully');
});
