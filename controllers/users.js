var User = require('../models/users.js');
var Message = require('../models/messages.js');


var userController = {


      locate: function (req, res) {
          var data = req.body;

          var date = new Date();
          var username = req.user.username;


          User.findOne({username:username}, function(err, user) {
            if (err) return handleErr(err);

            find = {
              coordinates: [data.latitude, data.longitude],
              datetime: date
            };

            user.location = find;
            user.save();

          });

      },

      explore: function(req, res){
        console.log('hi');
        var geoJSONpoint = {
            "type": "Point",
            "coordinates": [
                 parseFloat(req.user.location.coordinates[0]),
                 parseFloat(req.user.location.coordinates[1])
             ]
        };
        // Add datetime to query
        Message.find({}).populate("postedBy").exec(function(err, data){
          res.send(data);
        })
        // Message
        //   .find({ "location.coordinates": {"$nearSphere": { "$geometry": geoJSONpoint, "$maxDistance": 80000 }} })
        //   .populate("postedBy")
        //   .exec(function(err, msgs) {

        //   })

      },

      createmsg: function(req, res) {

        var newMsg = new Message({
            datetime: new Date(),
            expiredBy: new Date,
            postedBy: req.user._id,
        })

        newMsg.content = {
          imageUrl: req.body.url,
          text: req.body.text
        }

        newMsg.location = {
          coordinates: [req.body.latitude, req.body.longitude]
        }

        newMsg.save(function(err, data) {

        })

      }
}


module.exports = userController;