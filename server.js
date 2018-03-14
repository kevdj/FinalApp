let express = require('express'); 
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg  = require('pg');
const PORT = 3000;
var schedule = require('node-schedule');

let pool = new pg.Pool({
	port:5432,
	password:'kevjeff1',
	database: 'postgres',
	max:10,
	host:'localhost',
	user:'postgres',
});

// pool.connect((err, db, done)=> {
// 	if (err){
// 		return console.log(err);
// 	}
// 	else{
// 		db.query('SELECT * from transactions',(err, table) => {
// 			done();
// 			if (err){
// 				return console.log(err);
// 			}else{
// 				console.log(table.rows);
// 			}
// 		})
		
// 	}
// });
let app = express();

app.use(bodyParser.json());

app.use(morgan('dev'));


app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/transactions', function(req,res){

	pool.connect((err, db, done)=> {
	if (err){
		return res.status(400).send(err);
	}
	else{
		db.query('SELECT * from transactions',(err, table) => {
			done();
			if (err){
				return console.log(err);
			}else{
				console.log('VALUES displayed');
				db.end();
				return res.status(201).send(table.rows);
			}
		})
		
	}
});

})
/* the following is used to set our daily, weekly, monthly , annual limits  ( to be reviewed )*/

var daily = schedule.scheduleJob('59 59 23 * * *', function(){
	pool.connect((err, db, done)=> {
	if (err){
		console.log('available_funds not reset');
		//return res.status(400).send(err);
	}
	else{
  	db.query('update categories set available_funds = limits.limit_amt from limits where limits.categoryid = categories.categoryid and limit_days = 1',(err, table) => {
			done();
			if (err){
				return console.log(err);
			}else{
				console.log('available_funds reset');
				db.end();
				//return res.status(201).send(table.rows);
			}
		})
  }
});

});

var weekly = schedule.scheduleJob('59 59 23 * * 7', function(){
	pool.connect((err, db, done)=> {
	if (err){
		console.log('available_funds not reset');
		//return res.status(400).send(err);
	}
	else{
  	db.query('update categories set available_funds = limits.limit_amt from limits where limits.categoryid = categories.categoryid and limit_days = 7',(err, table) => {
			done();
			if (err){
				return console.log(err);
			}else{
				console.log('available_funds reset');
				db.end();
				//return res.status(201).send(table.rows);
			}
		})
  }
});

});

var monthly = schedule.scheduleJob('59 59 23 31 * *', function(){
	pool.connect((err, db, done)=> {
	if (err){
		console.log('available_funds not reset');
		//return res.status(400).send(err);
	}
	else{
  	db.query('update categories set available_funds = limits.limit_amt from limits where limits.categoryid = categories.categoryid and limit_days = 31',(err, table) => {
			done();
			if (err){
				return console.log(err);
			}else{
				console.log('available_funds reset');
				db.end();
				//return res.status(201).send(table.rows);
			}
		})
  }
});

});

var yearly = schedule.scheduleJob('59 59 23 31 12 *', function(){
	pool.connect((err, db, done)=> {
	if (err){
		console.log('available_funds not reset');
		//return res.status(400).send(err);
	}
	else{
  	db.query('update categories set available_funds = limits.limit_amt from limits where limits.categoryid = categories.categoryid and limit_days = 366',(err, table) => {
			done();
			if (err){
				return console.log(err);
			}else{
				console.log('available_funds reset');
				db.end();
				//return res.status(201).send(table.rows);
			}
		})
  }
});

});

/* the above is used to set our daily, weekly, monthly , annual limits */
 


app.post('/api/new-transaction', function(req, res){
	console.log(req.body);
	var trans_name = req.body.trans_name;
	var price = req.body.trans_price;
	var shopid = req.body.trans_shop;
	var shop_name = req.body.shop_name;
	var categoryid = 5;
	let values = [trans_name, price, shopid];
	let values2 = [shopid, shop_name, categoryid];

pool.connect((err, db, done)=> {
	if (err){
		return res.status(400).send(err);
		
	}
	else{	
		db.query('insert into transactions(trans_name, price, shopid) values($1, $2, $3)',[...values],(err, table) => {
			done();
			if (err){
				if(err.code === '23503'){
					db.query('insert into shops(shopid, shop_name, categoryid) values($1, $2, $3)',[...values2],(err, table) => {
						done();
						if (err){
				
							return console.log(err.code);
							}
							else{

								console.log('VALUES INSERTED');
								db.query('insert into transactions(trans_name, price, shopid) values($1, $2, $3)',[...values],(err, table) => {
									done();
									if (err){
									return console.log(err.code);
									}else{
										console.log('VALUES INSERTED');
										db.end();
										res.status(201).send({message:'transactions Inserted'});
										//res.status(201).send({message:'Shop Inserted'});
									}
								})
							}
						})
					

					return console.log('err');

				}
				return console.log(err.code);
			}else{
				console.log('VALUES INSERTED');
				db.end();
				res.status(201).send({message:'transactions Inserted'});
			}
		})
		
	}
});

});

app.listen(PORT,() => console.log('listening on port' + PORT));