var THREEx = THREEx || {}

THREEx.Portal360 = function (url, doorWidth, doorHeight) {
  var scope = this
  doorWidth = doorWidth === undefined ? 1.5 : doorWidth
  doorHeight = doorHeight === undefined ? 2.2 : doorHeight

  var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(doorWidth, doorHeight), new THREE.MeshBasicMaterial({
    colorWrite: false
  }))
  mesh.name = 'portal-portal'
  this.object3d = mesh
  // expose a way to change the url of the texture
  this.setURL = function (url) {
    textureLoader.load(url, function(texture){
      mesh.material.map = texture
    })
  }
  // load the texture
  var textureLoader = new THREE.TextureLoader()
  this.setURL(url)

  // to fit in the room, position the opposite of where the camera is
  var divPosition = document.getElementById("camera").object3D.position;
  mesh.position.set(-divPosition.x, -doorHeight/2, -divPosition.z)
  mesh.lookAt(new THREE.Vector3(divPosition.x,0,divPosition.z))

  //////////////////////////////////////////////////////////////////////////////////
  //		render the portal only on the depth
  //////////////////////////////////////////////////////////////////////////////////
  // set the portal in the depth material
  var depthMaterial = new THREE.MeshDepthMaterial()
  depthMaterial.depthWrite = false
  depthMaterial.depthTest = true
  mesh.material = depthMaterial

  // disable rendering of the object in normal render
  this.originalVisible = null
  this.beforeRender = function (renderer) {
    this.originalVisible = mesh.visible
    mesh.visible = false
  }
  this.afterRender = function (renderer) {
    mesh.visible = this.originalVisible
  }

  //////////////////////////////////////////////////////////////////////////////////
  //		Handle position/size updates
  //////////////////////////////////////////////////////////////////////////////////
  this.update = function () {
    var divPosition = document.getElementById("camera").object3D.position;
    mesh.position.set(-divPosition.x, -doorHeight/2, -divPosition.z)
    mesh.lookAt(new THREE.Vector3(divPosition.x,0,divPosition.z))
  }
}
