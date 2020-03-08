


db.on('error',console.error.bind(console,'Db Connection error'));
db.once('open',function(){
    console.log('Connected to database');
});

const data = [
    {id: 1, name: 'One'},
    {id: 2, name: 'Two'},
    {id: 3, name: 'Three'},
    {id: 4, name: 'Four'},
    {id: 5, name: 'FIve'},
    {id: 6, name: 'SIx'},
]

module.exports = db;