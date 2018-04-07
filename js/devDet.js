let devDet_scene = null;

let deviceDetection = function(){

  devDet_scene = document.querySelector('a-scene');
  if(navigator.getVRDisplays) { // is webvr supported?
      console.log('WebXR supported');
      // Then get the displays attached to the computer
      navigator.getVRDisplays().then(function(displays) {
        if(displays.length > 0) { //if there are VR devices attached to the machine
          console.log(displays[0].displayName + " attached");

          if(AFRAME.utils.device.isGearVR()){
            //addGearVRControl();
            addLaserControls();
          }
          else if(displays[0].displayName.indexOf('Windows Mixed Reality') != -1){ 
            //addWindowsMixedRealityControllers();
            addLaserControls();
          }
          else if(displays[0].displayName.indexOf('Oculus') != -1)
          {
            //addOculusTouch();
            addLaserControls();
          }
          console.log('added tracked controls');
        }
        else{ // no headset connected
          console.log('no headset available');
          createCursor('');
        }
      });
    }
    else{ // spec not implemented
      createCursor();
      
    }
}

//Creates the cursor. Overrides the default camera.
let createCursor = function(filter){
  //creates camera
  let t_cam = document.querySelector('[camera]')
  //creates and attadches cursor 
  let t_cursor = document.createElement('a-entity');
  t_cursor.setAttribute('cursor', 'fuse:true; fuseTimeout:500');
  t_cursor.setAttribute('position', '0 0 -1');
  t_cursor.setAttribute('geometry', 'primitive: ring; radiusInner: 0.02; radiusOuter: 0.03');
  t_cursor.setAttribute('material', 'color: black; shader: flat');
  t_cursor.setAttribute('raycaster', filter);

  t_cam.appendChild(t_cursor);
  console.log('added cursor');
}

let addLaserControls = function(){
  let t_laserCtrls_L = document.createElement('a-entity');
  t_laserCtrls_L.setAttribute('laser-controls', 'hand:left');
  t_laserCtrls_L.setAttribute('raycaster', 'objects:.telesphere');
  t_laserCtrls_L.setAttribute('collider-check', '');
  document.querySelector('a-scene').appendChild(t_laserCtrls_L);
  let t_laserCtrls_R = document.createElement('a-entity');
  t_laserCtrls_R.setAttribute('laser-controls', 'hand:right');
  t_laserCtrls_R.setAttribute('raycaster', 'objects:.telesphere');
  t_laserCtrls_R.setAttribute('collider-check', '');
  document.querySelector('a-scene').appendChild(t_laserCtrls_R);
}

let addOculusTouch = function(){
  let t_touchCtrls_L = document.createElement('a-entity');
  t_touchCtrls_L.setAttribute('oculus-touch-controls', 'hand:left');
  document.querySelector('a-scene').appendChild(t_touchCtrls_L);
  let t_touchCtrls_R = document.createElement('a-entity');
  t_touchCtrls_R.setAttribute('oculus-touch-controls', 'hand:right');
  document.querySelector('a-scene').appendChild(t_touchCtrls_R);
}

let addGearVRControl = function(){
  let t_gearvrCtrl = document.createElement('a-entity');
  t_gearvrCtrl.setAttribute('gearvr-controls', '');
  document.querySelector('a-scene').appendChild(t_gearvrCtrl);
}

let addWindowsMixedRealityControllers = function(){
  let t_WMRCtrls_L = document.createElement('a-entity');
  t_WMRCtrls_L.setAttribute('windows-motion-controls', 'hand:left');
  document.querySelector('a-scene').appendChild(t_WMRCtrls_L);
  let t_WMRCtrls_R = document.createElement('a-entity');
  t_WMRCtrls_R.setAttribute('windows-motion-controls', 'hand:right');
  document.querySelector('a-scene').appendChild(t_WMRCtrls_R);
}


