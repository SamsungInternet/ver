const key = '039bfc7fc798caf5612be3fb9a6094b0';
let flickr_url = 'https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=' + key + '&format=json&nojsoncallback=1';
let img_src = null;
let img_w = 4.5;
let img_h = 3.5;
let spacer = 0.3;
const num_imgs = 50;
let circ_rad = 4;
let circ_rad_splash= 4;
const trans_lapse = 500;
const dur_vuelta = 600000;
let ui_splash = null;
let ui_overview = null;
let ui_layout = null;
let ui_select = null;
let ui_browse = null;
let rot_anim = null;


document.addEventListener('DOMContentLoaded', function() {    
    //creates the layout entity once the scene is loaded
    document.querySelector('a-scene').addEventListener('loaded', function() {
        createUI();
        deviceDetection();
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
    layout.object3D.rotateY(toRadians(180));

    goToSplash();
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
        ui_layout.appendChild(img);
    }
}

/* UI setup */
function createUI(){
    ui_splash = createSplashUI();
    ui_overview = createOverviewUI()
    ui_layout = createImageLayout();
    ui_select = createSelectUI();
    ui_browse = createBrowseUI();
} 

function createSplashUI(){
    // splash screen
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

    return init_ui;    
}

function createBrowseUI(){
    // splash screen
    let browse_ui = document.createElement('a-entity');
    browse_ui.setAttribute('id', 'browse');

    let prev = document.createElement('a-image');
    prev.setAttribute('src', '#prev');
    prev.setAttribute('transparent', 'true');
    prev.setAttribute('height', .6);
    prev.setAttribute('width', .6);
    prev.setAttribute('position', '-2 1.2 -2.8');
    prev.setAttribute('class', 'collidable');
    prev.setAttribute('onClick', 'nextPicture()');
    let next = document.createElement('a-image');
    next.setAttribute('src', '#next');
    next.setAttribute('transparent', 'true');
    next.setAttribute('height', .6);
    next.setAttribute('width', .6);
    next.setAttribute('position', '2 1.2 -2.8');
    next.setAttribute('class', 'collidable');
    next.setAttribute('onClick', 'prevPicture()');
    browse_ui.appendChild(prev);
    browse_ui.appendChild(next);
    return browse_ui;    
}

function createSelectUI(){
    // splash screen
    let browse_ui = document.createElement('a-entity');
    browse_ui.setAttribute('id', 'browse');

    return browse_ui;    
}

function createOverviewUI(){
    // overview scene
    let ov_ui = document.createElement('a-entity');
    ov_ui.setAttribute('id', 'overview');

    let bg_pnl = document.createElement('a-image');
    bg_pnl.setAttribute('src', '#bg_pnl');
    bg_pnl.setAttribute('transparent', 'true');
    bg_pnl.setAttribute('height', 2);
    bg_pnl.setAttribute('width', 4);
    bg_pnl.setAttribute('position', '0 1.1 -3');

    let opt_trend = document.createElement('a-image');
    opt_trend.setAttribute('src', '#trend');
    opt_trend.setAttribute('transparent', 'true');
    opt_trend.setAttribute('height', 1.5);
    opt_trend.setAttribute('width', 1.5);
    opt_trend.setAttribute('position', '-1 1.2 -2.8');
    opt_trend.setAttribute('class', 'collidable');
    opt_trend.setAttribute('onClick', 'goToBrowse()');
    let opt_search = document.createElement('a-image');
    opt_search.setAttribute('src', '#search');
    opt_search.setAttribute('transparent', 'true');
    opt_search.setAttribute('height', 1.5);
    opt_search.setAttribute('width', 1.5);
    opt_search.setAttribute('position', '1 1.2 -2.8');
    opt_search.setAttribute('class', 'collidable');
    //opt_search.setAttribute('onClick', 'goToOverview()');
    ov_ui.appendChild(bg_pnl);
    ov_ui.appendChild(opt_trend);
    ov_ui.appendChild(opt_search);
    return ov_ui;
}

function moveTo(obj, pos, time){
    let tween_pos = new AFRAME.TWEEN.Tween(obj.object3D.position).to({x:pos.x, y:pos.y, z:pos.z}, time);
    tween_pos.easing(TWEEN.Easing.Exponential.Out);
    tween_pos.start();
}

function scaleTo(obj, scl, time){
    let tween_scl = new AFRAME.TWEEN.Tween(obj.object3D.scale).to({x:scl.x, y:scl.y, z:scl.z}, time);
    tween_scl.easing(TWEEN.Easing.Exponential.Out);
    tween_scl.start();
}

function goToBrowse(){
    document.querySelector('a-scene').appendChild(ui_browse);
    layout.rotate.stop();
    layout.object3D.rotation.set(toRadians(0), toRadians(180/num_imgs), toRadians(0), 'XYZ');
    layout.setCircle(35);
    moveTo(ui_layout, {x:0, y:0, z:32.1}, 2000);
    screenTransition(ui_overview, ui_browse, 500);
}

function goToOverview(){
    moveTo(ui_overview, {x:0, y:50, z:0}, 0);
    document.querySelector('a-scene').appendChild(ui_overview);
    layout.rotate.start();
    layout.setCircle(35);
    screenTransition(ui_splash, ui_overview, 500);
}

function goToSplash(){
    document.querySelector('a-scene').appendChild(ui_splash);
    layout.setCircle(circ_rad_splash);
    layout.rotate.start();
}

function screenTransition(ui_out, ui_in, time){
    moveTo(ui_out, {x:0, y:-100, z:0}, time);
    scaleTo(ui_out, {x:0.0001, y:0.001, z:0.001}, time);
    moveTo(ui_in, {x:0, y:0, z:0}, time);
    scaleTo(ui_in, {x:1, y:1, z:1}, time);
}

function nextPicture(){
    let currentAngle = toDegrees(ui_layout.object3D.rotation.y);
    let nextPicAng = currentAngle - 360/num_imgs;
    let tween_next = new AFRAME.TWEEN.Tween(ui_layout.object3D.rotation).to({y:toRadians(nextPicAng)}, trans_lapse/2);
    tween_next.easing(TWEEN.Easing.Cubic.Out);
    tween_next.start();
}

function prevPicture(){
    let currentAngle = toDegrees(ui_layout.object3D.rotation.y);
    let nextPicAng = 360/num_imgs + currentAngle;
    let tween_prev = new AFRAME.TWEEN.Tween(ui_layout.object3D.rotation).to({y:toRadians(nextPicAng)}, trans_lapse/2);
    tween_prev.easing(TWEEN.Easing.Cubic.Out);
    tween_prev.start();
}


/* image layouts */

function createImageLayout(){
    let layout = document.createElement('a-entity');
    layout.setAttribute('id', 'layout');
    layout.rotate = new AFRAME.TWEEN.Tween(layout.object3D.rotation).to({y:toRadians(359)}, dur_vuelta);
    layout.setCircle = function(r){
        circ_rad = r;
        let imgs = ui_layout.children;
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
    };
    layout.setGrid = function(pc){
        let imgs =ui_layout.children;
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
    };
    document.querySelector('a-scene').appendChild(layout);
    
    return layout;
}