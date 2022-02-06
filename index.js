const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const logger = require('morgan');
const path = require('path');
const fileUpload = require("express-fileupload");
const jwt = require('jsonwebtoken');


require('dotenv').config();
const PORT = process.env.PORT || 3002;
const base_url = process.env.base_url;

const app = express();
app.use(fileUpload());
app.use(express.json())// add this line
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin','*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });

app.use(cors())
app.use(logger('dev'));
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: '50mb'
}));

// Routing Part

const user = require ('./user');

// =============================== USER =====================================
app.post('/api/V2/marlens/user', user.create);
app.get('/api/V2/marlens/user/all', authenticateToken, (req, res) => {
    user.readall(req,res)
});
app.post('/api/V2/marlens/user/login', user.login);
app.put('/api/V2/marlens/user',authenticateToken, (req, res) => {
    user.update(req,res)
});
app.delete('/api/V2/marlens/user/:id',authenticateToken, (req, res) => {
    user.delete_(req,res)
});
// ==========================================================================

// const user_stakeholder = require ('./user_stakeholder');

const dbZonaMarlens = require('./zona')
//============================= zona  =========================================
app.post('/api/V2/marlens/zona/create', dbZonaMarlens.createZona);
app.post('/api/V2/marlens/zona/read', dbZonaMarlens.readZona);
app.post('/api/V2/marlens/zona/read_except/:id', dbZonaMarlens.readZonaExeptThis);
app.get('/api/V2/marlens/zona/read/:id', dbZonaMarlens.readZonaById);
app.put('/api/V2/marlens/zona/update/:id', dbZonaMarlens.updateZona);
app.delete('/api/V2/marlens/zona/delete/:id', dbZonaMarlens.deleteZona);

app.post('/api/V2/marlens/zona_detail/create', dbZonaMarlens.createZonaDetail);
app.post('/api/V2/marlens/zona_detail/read', dbZonaMarlens.readZonaDetail);
app.get('/api/V2/marlens/zona_detail/read/:id', dbZonaMarlens.readZonaDetailById);
app.get('/api/V2/marlens/zona_detail/readByZona/:id', dbZonaMarlens.readZonaDetailByZonaId);
app.put('/api/V2/marlens/zona_detail/update/:id', dbZonaMarlens.updateZonaDetail);
app.delete('/api/V2/marlens/zona_detail/delete/:id', dbZonaMarlens.deleteZonaDetail);

app.post('/api/V2/marlens/zona_type/create', dbZonaMarlens.createZonaType);
app.post('/api/V2/marlens/zona_type/read', dbZonaMarlens.readZonaType);
app.get('/api/V2/marlens/zona_type/read/:id', dbZonaMarlens.readZonaTypeById);
app.put('/api/V2/marlens/zona_type/update/:id', dbZonaMarlens.updateZonaType);
app.delete('/api/V2/marlens/zona_type/delete/:id', dbZonaMarlens.deleteZonaType);

//============================= end zona ======================================

const dbTrappingMarlens = require('./trapping')
// ============================ trapping marlens =========================
app.post('/api/V2/marlens/trapping/create', dbTrappingMarlens.createTrapping);
app.post('/api/V2/marlens/trapping/read', dbTrappingMarlens.readTrapping);
app.get('/api/V2/marlens/trapping/read_index', dbTrappingMarlens.readTrappingIndex);
app.get('/api/V2/marlens/trapping/read/:id', dbTrappingMarlens.readTrappingById);
app.put('/api/V2/marlens/trapping/update/:id', dbTrappingMarlens.updateTrapping);
app.delete('/api/V2/marlens/trapping/delete/:id', dbTrappingMarlens.deleteTrapping);

