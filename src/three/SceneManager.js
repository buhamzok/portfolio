import * as THREE from 'three';

export function initScene(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Crystalline Cube
  const cubeGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const cubeMat = new THREE.MeshPhysicalMaterial({
    color: 0xFF6B00,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.9,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
  });
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  scene.add(cube);

  // Edges
  const edges = new THREE.EdgesGeometry(cubeGeo);
  const lineMat = new THREE.LineBasicMaterial({ color: 0xFF6B00, transparent: true, opacity: 0.8 });
  const edgeLines = new THREE.LineSegments(edges, lineMat);
  cube.add(edgeLines);

  // Inner Core
  const coreGeo = new THREE.IcosahedronGeometry(0.35, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xFF4500,
    emissive: 0xFF4500,
    emissiveIntensity: 2,
    roughness: 0.4,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  // Lights
  const light1 = new THREE.PointLight(0xFF6B00, 3, 10);
  light1.position.set(2, 2, 2);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xFF6B00, 3, 10);
  light2.position.set(-2, -2, 2);
  scene.add(light2);

  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  // Floating Particles
  const particleCount = 200;
  const particlesGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 8;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = new THREE.PointsMaterial({
    color: 0xFF6B00,
    size: 0.02,
    transparent: true,
    opacity: 0.3,
  });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // State for interactions
  let mouseX = 0, mouseY = 0;
  let targetRotX = -0.3, targetRotY = 0.5;
  let isHovered = false;
  let explosionTime = 0;
  let isExploding = false;
  let particlesBurst = [];
  let animId;

  // Animation loop
  const clock = new THREE.Clock();

  function animate() {
    animId = requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Core pulse
    const pulse = 1 + Math.sin(time * 2) * 0.15;
    core.scale.set(pulse, pulse, pulse);
    coreMat.emissiveIntensity = 2 + Math.sin(time * 3) * 0.5;

    // Cube hover tilt
    if (isHovered) {
      targetRotY = mouseX * 0.5;
      targetRotX = -mouseY * 0.5;
      lineMat.opacity = 1;
      coreMat.emissive.setHex(0xFF6B00);
    } else {
      targetRotY = Math.sin(time * 0.3) * 0.3;
      targetRotX = -0.3 + Math.sin(time * 0.2) * 0.1;
      lineMat.opacity = 0.6;
      coreMat.emissive.setHex(0xFF4500);
    }

    cube.rotation.y += (targetRotY - cube.rotation.y) * 0.05;
    cube.rotation.x += (targetRotX - cube.rotation.x) * 0.05;
    core.rotation.y = -cube.rotation.y;
    core.rotation.x = -cube.rotation.x;

    // Background particles drift
    const posAttr = particles.geometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      posAttr.array[i * 3] += Math.sin(time + i) * 0.001;
      posAttr.array[i * 3 + 1] += Math.cos(time + i) * 0.001;
    }
    posAttr.needsUpdate = true;
    particles.rotation.y = time * 0.05;

    // Explosion particles
    if (isExploding) {
      explosionTime += 0.016;
      particlesBurst.forEach((p) => {
        p.position.add(p.velocity);
        p.velocity.multiplyScalar(0.95);
        p.material.opacity = Math.max(0, 1 - explosionTime * 1.25);
      });
      if (explosionTime > 0.8) {
        isExploding = false;
        particlesBurst.forEach((p) => {
          scene.remove(p);
          p.geometry.dispose();
          p.material.dispose();
        });
        particlesBurst = [];
        core.scale.set(1, 1, 1);
      }
    }

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  function handleResize() {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  // Scroll handler
  function handleScroll(scrollPercent) {
    cube.rotation.z = scrollPercent * Math.PI;
  }

  // Mouse move handler
  function handleMouseMove(x, y) {
    mouseX = x;
    mouseY = y;
    isHovered = true;
  }

  // Click handler
  function handleClick() {
    if (isExploding) return;
    isExploding = true;
    explosionTime = 0;

    const burstCount = 50;
    const burstGeo = new THREE.SphereGeometry(0.03, 4, 4);
    for (let i = 0; i < burstCount; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xFF6B00, transparent: true, opacity: 1 });
      const mesh = new THREE.Mesh(burstGeo, mat);
      mesh.position.copy(core.position);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.05 + Math.random() * 0.1;
      mesh.velocity = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed,
        Math.cos(phi) * speed
      );
      scene.add(mesh);
      particlesBurst.push(mesh);
    }
  }

  // Window resize listener
  window.addEventListener('resize', handleResize);

  return {
    renderer,
    animId,
    handleResize,
    handleScroll,
    handleMouseMove,
    handleClick,
    dispose() {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      particlesBurst.forEach((p) => {
        scene.remove(p);
        p.geometry.dispose();
        p.material.dispose();
      });
      if (renderer) {
        renderer.domElement.remove();
        renderer.dispose();
      }
    }
  };
}

export function destroy(instance) {
  if (!instance) return;
  if (typeof instance.dispose === 'function') {
    instance.dispose();
  }
}
