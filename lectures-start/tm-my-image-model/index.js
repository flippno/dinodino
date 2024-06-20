const THREE = window.MINDAR.IMAGE.THREE;

let model, maxPredictions

document.addEventListener('DOMContentLoaded', () => {

  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/ar-planets.mind'
    })
    const {renderer, scene, camera} = mindarThree

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material1 = new THREE.MeshBasicMaterial({color: "#32a836", transparent: true, opacity: 0.8});
    const cube1 = new THREE.Mesh(geometry, material1);
    cube1.scene.position.set(0, -0.2, 0);
    cube1.scene.scale.set(0.2, 0.2, 0.2);
    cube1.visible = false

    const material2 = new THREE.MeshBasicMaterial({color: "#7932a8", transparent: true, opacity: 0.8});
    const cube2 = new THREE.Mesh(geometry, material2);
    cube2.scene.position.set(0, -0.2, 0);
    cube2.scene.scale.set(0.2, 0.2, 0.2);
    cube2.visible = false
    
    const anchor = mindarThree.addAnchor(0)
    anchor.group.add(cube1)
    anchor.group.add(cube2)

    const modelURL = "./model.json";
    const metadataURL = "./metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const clock = new THREE.Clock()
    await mindarThree.start()
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta()
      mixer.update(delta)
      renderer.render(scene, camera)
    })

    const video = mindarThree.video
    let skipCount = 0
    const detect = async () => {
      if (skipCount < 10){
        skipCount +=1
        window.requestAnimationFrame(detect)
        return
      }
      skipCount = 0
      
      const prediction = await model.predict(video)
      for (let i = 0; i < maxPredictions; i++) {
        if(prediction[i].className === 'venus' && prediction[i].probability.toFixed(2) >= 0.75){
          console.log("this is venus")
        }
        if(prediction[i].className === 'saturn' && prediction[i].probability.toFixed(2) >= 0.75){
          console.log("this is saturn")
        }
      }
      window.requestAnimationFrame(detect)
    }
    window.requestAnimationFrame(detect)
  }
  start()
})