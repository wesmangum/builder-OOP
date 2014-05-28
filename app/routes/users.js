'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Item = traceur.require(__dirname + '/../models/item.js');



exports.login = (req, res)=>{
  User.login(req.body.username, user=>{
    res.render('users/overview', {user: user}, (err,ove)=>{
      res.render('users/inventory', {user: user}, (err, inv)=>{
        res.render('users/house', {user: user}, (err, house)=>{
          res.send({overview: ove, inventory: inv, house: house});
        });
      });
    });
  });
};

exports.sell = (req, res)=>{
  User.findById(req.params.userId, user=>{
    if(user.wood > req.body.amount){
      user.wood -= req.body.amount;
      user.cash += (req.body.amount / 5);
    }
    user.save(()=>{
      res.render('users/overview', {user: user});
    });
  });
};

exports.purchase = (req, res)=>{
  User.findById(req.params.userId, user=>{
    var item = new Item(req.params.item);
    user.purchase(item);
    user.save(()=>{
      res.render('users/overview', {user: user}, (err,ove)=>{
        res.render('users/inventory', {user: user}, (err, inv)=>{
          res.send({overview: ove, inventory: inv});
        });
      });
    });
  });
};
