const 	url = '/upload';
const 	form = document.querySelector('form');
const 	fileInput = document.getElementById('client-files');
var 		fileList = [];

// returns node
function addFilename(filename) {
  var ul_node = document.createElement("ul");
  var node = document.createElement("li");
  var textnode = document.createTextNode(filename);
  ul_node.appendChild(node);
  node.appendChild(textnode);
  
  return ul_node;
}

form.addEventListener('change', e => {
  
  // check to see if more files have been added.
  if (e.target.id.includes('client-files')) {
    for (var i = 0; i<fileInput.files.length;i++) {
      // get a HTML node and add it to the page.
      var filenameNode = addFilename(fileInput.files[i].name);
      document.querySelector("#file-list").appendChild(filenameNode);
      // add file to list.
      var obj = {'file':fileInput.files[i], 'filename':fileInput.files[i].name, 'filenameNode':filenameNode};
      fileList.push(obj);
    }
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const files = document.querySelector('[type=file]').files;
  
  // upload file but only new files.
  fileList.forEach(function(file) {
    if(file.filenameNode.classList.contains('upload-g') === false|| !file.filenameNode.classList.contains('upload-b') === false) {
      sendFile(file.filenameNode, file.file);
    }
  });
});

function sendFile(filenameNode, file) {
  var formData = new FormData();
  const first_name = document.querySelector('#first-name');
  const last_name = document.querySelector('#last-name');
  const client_email = document.querySelector('#client-email');
  const business_name = document.querySelector('#business-name');
  
  formData.append('first_name', first_name.value);
  formData.append('last_name', last_name.value);
  formData.append('client_email', client_email.value);
  formData.append('business_name', business_name.value);
  formData.append('file',file);
  
  filenameNode.removeAttribute('class');
  filenameNode.setAttribute('class', 'upload-wait');
  
  fetch(url, {
    method: 'POST',
    body: formData,
  }).then(response => {
    if(response.status == 200) {
      filenameNode.removeAttribute('class');
      filenameNode.setAttribute('class', 'upload-g');
    } else {
      filenameNode.removeAttribute('class');
      filenameNode.setAttribute('class', 'upload-b');
    }
  });			
}