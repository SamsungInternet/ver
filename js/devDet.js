let devDet_scene = null;

let deviceDetection = function(){

  devDet_scene = document.querySelector('a-scene');
  let dev = -1;
  if(navigator.getVRDisplays) { // is webvr supported?
      console.log('WebXR supported');
      // Then get the displays attached to the computer
      navigator.getVRDisplays().then(function(displays) {
        if(displays.length > 0) { //if there are VR devices attached to the machine
          console.log(displays[0].displayName + " attached");

          if(AFRAME.utils.device.isGearVR()){
            //addGearVRControl();
            addLaserControls('objects: .collidable');
          }
          else if(displays[0].displayName.indexOf('Windows Mixed Reality') != -1){ 
            //addWindowsMixedRealityControllers();
            addLaserControls('objects: .collidable');
          }
          else if(displays[0].displayName.indexOf('Oculus') != -1)
          {
            //addOculusTouch();
            addLaserControls('objects: .collidable');
          }
          console.log('added tracked controls');
        }
        else{ // no headset connected
          console.log('no headset available');
          //createCursor('objects: .collidable', false);
        }
      });
    }
    else{ // spec not implemented
      //createCursor('objects: .collidable', false);
    }
    return dev;
}

//Creates the cursor. Overrides the default camera.
let createCursor = function(filter, fuse){
  //creates camera
  let t_cam = document.querySelector('[camera]')
  //creates and attadches cursor 
  let t_cursor = document.createElement('a-entity');
  t_cursor.setAttribute('cursor', `fuse:${fuse}}; fuseTimeout:500`);
  t_cursor.setAttribute('position', '0 0 -1');
  t_cursor.setAttribute('geometry', 'primitive: ring; radiusInner: 0.02; radiusOuter: 0.03');
  t_cursor.setAttribute('material', 'color: black; shader: flat');
  t_cursor.setAttribute('raycaster', 'interval:900;' + filter);

  t_cam.appendChild(t_cursor);
  console.log('added cursor');
}

let addLaserControls = function(filter){
  let t_laserCtrls_L = document.createElement('a-entity');
  t_laserCtrls_L.setAttribute('laser-controls', 'hand:left');
  t_laserCtrls_L.setAttribute('raycaster', 'interval:900;'+filter);
  t_laserCtrls_L.setAttribute('collider-check', '');
  document.querySelector('a-scene').appendChild(t_laserCtrls_L);
  let t_laserCtrls_R = document.createElement('a-entity');
  t_laserCtrls_R.setAttribute('laser-controls', 'hand:right');
  t_laserCtrls_R.setAttribute('raycaster', 'interval:900;'+filter);
  t_laserCtrls_R.setAttribute('collider-check', '');
  document.querySelector('a-scene').appendChild(t_laserCtrls_R);
}

let addGearVRControl = function(){
  let t_gearvrCtrl = document.createElement('a-entity');
  t_gearvrCtrl.setAttribute('gearvr-controls', '');
  document.querySelector('a-scene').appendChild(t_gearvrCtrl);
}

