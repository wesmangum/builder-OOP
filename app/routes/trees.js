'use strict';

var traceur = require('traceur');
var Tree = traceur.require(__dirname + '/../models/tree.js');
var User = traceur.require(__dirname + '/../models/user.js');


exports.plant = (req, res)=>{
  Tree.plant(req.body.userId, tree=>{
    res.render('trees/tree', {tree: tree});
  });
};


exports.forest = (req, res)=>{
  Tree.findAllByUserId(req.query.userId, trees=>{
    res.render('trees/forest', {trees: trees});
  });
};

exports.grow = (req, res)=>{
  Tree.findByTreeId(req.params.treeId, tree=>{
    tree.grow();
    tree.save((err, count)=>{
      res.render('trees/tree', {tree: tree});
    });
  });
};

exports.chop = (req, res)=>{
  Tree.findByTreeId(req.params.treeId, tree=>{
    User.findById(req.body.userId, user=>{
      tree.chop(user);
        user.save(()=>{
          tree.save(()=>{
            res.render('trees/tree', {tree: tree}, (err,html)=>{
              res.send({html: html, user: user});
            });
          });
        });
    });
  });
};

exports.root = (req, res)=>{
  Tree.findByTreeId(req.params.treeId, tree=>{
    tree.remove(tree._id, ()=>{
      res.render('trees/tree', {tree: tree});
    });
  });
};
