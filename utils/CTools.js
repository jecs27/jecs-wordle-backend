const CryptoJS = require("crypto-js");
const moment = require("moment");
const { token_key } = require('../config/config');

const crearHashMd5 = async(str) => {
    return CryptoJS.MD5(str).toString();
}

//De momento se regresa mismo valor... solo dev
const encryptString = (msg) => {
    let encToken = token_key + moment().format('DD%MM&YYYY') + new Date().getDay();
    return CryptoJS.AES.encrypt(msg.toString(), encToken).toString();
}

const decryptString = async(msg) => {
    let encToken = token_key + moment().format('DD%MM&YYYY') + new Date().getDay();
    let bytes = CryptoJS.AES.decrypt(msg, encToken);
    return bytes.toString(CryptoJS.enc.Utf8);
}

//TODO encriptar los datos del response
const encryptObjKey = async(objData) => {
    let objKey = Object.keys(objData);
    for (let objDataInfo of objKey) {
        console.log(objData[objDataInfo]);
        objData[objDataInfo] = await encryptString(objData[objDataInfo])
    }
    return objData;

}

module.exports = {
    crearHashMd5,
    decryptString,
    encryptObjKey,
}