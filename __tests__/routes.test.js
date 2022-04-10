const supertest = require('supertest')
const app = require('../app')

describe('Route test', () => {
    var sToken = '';
    test("POST /utils/getAppToken", async() => {
        await supertest(app).post("/utils/getAppToken")
            .set('sMW', `smw dd360-2712`)
            .send({
                sMW: 'dd360-2712',
            })
            .expect(200)
            .then((response) => {
                expect(response.body.message).toBe('_OK_');
                expect(response.body.data.token).not.toBe("");
                sToken = response.body.data.token;
            });
    });

    test("POST /users/createUser", async() => {
        let sCorreo = `correo${Math.random()}@correo.com`;
        await supertest(app).post("/users/createUser")
            .set('Authorization', `Bearer ${sToken}`)
            .set('sMW', `dd360-2712`)
            .send({
                "sNombre": "NOMBRE",
                "sApellido_Paterno": "paterno",
                "sApellido_Materno": "",
                "sCorreo": sCorreo,
                "sPassword": Math.random()
            })
            .expect(201)
            .then((response) => {
                console.log(response.body);
            });
    });



});