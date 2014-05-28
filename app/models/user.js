'use strict';

var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');

class User{
  constructor(username){
    this.username = username;
    this.wood = 0;
    this.cash = 0;
    this.items = [];
    this.house = {
      type:'tent',
      upgrades: []
    };
  }

  save(fn){
    users.save(this, ()=>fn());
  }

  purchase(item){
    if(item.cost <= this.cash){
      this.cash -= item.cost;
      this.items.push(item);
    }
  }

  get isAutoGrowAvailable(){
    var isPresent = _.some(this.items, {type: 'autogrow'});

    return (this.cash >= 50000) && !isPresent;
  }

  get isAutoSeedAvailable(){
    var isPresent = _.some(this.items, {type: 'autoseed'});

    return (this.cash >= 75000) && !isPresent;
  }

  get isAutoRootAvailable(){
    var isPresent = _.some(this.items, {type: 'autoroot'});

    return (this.cash >= 85000) && !isPresent;
  }

  static login(username, fn){
    username = username.trim().toLowerCase();
    users.findOne({username: username}, (e, user)=>{
      if (user) {
        user = _.create(User.prototype, user);
        fn(user);
      }else{
        user = new User(username);
        users.save(user, (err, u)=>fn(u));
      }
    });
  }

  static findById(userId, fn){
    userId = Mongo.ObjectID(userId);
    users.findOne({_id: userId}, (err, user)=>{
      user = _.create(User.prototype, user);
      fn(user);
    });
  }
}

module.exports = User;
