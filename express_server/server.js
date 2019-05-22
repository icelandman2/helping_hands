const express = require('express')
const app = express()
const port = 3000
const child_process = require('child_process');

app.listen(3000, function () {
  console.log('server running on port 3000');
})

app.get('/predictor', call_predictor);


function call_predictor(req, res) {
  const execFile = child_process.execFile;
  const f = execFile('/home/gabe84700/Team-5/express_server/venv/bin/python3',  ['../gcloud/main.py', '--file', '../team_headshots/andrew.jpeg'], function(err, stdout, stderr) { 
    // Node.js will invoke this callback when the 
    //console.log(stdout); 
  });

  f.stdout.on('data', function(data) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ data: data });
  });

  f.stderr.on('data', function(data) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ data: 'There was an error in predicting what sign was sent' });
  })

}