app.post('/api/V2/marlens/trapping_detail/create', dbTrappingMarlens.createTrappingDetail);
app.post('/api/V2/marlens/trapping_detail/read', dbTrappingMarlens.readTrappingDetail);
app.get('/api/V2/marlens/trapping_detail/read/:id', dbTrappingMarlens.readTrappingDetailById);
app.get('/api/V2/marlens/trapping_detail/readByTrapping/:id', dbTrappingMarlens.readTrappingDetailByTrappingId);
app.put('/api/V2/marlens/trapping_detail/update/:id', dbTrappingMarlens.updateTrappingDetail);
app.delete('/api/V2/marlens/trapping_detail/delete/:id', dbTrappingMarlens.deleteTrappingDetail);

app.post('/api/V2/marlens/ship_trapping/create', dbTrappingMarlens.createShipTrapping);
app.post('/api/V2/marlens/ship_trapping/read', dbTrappingMarlens.readShipTrapping);
app.get('/api/V2/marlens/ship_trapping/read/:id', dbTrappingMarlens.readShipTrappingById);
app.get('/api/V2/marlens/ship_trapping/readByTrapping/:id', dbTrappingMarlens.readShipTrappingByTrappingId);
app.post('/api/V2/marlens/ship_trapping/readByTrapping', dbTrappingMarlens.readShipTrappingByIdMMSI);
app.put('/api/V2/marlens/ship_trapping/update/:id', dbTrappingMarlens.updateShipTrapping);
app.delete('/api/V2/marlens/ship_trapping/delete/:id', dbTrappingMarlens.deleteShipTrapping);

// ============================= end trapping marlens ====================

const dbTypeofshapeMarlens =require('./typeofshape')
// ============================= type of shape ===========================
app.post('/api/V2/marlens/typeofshape/create', dbTypeofshapeMarlens.createTypeofshape);
app.get('/api/V2/marlens/typeofshape/read', dbTypeofshapeMarlens.readTypeofshape);
app.get('/api/V2/marlens/typeofshape/read/:id', dbTypeofshapeMarlens.readTypeofshapeId);
app.put('/api/V2/marlens/typeofshape/update/:id', dbTypeofshapeMarlens.updateTypeofshape);
app.delete('/api/V2/marlens/typeofshape/delete/:id', dbTypeofshapeMarlens.deleteTypeofshape);
//============================== type of shape ===========================
const dbShipType = require ('./ship_type')
// ==================================== Ship Type ===========================
app.post ('/api/V2/marlens/typeofship',dbShipType.readShipTypeChild)
// ==========================================================================

const dbShipCategory = require ('./ship_category')
// ==================================== Ship Category ========================
app.post('/api/V2/marlens/categoryofship',dbShipCategory.readShipCategory)
//============================================================================
const dbAton = require('./aton')
// ===================================== Aton ================================
app.post('/api/V2/marlens/aton_type', dbAton.readAtonType);
app.get('/api/V2/marlens/aton', dbAton.readAton);
app.get('/api/V2marlens/aton/:id', dbAton.readAtonById);
// ===========================================================================


const dbAIS = require('./ais')
// ============================= AIS ================================================
app.post('/api/V2/marlens/ais/read',dbAIS.readAISMessage);
// ===================================================================================

// stake holder
const stakeholder = require ('./stakeholder');
// ================================= STAKEHOLDER ============================
app.get('/api/V2/marlens/stakeholder',stakeholder.read);
app.get('/api/V2/marlens/stakeholder/:id', stakeholder.read_by_id);
app.post('/api/V2/marlens/stakeholder',stakeholder.read);
// ==========================================================================

// navigation status
const dbAisStatusNavigation = require('./ais_status_navigation')

app.get('/api/ais_status_navigaion/',dbAisStatusNavigation.getAISStatusNavigation);
app.get('/api/ais_status_navigaion/:id',dbAisStatusNavigation.getAISStatusNavigationById);



// authentification part======================================================

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET)
      req.user = verified
  
      next() // continuamos
  } catch (error) {
      res.status(400).json({error: 'token not valid'})
  }
  
  }

// ==============================================================================
app.get("/", (req, res) => {
    res.send({
        message: "🚀 API Marlens v2.0"
    });
});

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
});