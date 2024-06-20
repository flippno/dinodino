import {loadGLTF} from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/planets.mind'
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const earth = await loadGLTF('../../assets/models/planets/Earth.glb');
    earth.scene.scale.set(0.1, 0.1, 0.1);
    earth.scene.position.set(0, -0.4, 0);

    const venus = await loadGLTF('../../assets/models/planets/Venus.glb');
    venus.scene.scale.set(0.1, 0.1, 0.1);
    venus.scene.position.set(0, -0.4, 0);

    const earthAnchor = mindarThree.addAnchor(0);
    earthAnchor.group.add(earth.scene);

    const venusAnchor = mindarThree.addAnchor(7);
    venusAnchor.group.add(venus.scene);

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
