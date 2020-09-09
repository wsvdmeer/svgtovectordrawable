let dropArea = document.getElementById("drop-area")
    // Prevent default drag behaviors
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
        document.body.addEventListener(eventName, preventDefaults, false)
    })

    // Highlight drop area when item is dragged over it
    ;['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false)
    })

    ;['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false)
    })

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}

function highlight(e) {
    dropArea.classList.add('highlight')
}

function unhighlight(e) {
    dropArea.classList.remove('highlight')
}

function handleDrop(e) {
    var dt = e.dataTransfer
    var files = dt.files
    handleFiles(files)
}

function handleFiles(files) {
    files = [...files]
    files.forEach(previewFile)
}

function previewFile(file, i) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function () {

        //Create element
        let li = document.createElement('li');
    

        let img = document.createElement('img');
        li.appendChild(img);
        img.src = reader.result;

        let title = document.createElement('span');
        title.classList.add("title");
        title.innerHTML = file.name;
        li.appendChild(title);

        let error = document.createElement('span');
        error.classList.add("error");
        li.appendChild(error);

        let link = document.createElement('a');
        link.classList.add("link");
        li.appendChild(link);
       
        document.getElementById('results').appendChild(li)
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        if ((encoded.length % 4) > 0) {
            encoded += '='.repeat(4 - (encoded.length % 4));
        }
        //decode file
        var decode = window.atob(encoded);
        sendSvg(file.name, li,decode, i);


    }
}



function sendSvg(fileName, li, svg, i) {
    let link = li.getElementsByClassName('link')[0];
    let error = li.getElementsByClassName('error')[0];
    var url = '/upload'
    var xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.upload.addEventListener("progress", function (e) {
        console.log('progress : '+(e.loaded * 100.0 / e.total))
    })
    xhr.addEventListener('readystatechange', function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log("ready");
        }
        else if (xhr.readyState == 4 && xhr.status != 200) {
            console.log("error")
        }
    })
    xhr.addEventListener('load',function (e){
        console.log('load')
        console.log(e);
        if(xhr.status == 200){
            let xml = e.target.response;
            console.log(xml);
            let name = fileName.replace('svg','xml');
            
            //CREATE DOWNLOAD
          
            link.setAttribute('data:text/xml;charset=utf-8,' + encodeURIComponent(xml));
            link.setAttribute('download', name);
            link.innerHTML = "Download";
        }else{
            error.innerHTML = e.target.response;
        }
    })
   
    var data = JSON.stringify({ 'svg': svg});
    xhr.send(data);
}



