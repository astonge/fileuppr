const express = require('express')
const fileUpload = require('express-fileupload');
const mv = require('mv');
const fs = require('fs');
var moment = require('moment');
const app = express()
const port = 8080

app.use(fileUpload({
  createParentPath: true,
  limits: { 
      fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
  },
}));

// FS checks
if(fs.existsSync('./uploads/')) {
  console.log("Uploads directory exists");
} else {
  console.log("Uploads directory does not exist.");
}

app.use('/', express.static('public'));
app.post('/upload', function(req, res) {
  let fileUpload = req.files;

  var first_name = req.body.first_name.toLowerCase().replace(' ','');
  var last_name = req.body.last_name.toLowerCase().replace(' ','');
  var client_email = req.body.client_email.toLowerCase().replace(' ','');
  var business_name = req.body.business_name.toLowerCase().replace(' ','');
  
  var now = moment().format('YYYYMMDD_HHmmss')
  var folder_name = `${now}_${first_name}_${last_name}_${business_name}`;

  // check if folder exists
  if(fs.existsSync('./uploads/'+folder_name)) {
    // copy file to this folder with custom name
    fileUpload.file.mv('./uploads/'+folder_name+'/'+now+"_"+fileUpload.file.name, function(err) {
      if (err)
        // there was an error.. 
        return res.status(500).send('ERROR: '+err);
      else
        // all good..
        return res.status(200).send("File Upload OK");
    });
  } else {
    // Make the directory
    fs.mkdirSync('./uploads/'+folder_name);
    fileUpload.file.mv('./uploads/'+folder_name+'/'+now+"_"+fileUpload.file.name, function(err) {
      if (err)
        return res.status(500).send('ERROR mkdir(): '+err);
      else
        return res.status(200).send('File Upload OK mkdir()');
    })
  }
});

app.listen(port, () => console.log(`FileUppr Listening on port ${port}!`))