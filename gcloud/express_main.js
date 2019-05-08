const express = require('express')
const app = express()
const port = 3000


//app.get('/', (req, res) => res.send('Hello World!'))
//Usage: node server.js
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.listen(3000, function () {
  console.log('server running on port 3000');
})

app.get('/predictor', call_predictor);


function call_predictor(req, res) {
  const spawn = require('child_process').spawn;
  const ls = spawn('python', ['main.py']); //insert args in list after main.py

  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  res.send(200);
}