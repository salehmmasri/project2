'use strict';

require('dotenv').config();

const express = require('express');

const superagent = require('superagent');

const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

const methodOverride = require('method-override');

const server = express();

server.set('view engine', 'ejs');

const PORT = process.env.PORT;

server.use(express.json());

server.use(methodOverride('_method'));

server.use(express.urlencoded({ extended: true }));



server.get("/search",renderSearche);
server.post("/findteam",renderSearcheValues);
server.post("/addteamtoDBS",addtoDBS);
server.get("/",showAllData);

server.post("/showdetails/:id",details);
server.delete("/delete/:id",deleteItem);

server.put("/update/:id",updateItem);



// home page
function renderSearche(req,res) {
    res.render('pages/search');
}

//data from home page 
function renderSearcheValues(req,res) {
    let teamName=req.body.teamname;
    let URL=`https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=${teamName}`;
    superagent.get(URL)
    .then(data=>{

        let arrofTeams=data.body.teams.map(val=>{

            let newData= new Team(val);

            return newData;
        });
        res.render('index',{teams:arrofTeams});
    });

}




function addtoDBS(req,res) {
    let{team,img_url,stadium,league}=req.body;
    let SQL=`INSERT INTO clup (team,img_url,stadium,league) VALUES ($1,$2,$3,$4);`
    let save=[team,img_url,stadium,league];
    client.query(SQL,save)
    .then(data=>{

        res.redirect('/');
    });
}


function showAllData(req,res) {
    let SQL= `SELECT * FROM clup ;`;
    client.query(SQL)
    .then(data=>{
        res.render('search/show',{alldata:data.rows});
    });
    
}

function details(req,res) {
    let id=req.params.id;
    let SQL=`SELECT * FROM clup WHERE id=$1 ;`;
    let save=[id];
    client.query(SQL,save)
    .then(data=>{
        res.render('search/details',{selected:data.rows[0]});
    })    
}




function deleteItem(req,res) {
    let id=req.params.id;
    let SQL=`DELETE FROM clup WHERE id=$1 ;`;
    let save=[id];
    client.query(SQL,save)
    .then(()=>{
        res.redirect('/');
  
    });
    
}
function updateItem(req,res) {
    let id=req.params.id;
    let {team,img_url,stadium,league}=req.body;
    let SQL=`UPDATE clup SET team=$1,img_url=$2,stadium=$3,league=$4 WHERE id=$5 ;`;
    let save=[team,img_url,stadium,league,id];
    client.query(SQL,save)
    .then(()=>{
        res.redirect('/');
    });
}

function Team(data) {
    this.team = data.strTeam;
    this.img_url = data.strStadiumThumb;
    this.stadium = data.strStadium;
    this.league = data.strLeague;

}

client.connect()
.then(()=>{
    server.listen(PORT,()=>{
        console.log(`on port ${PORT}`);
    });
})




















// server.get('/search', find);
// server.post('/search', useapitogetdata);
// server.post('/addToDBS', addToDBS);
// server.get('/', displayalldata);
// server.get('/details/:id', detailsForone);
// server.put('/update/:id', updatevalus);
// server.delete('/delete/:id',deleteTeam);

// function find(req, res) {
//     res.render('pages/search');
// }


// function useapitogetdata(req, res) {
//     let teamName = req.body.clubname;
//     let URL = `https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=${teamName}`;
//     superagent.get(URL)
//         .then(data => {
//             let teamsArr = data.body.teams.map(val => {

//                 let savedata = new Team(val);
//                 return savedata;

//             });

//             res.render('search/show', { team: teamsArr });
//         });
// }

// function addToDBS(req, res) {
//     let { team, img_url, stadium, league } = req.body;
//     let SQL = `INSERT INTO clup(team,img_url,stadium,league) VALUES($1,$2,$3,$4);`;
//     let save = [team, img_url, stadium, league];
//     client.query(SQL, save)
//         .then(() => {
//             res.redirect('/');
//         });
// }


// function displayalldata(req, res) {
//     let SQL = `SELECT * FROM clup;`;
//     client.query(SQL)
//         .then(data => {
//             res.render('index', { dbs: data.rows });
//         });
// }

// function detailsForone(req, res) {
//     let id = req.params.id;
//     let SQL = `SELECT * FROM clup WHERE id=$1;`;
//     let save = [id];
//     client.query(SQL, save)
//         .then(data => {
//             res.render('search/details', { dbs: data.rows[0] });
//         });
// }



// function updatevalus(req,res) {
//     let id=req.params.id;
//     let {team,img_url,stadium,league}=req.body;
//     // let SQL=`UPDATE clup STE team=$1,img_url=$2,stadium=$3,league=$4 WHERE id=$5 ;`;
//     let SQL = `UPDATE clup SET team=$1,img_url=$2,stadium=$3,league=$4 WHERE id=$5 ;`;

//     let save=[team,img_url,stadium,league,id];
//     client.query(SQL,save)
//     .then(()=>{
//         res.redirect('/')
//     })
    
// }


// function deleteTeam(req,res) {
//     let id = req.params.id;
//     let SQL=`DELETE FROM clup WHERE id=$1 ;`;
//     let save=[id];
//     client.query(SQL,save)
//     .then(()=>{
//         res.redirect('/')
//     });
// }


// client.connect()
//     .then(() => {
//         server.listen(PORT, () => {
//             console.log(`in PORT ${PORT}`);
//         });
//     })












