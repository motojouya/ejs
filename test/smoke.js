
const ejsql = require('../lib/ejsql.js');

const result01 = ejsql.render('SELECT * FROM users where user_id = <%= test %>;', {test: 'motojouya'});
console.log(result01);

const result02 = ejsql.render('SELECT * FROM users where user_id IN <%~ test %>;', {test: ['motojouya', 'nick']}, {cache: true, filename: 'intest'}, {debug: true});
console.log(result02);

const result03 = ejsql.render('SELECT * FROM users where <%- test %> = "default";', {test: 'user_id'});
console.log(result03);

