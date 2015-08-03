var User = require('../models/users.js');


var userController = {



  locate: function (req, res) {
      var data = req.body;
      var date = Date();
      var username = req.user.username;

      console.log(date);

      User.findOne({username:username}, function(err, user) {
        if (err) return handleErr(err);

        find = {
          latitude: data.latitude,
          longitude: data.longitude,
          date:date
        };

        user.location.push(find);
        user.save();

      });

  }
      








};

module.exports = userController;