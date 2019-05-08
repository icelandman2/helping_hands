const express = require('express')
const app = express()
const port = 3000


//app.get('/', (req, res) => res.send('Hello World!'))
//Usage: node server.js
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.listen(3000, function () {
  console.log('server running on port 3000');
})

'''app.get(‘/init’, call_init);


function call_init(req, res) {
  var options = {
    args:
    [
      req.query.val1,
      req.query.val2 //parameters
    ]
  }
  PythonShell.run(‘./python_file.py’, options, function (err, data) {
    if (err) res.send(err);
    res.send(data.toString())
  });
}'''