//Host a mapbox instance that can be debugged

const express = require('express');
const axios = require('axios');
const https = require('https');
var detect = require('charset-detector');
var iconv = require('iconv-lite');

const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

//var proxy = require('express-http-proxy');
var app = require('express')();


const port = 3002;

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();

const agent = new https.Agent({  
    rejectUnauthorized: false
});

//Host mapbox
app.use('/index.html', express.static('./index.html'));

app.use('/style', express.static('./style'));


//Autenticate at the XY server
axios.post('https://wfw01_ls:8080/auth/lite?rememberMe=true', {
    username: 'administrator',
    password: 'admin',
}, {
    httpsAgent: agent,
    headers: { "SE-Application": "E1A8A9F7-381D-4894-805B-FD1CDE409228" },
    withCredentials: true,
    jar: cookieJar
})
.then(
    console.log("Logged in")
)
.catch((error) => {
    console.log(error);
});

//Proxy requests
app.get('/tiles/:z/:x/:y/:type.mvt', function(req, res) {  
      
    axios.get(`https://wfw01_ls:3000/api/v2/tiles/vector/B_defaultfg/default/${ req.params.z }/${ req.params.x }/${ req.params.y }.mvt?type=${ req.params.type }&userName=administrator`, 
        {
            jar: cookieJar, 
            httpsAgent: agent, 
            withCredentials: true,
            responseType: 'arraybuffer'
        }
        )
        .then((response) => {
            res.type("application/vnd.mapbox-vector-tile");
            res.send(new Buffer(response.data, 'binary'));
        })
        .catch((error) => {
            console.log(error);
        });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))





