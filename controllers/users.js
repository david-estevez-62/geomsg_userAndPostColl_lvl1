var User = require('../models/users.js');


var userController = {



  locate: function (req, res) {
      var data = req.body;
      var date = new Date();
      var time = date.toISOString();
      var username = req.user.username;


      User.findOne({username:username}, function(err, user) {
        if (err) return handleErr(err);

        find = {
          latitude: data.latitude,
          longitude: data.longitude,
          datetime: time
        };

        user.location.push(find);
        user.save();

      });

  },


  scan: function (req, res) {
    var userslocation = req.user.location.pop();
    var userslat = userslocation.latitude;
    var userslng = userslocation.longitude;

    // console.log(userslocation);

    var date = new Date();
    var time = date.toISOString();
    var subtime = time.substring(0, 10)

    var sub1 = Number(time.substring(11, 13));
    var sub2 = Number(time.substring(14, 16));
    var sub3 = Number(time.substring(17, 19));

    var seconds1 = (sub1 * 3600) + (sub2 * 60) + sub3;



    User.find({}, function (err, user) {
      if (err) return handleErr(err);


      for (var i = 0; i < user.length; i++) {
        //return users other than current user
        if(req.user.username !== user[i].username){
          var closelocal = user[i].location.pop();

          var timestamp = closelocal.datetime;
          var substr = timestamp.substring(0, 10);



                
          if(substr === subtime) {
            var seg1 = Number(timestamp.substring(11, 13));
            var seg2 = Number(timestamp.substring(14, 16));
            var seg3 = Number(timestamp.substring(17, 19));
            
            var seconds2 = (seg1 * 3600) + (seg2 * 60) + seg3;




            // Get time within 20 min of scan(Or logging in)
            if((seconds1 - seconds2) < 1200) {

              var closelat = closelocal.latitude;
              var closelng = closelocal.longitude;


              console.log(userslocation);
              console.log(user[i].username + ":");
              console.log(closelat);
              console.log(closelng);


              // 1000ft square ==> latitude: +- 0.0027448  ||  longitude: +- 0.00450937 
              if((closelat <= (userslat + 0.0027448)) && (closelat >= (userslat - 0.0027448)) && (closelng <= (userslng + 0.00450937)) && (closelng >= (userslng - 0.00450937))) {     


                console.log(user[i].username + ":");
                console.log(closelat);
                console.log(closelng);


              }



            }


            
          }


        }


      };

    });

  }
      

};

module.exports = userController;