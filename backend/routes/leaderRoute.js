const express = require('express');
const router = express.Router();
const service = require("../service/leaderService");

router.post('/leaderboard', function (req, res) {
  console.log("i got to post-leaderboard");
  service.postUser(req.body.ip,
                  req.body.name,
                  req.body.diff,
                  req.body.mistake,
                  req.body.time)
                  .then(result => {
                    console.log(result);
                    res.status(201).json({
                      message: "Handling POST requests to /leaderboard",
                      count: `added ${result.count} user to DB`,
                      product: result.user
                    });
                  })
                  .catch(err => {
                    console.log(err);
                    res.status(500).json({
                      error: err
                    });
                  });
});

router.get('/leaderboard', async function(req, res) {
  console.log("i got to get-leaderboard");
  await service.getUsers().then(result => res.json(result)).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });

  // const response = await service.getUsers();
  // res.json(response);
});


router.get('/leaderboard/:diff', async function(req, res) {
  console.log("i got to get-leaderboard by user name");
  await service.boardByDiff(req.params['diff']).then(result => res.json(result)).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.delete('/leaderboard/:oprator', async function(req, res) {
  console.log("i got to delete-leaderboard by user name");
  await service.deleteUser(req.params['oprator']).then(result => { 
    if (result === 0){
      throw new Error("Not valid user id",{ details: "Not valid user id" });
    }
    res.json(`user id ${req.params['oprator']} deleted !`)}).catch(err => {
    if (err.message === "Not valid user id") {
      res.status(500).json({
        error: err.message
      });
    }else{
      console.log(err);
      res.status(500).json({
      error: err
    });
    }
    
  });
});

router.get('/user-count', async function(req, res) {
  console.log("im in countUsers");
  await service.countUsers().then(result => res.json(result)).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

module.exports = router;
