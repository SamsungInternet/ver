const key = '039bfc7fc798caf5612be3fb9a6094b0';
let flickr_url = 'https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=' + key + '&format=json&nojsoncallback=1';
let img_src = null;
let img_w = 4.5;
let img_h = 3.5;
let spacer = 0.3;
const num_imgs = 50;
let circ_rad = 7;

document.addEventListener('DOMContentLoaded', function() {    
    //creates the layout entity once the scene is loaded
    document.querySelector('a-scene').addEventListener('loaded', function() {
        createImageLayout();
    });
    init();
});



function init(){
    let oReq = new XMLHttpRequest();
    oReq.addEventListener('load', reqListener);
    oReq.open('GET', flickr_url);
    oReq.send();
}

/* flickr image setup */
function reqListener(){
    img_src = JSON.parse(this.responseText);
    console.log(img_src);
    createImages(num_imgs);
}

function createImages(cant){
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

/* image layouts */

function createImageLayout(){
    let layout_container = document.createElement('a-entity');
    layout_container.setAttribute('id', 'layout_container');
    document.querySelector('a-scene').appendChild(layout_container);
}

function setCircleLayout(r){
    circ_rad = r;
    let imgs = document.getElementById('layout_container').children;
    let ang = 360/num_imgs;
    for(i = 0; i < num_imgs; i++){
        imgs[i].object3D.rotateY(toRadians(180-(90-ang * -i)));
        imgs[i].object3D.position.set(circ_rad * Math.cos(toRadians(ang * i)), 2, circ_rad * Math.sin(toRadians(ang * i)));
    }
}

function setGridLayout(pc){
    let imgs = document.getElementById('layout_container').children;
    let f =0, c = 0;
    for(i = 0; i < num_imgs; i++){
        imgs[i].object3D.position.set(c * img_w + spacer, f * img_h, -6);
        imgs[i].object3D.rotation.set(0, 0, 0);
        c++;
        if (c == pc){
            c=0;
            f++;
            console.log(f);
        }
    }
}

/* utils */

function toRadians(degree) {
    return degree * (Math.PI / 180);
};

function toDegree(radians) {
    return radians * (180 / Math.PI);
}