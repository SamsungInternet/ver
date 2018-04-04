const key = '463053799829763cff950c7b3096b5c0';
let flickr_url = 'https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=' + key + '&format=json&nojsoncallback=1';
let img_src = null;
let img_w = 4;

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
        img.setAttribute('width', 4);
        img.setAttribute('height', 3);
        img.setAttribute('position', `${-10 + img_w * i } 2 -5`);
        document.querySelector('#layout_container').appendChild(img);
    }
}

function createImageLayout(){
    let layout_container = document.createElement('a-entity');
    layout_container.setAttribute('id', 'layout_container');
    document.querySelector('a-scene').appendChild(layout_container);

}

