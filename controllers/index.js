var async =  require('async');

var Weapon = require("../models/weapons.js");
var User = require("../models/users.js");




var indexController = {
  index: function(req, res) {
    var weapons = [];
    var content;

    async.series([
          function (cb) {


            User.findOne({"username":req.user.username}, function(err, content){

              content.weapons.forEach(function(item){


                Weapon.findOne({"name":item}, function(error, data){
                  

                  weapons.push(data);


                  if(weapons.length === content.weapons.length){
                      cb(null, weapons);
                  }
                });

              });
              

            });
          }
        ],
    function(err, results) {
      console.log(results[0]);
      res.render('index', {weapons: results[0], user:req.user});

    });



    // var weapons = [];


    // User.findOne({"username":req.user.username}, function(err, content){
      

    //   content.weapons.forEach(function(item){
    //     // console.log(item)
    //     Weapon.findOne({"name":item}, function(error, data){
          

    //       weapons.push(data);
          
    //       // console.log(data)
          
    //     })

    //   })


    
    // });



    // function timeout(){
    //   res.render('index', {weapons: weapons, user:req.user});
    // }

    
    // setTimeout(timeout, 1000);


    
  }
};

module.exports = indexController;