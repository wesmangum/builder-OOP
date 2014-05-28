'user strict';

var trees = global.nss.db.collection('trees');
var Mongo = require('mongodb');
var _ = require('lodash');


class Tree{
  constructor(userId){
    this.userId = userId;
    this.height = 0;
    this.isHealthy = true;
    this.isChopped = false;
  }

  save(fn){
    trees.save(this, ()=>fn());
  }

  grow(){
    var maxHeight = this.isAdult ? this.height*0.1 : 2;
    var maxDeath = this.isAdult ? 200 - ((this.height / 12) * 0.1) : 200;
    maxDeath = maxDeath < 10 ? 10 : maxDeath;

    this.height += _.random(0, maxHeight, true);
    this.isHealthy = _.random(0, maxDeath, true) > 1;
  }

  chop(user){
    user.wood += (this.height / 2);
    this.height = 0;
    this.isHealthy = false;
    this.isChopped = true;
  }

  remove(treeId, fn){
    trees.findAndRemove({_id: treeId}, ()=>fn());
  }

  get isAdult(){
    return this.height >= 48;
  }

  get isGrowable(){
    return this.isHealthy && !this.isBeanStalk && !this.isChopped;
  }

  get isChoppable(){
    return this.isAdult && this.isHealthy && !this.isBeanStalk;
  }

  get isBeanStalk(){
    return (this.height / 12) >= 10000;
  }

  get classes(){
    var classes= [];
    if(this.height === 0){
      classes.push('seed');
    }else if(this.height < 24){
      classes.push('sapling');
    }else if(!this.isAdult){
      classes.push('teenager');
    }else{
      classes.push('adult');
    }

    if(!this.isHealthy){
      classes.push('dead');
    }else{
      classes.push('alive');
    }

    if(this.isChopped){
      classes.push('chopped');
    }

    if(this.isBeanStalk){
      classes.push('beanstalk');
    }

    return classes.join(' ');

  }

  static plant(userId, fn){
    userId = Mongo.ObjectID(userId);
    var tree = new Tree(userId);
    trees.save(tree, (err, t)=>fn(t));
  }

  static findAllByUserId(userId, fn){
    userId = Mongo.ObjectID(userId);
    trees.find({userId: userId}).toArray((err, objs)=>{
      var forest = objs.map(o=>_.create(Tree.prototype, o));
      fn(forest);
    });
  }

  static findByTreeId(treeId, fn){
    treeId = Mongo.ObjectID(treeId);
    trees.findOne({_id: treeId}, (err, tree)=>{
      tree = _.create(Tree.prototype, tree);
      fn(tree);
    });
  }

  static removeAllDeadTrees(userId, fn){
    trees.remove({userId: userId, $or: [{isHealthy: false}, {isChopped: true}]});
    fn();
  }
}

module.exports = Tree;
