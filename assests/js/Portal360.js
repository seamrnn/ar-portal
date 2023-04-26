THREEx.Portal360 = function (url, doorWidth, doorHeight) {
    this._url = url
    this._doorWidth = doorWidth
    this._doorHeight = doorHeight

    var createPortalScene = function () {
        var scene = new THREE.Scene()

        var texture = new THREE.TextureLoader().load(url)
        texture.mapping = THREE.UVMapping

        var material = new THREE.MeshBasicMaterial({map: texture})
        material.side = THREE.DoubleSide

        var geometry = new THREE.SphereGeometry(500, 60, 40)
        geometry.scale(-1, 1, 1)

        var mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        return scene
    }

    this.object3d = new THREE.Group()

    var doorFrameGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, 0.1)
    var doorFrameMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.5})
    var doorFrameMesh = new THREE.Mesh(doorFrameGeometry, doorFrameMaterial)
    doorFrameMesh.position.y = -(doorHeight / 2)
    this.object3d.add(doorFrameMesh)

    this._portalScene = createPortalScene()
    this._portalCamera = new THREE.PerspectiveCamera()

    this.object3d.add(this._portalCamera)
}

THREEx.Portal360.prototype.update = function () {
    var renderer = this.el.sceneEl.renderer
    var camera = this.el.sceneEl.camera

    var position = new THREE.Vector3()
    var quaternion = new THREE.Quaternion()
    var scale = new THREE.Vector3()

    this.object3d.matrixWorld.decompose(position, quaternion, scale)

    this._portalCamera.position.copy(position)

    this._portalCamera.quaternion.copy(quaternion)

    var width = renderer.domElement.width
    var height = renderer.domElement.height

    renderer.setViewport(0, 0, width, height)

    var doorFrameWorldPosition = new THREE.Vector3()
    doorFrameWorldPosition.setFromMatrixPosition(this.object3d.matrixWorld)

    var targetPosition = new THREE.Vector3()
    targetPosition.setFromMatrixPosition(this._portalScene.matrixWorld)

    var distance = doorFrameWorldPosition.distanceTo(camera.position)

    var shouldRenderPortal = distance > 0 && distance < 5

    if (shouldRenderPortal) {
        var portalWidth = this._doorWidth * width / (distance * 2)
        var portalHeight = this._doorHeight * height / (distance * 2)

        renderer.setViewport(width / 2 - portalWidth / 2, height / 2 - portalHeight / 2, portalWidth, portalHeight)

        this._portalCamera.aspect = portalWidth / portalHeight
        this._portalCamera.updateProjectionMatrix()

        renderer.render(this._portalScene, this._portalCamera)
    }
}
