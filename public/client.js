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
        let link = document.createElement('a');
        img.src = reader.result;
        li.appendChild(img);
        li.appendChild(link);
        document.getElementById('gallery').appendChild(li)
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        if ((encoded.length % 4) > 0) {
            encoded += '='.repeat(4 - (encoded.length % 4));
        }
        //decode file
        var decode = window.atob(encoded);
        sendSvg(file.name, link,decode, i);


    }
}



function sendSvg(fileName, link, svg, i) {
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
        let xml = e.target.response;
        let name = fileName.replace('svg','xml');
        
        //CREATE DOWNLOAD
        link.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(xml));
        link.setAttribute('download', name);
        link.innerHTML = name;
    })
   
    var data = JSON.stringify({ 'svg': svg});
    xhr.send(data);
}



