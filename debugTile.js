//Put an vector tile in the tiles folder
//Usage: -t nameOfTile.mvt

const fs = require('fs');
const path = require('path');
const min = require('minimist');
const VectorTile = require('@mapbox/vector-tile').VectorTile;
const Protobuf = require('./node_modules/pbf/dist/pbf-dev');

const args = min(process.argv.slice(2));
const tile = args.t;

const raw = fs.readFileSync(path.join(__dirname, `./tiles/${ tile }`));
const style = fs.readFileSync(path.join(__dirname, `./style/style.json`));
const pbf = new Protobuf(raw);
const vt = new VectorTile(pbf);

console.log(vt.layers); 

