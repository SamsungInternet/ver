const key = '463053799829763cff950c7b3096b5c0';
let flickr_url = 'https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=' + key + '&format=json&nojsoncallback=1';
let img_src = null;

function reqListener(){
    img_src = JSON.parse(this.responseText);
}

let oReq = new XMLHttpRequest();
oReq.addEventListener('load', reqListener);
oReq.open('GET', flickr_url);
oReq.send();



function createImages(cant){
    let img_urls = [cant];
    for(i = 0; i < cant; i++){
        let picUrl = picNum => `https://img.gs/khtbpxltql/1024x1024/https://farm${ img_src.photos.photo[picNum].farm }.staticflickr.com/${ img_src.photos.photo[picNum].server }/${ img_src.photos.photo[picNum].id}_${ img_src.photos.photo[picNum].secret }_b.jpg;`;
        let img = document.createElement('a-image');
        img.setAttribute('src', picUrl(i));
        document.querySelector('a-scene').appendChild(img);
    }
}

