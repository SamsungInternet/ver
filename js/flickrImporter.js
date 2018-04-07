const key = '039bfc7fc798caf5612be3fb9a6094b0';
let flickr_url = 'https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=' + key + '&format=json&nojsoncallback=1';
let img_src = null;
let img_w = 4.5;
let img_h = 3.5;
let spacer = 0.3;
const num_imgs = 50;
let circ_rad = 4;
const trans_lapse = 500;
const dur_vuelta = 720000;
document.addEventListener('DOMContentLoaded', function() {    
    //creates the layout entity once the scene is loaded
    document.querySelector('a-scene').addEventListener('loaded', function() {
        createImageLayout();
        //deviceDetection();
    });
    init();
});



function init(){
    let oReq = new XMLHttpRequest();
    oReq.addEventListener('load', reqListener);
    oReq.addEventListener("error", transferFailed);
    oReq.open('GET', flickr_url);
    oReq.send();
}

/* flickr image setup */
function reqListener(){
    img_src = JSON.parse(this.responseText);
    console.log(img_src);
    createImages(num_imgs);
    setCircleLayout(4);
    let layout = document.getElementById('layout_container')
    layout.object3D.rotateY(toRadians(180));
    createUI();
}

function transferFailed(evt) {
    let err_img = document.createElement('a-image');
    err_img.setAttribute('src', '#err_img');
    err_img.setAttribute('transparent', 'true');
    err_img.setAttribute('height', 2);
    err_img.setAttribute('width', 2);
    err_img.setAttribute('position', '0 1.5 -3');
    document.querySelector('a-scene').appendChild(err_img);

    console.log('Unable to get the pictures :( -> sad panda');
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

/* UI setup */
function createUI(){
    let init_ui = document.createElement('a-entity');
    init_ui.setAttribute('id', 'splash');
    
    let bg_pnl = document.createElement('a-image');
    bg_pnl.setAttribute('src', '#bg_menu');
    bg_pnl.setAttribute('transparent', 'true');
    bg_pnl.setAttribute('height', 4);
    bg_pnl.setAttribute('width', 2);
    bg_pnl.setAttribute('position', '0 1.5 -3');

    let ins = document.createElement('a-image');
    ins.setAttribute('src', '#ins');
    ins.setAttribute('transparent', 'true');
    ins.setAttribute('height', 1.5);
    ins.setAttribute('width', 1.5);
    ins.setAttribute('position', '0 1.2 -2.8');
    ins.setAttribute('class', 'collidable');
    ins.setAttribute('onClick', 'goToOverview()');

    init_ui.appendChild(bg_pnl);
    init_ui.appendChild(ins);

    document.querySelector('a-scene').appendChild(init_ui);
    rotateLayout();
} 

function moveTo(obj, pos, time){
    //position: obj.object3D.position.set(pos.x, pos.y, pos.z);
    let tween_pos = new AFRAME.TWEEN.Tween(obj.object3D.position).to({x:pos.x, y:pos.y, z:pos.z}, time);
    tween_pos.easing(TWEEN.Easing.Exponential.Out);
    tween_pos.start();
}

function scaleTo(obj, scl, time){
    let tween_scl = new AFRAME.TWEEN.Tween(obj.object3D.scale).to({x:scl.x, y:scl.y, z:scl.z}, time);
    tween_scl.easing(TWEEN.Easing.Exponential.Out);
    tween_scl.start();
}

function rotateLayout(){
    let layout = document.getElementById('layout_container');
    let tween_rot = new AFRAME.TWEEN.Tween(layout.object3D.rotation).to({y:toRadians(359)}, dur_vuelta);
    tween_rot.repeat(Infinity);
    tween_rot.start();
}

function goToBrowse(){
    let layout = document.querySelector('#layout_container');
    moveTo(layout, {x:0, y:0, z:32.1}, 2000);
}

function goToOverview(){
    setCircleLayout(35);
    let splash = document.querySelector('#splash');
    moveTo(splash, {x:0, y:0, z:0}, 1000);
    scaleTo(splash, {x:0.001, y:0.001, z:0.001}, 3000);
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
        //rotation: imgs[i].object3D.rotateY(toRadians(180-(90-ang * -i)));
        let tween_rot = new AFRAME.TWEEN.Tween(imgs[i].object3D.rotation).to({y:toRadians(180-(90-ang * -i))}, trans_lapse);
        tween_rot.easing(TWEEN.Easing.Cubic.Out);
        tween_rot.start();
        //position: imgs[i].object3D.position.set(circ_rad * Math.cos(toRadians(ang * i)), 2, circ_rad * Math.sin(toRadians(ang * i)));
        let tween_pos = new AFRAME.TWEEN.Tween(imgs[i].object3D.position).to({x:(circ_rad * Math.cos(toRadians(ang * i))), y: 1, z:(circ_rad * Math.sin(toRadians(ang * i)))}, trans_lapse);
        tween_pos.easing(TWEEN.Easing.Cubic.Out);
        tween_pos.start();
    }
}

function setGridLayout(pc){
    let imgs = document.getElementById('layout_container').children;
    let f =0, c = 0;
    for(i = 0; i < num_imgs; i++){
        //position: imgs[i].object3D.position.set(c * img_w + spacer, f * img_h, -6);
        let tween_pos = new AFRAME.TWEEN.Tween(imgs[i].object3D.position).to({x:(c * img_w + spacer), y: (f * img_h), z:-6}, trans_lapse);
        tween_pos.easing(TWEEN.Easing.Cubic.Out);
        tween_pos.start();
        imgs[i].object3D.rotation.set(0, 0, 0);
        c++;
        if (c == pc){
            c=0;
            f++;
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