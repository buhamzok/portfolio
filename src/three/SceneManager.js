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
    transmission: 0.85,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
  });
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  scene.add(cube);

  // Edges
  const edges = new THREE.EdgesGeometry(cubeGeo);
  const lineMat = new THREE.LineBasicMaterial({ color: 0xFF6B00, transparent: true, opacity: 0.5 });
  const edgeLines = new THREE.LineSegments(edges, lineMat);
  cube.add(edgeLines);

  // Inner Core (the eye) — this should move TO the face you're looking at
  const coreGeo = new THREE.IcosahedronGeometry(0.28, 2);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xFF4500,
    emissive: 0xFF4500,
    emissiveIntensity: 2.5,
    roughness: 0.3,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  // Outer glow shell
  const glowGeo = new THREE.IcosahedronGeometry(0.52, 2);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xFF6B00,
    transparent: true,
    opacity: 0.0,
    wireframe: true,
  });
  const glowShell = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glowShell);

  // Lights
  const light1 = new THREE.PointLight(0xFF6B00, 2.5, 14);
  light1.position.set(2, 2, 3);
  scene.add(light1);
  const light2 = new THREE.PointLight(0xFF6B00, 2.5, 14);
  light2.position.set(-2, -2, 3);
  scene.add(light2);
  const ambient = new THREE.AmbientLight(0xffffff, 0.22);
  scene.add(ambient);

  // Floating Particles
  const particleCount = 200;
  const particlesGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) positions[i] = (Math.random() - 0.5) * 8;
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = new THREE.PointsMaterial({ color: 0xFF6B00, size: 0.02, transparent: true, opacity: 0.22 });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // ─── STATE ──────────────────────────────────────────────────
  let rawMouseX = window.innerWidth / 2;
  let rawMouseY = window.innerHeight / 2;
  let smoothMouseX = rawMouseX;
  let smoothMouseY = rawMouseY;
  let prevMouseX = rawMouseX;
  let prevMouseY = rawMouseY;
  let rawSpeed = 0;
  let smoothSpeed = 0;
  let hoverTarget = null;
  let idleTime = 0;
  let isExploding = false, explosionTime = 0;
  let particlesBurst = [];
  let searchPhase = 0;
  let animId;
  const clock = new THREE.Clock();

  let curRotX = -0.3, curRotY = 0.5, curRotZ = 0;
  let targetRotX = -0.3, targetRotY = 0.5, targetRotZ = 0;

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // ── Smooth cursor (prevents jitter) ──
    smoothMouseX += (rawMouseX - smoothMouseX) * 0.18;
    smoothMouseY += (rawMouseY - smoothMouseY) * 0.18;

    // Smooth speed
    rawSpeed *= 0.88;
    smoothSpeed += (rawSpeed - smoothSpeed) * 0.12;

    idleTime += 0.016;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const sx = ((smoothMouseX / screenW) * 2 - 1);
    const sy = -((smoothMouseY / screenH) * 2 - 1);

    const excitement = Math.min(smoothSpeed / 25, 1);

    if (idleTime > 2.5) {
      searchPhase += 0.016;
      targetRotY = Math.sin(searchPhase * 0.5) * 0.6;
      targetRotX = Math.sin(searchPhase * 0.35) * 0.4 - 0.2;
      targetRotZ = Math.sin(searchPhase * 0.25) * 0.15;
    } else {
      targetRotY = sx * 0.85;
      targetRotX = -sy * 0.65; // inverted Y: cursor down = look down
      targetRotZ = sx * 0.12;
    }

    // ── Cube follow — snappier lerp ──
    const cubeLerp = 0.12 + excitement * 0.10;
    curRotX += (targetRotX - curRotX) * cubeLerp;
    curRotY += (targetRotY - curRotY) * cubeLerp;
    curRotZ += (targetRotZ - curRotZ) * cubeLerp;

    cube.rotation.x = curRotX;
    cube.rotation.y = curRotY;
    cube.rotation.z = curRotZ;

    // ── CORE MOVEMENT (parallax eyeball on front face) ──
    // Core sits NEAR the front face of the cube but shifts to "look" at cursor
    // We compute a shifted position on the Z+ face of the cube
    const maxShift = 0.35 + excitement * 0.1;
    const targetCoreX = sx * maxShift;
    const targetCoreY = -sy * maxShift;

    // Smooth parallax shift (faster than cube so it feels alive)
    core.position.x += (targetCoreX - core.position.x) * 0.18;
    core.position.y += (targetCoreY - core.position.y) * 0.18;

    // Core stays slightly in front of cube face for depth
    const targetCoreZ = 0.6 + excitement * 0.15;
    core.position.z += (targetCoreZ - core.position.z) * 0.18;

    // Core tilts toward cursor independently (more alive)
    core.rotation.x = curRotX * 0.75 - sy * 0.35;
    core.rotation.y = curRotY * 0.75 + sx * 0.35;

    // ── Breathing / Pulse ──
    const pulse = 1 + Math.sin(t * 2.2) * 0.06 + Math.sin(t * (4 + excitement * 4)) * (0.08 + excitement * 0.08);
    core.scale.setScalar(pulse);

    // ── Emissive glow tracking ──
    let targetEmissive = 2.0 + Math.sin(t * 2.8) * 0.5;
    if (hoverTarget === 'A' || hoverTarget === 'BUTTON') targetEmissive = 5.0;
    else if (hoverTarget) targetEmissive = 3.5;
    else if (excitement > 0.2) targetEmissive += excitement * 2.5;
    coreMat.emissiveIntensity += (targetEmissive - coreMat.emissiveIntensity) * 0.10;

    // Edge glow
    const targetEdgeOpacity = (hoverTarget === 'A' || hoverTarget === 'BUTTON') ? 1.0 : (excitement > 0.12 ? 0.85 : 0.45);
    lineMat.opacity += (targetEdgeOpacity - lineMat.opacity) * 0.08;

    // Glow shell
    const targetGlow = excitement > 0.15 || hoverTarget ? 0.22 : 0.0;
    glowMat.opacity += (targetGlow - glowMat.opacity) * 0.06;
    glowShell.rotation.x += 0.01;
    glowShell.rotation.y += 0.015;

    // ── Background particles ──
    const posAttr = particles.geometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      posAttr.array[i * 3] += Math.sin(t + i) * 0.0005;
      posAttr.array[i * 3 + 1] += Math.cos(t + i) * 0.0005;
    }
    posAttr.needsUpdate = true;
    particles.rotation.y = t * 0.035;

    // ── Explosion ──
    if (isExploding) {
      explosionTime += 0.016;
      particlesBurst.forEach((p) => {
        p.position.add(p.velocity);
        p.velocity.multiplyScalar(0.95);
        p.material.opacity = Math.max(0, 1 - explosionTime * 1.25);
      });
      if (explosionTime > 0.8) {
        isExploding = false;
        particlesBurst.forEach((p) => { scene.remove(p); p.geometry.dispose(); p.material.dispose(); });
        particlesBurst = [];
      }
    }

    renderer.render(scene, camera);
  }
  animate();

  function handleResize() {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function handleScroll(scrollPercent) {
    curRotZ += (scrollPercent * Math.PI * 0.3 - curRotZ) * 0.02;
  }

  function handleMouseMove(x, y, rx, ry) {
    rawMouseX = rx;
    rawMouseY = ry;
    const dx = rx - prevMouseX;
    const dy = ry - prevMouseY;
    rawSpeed = Math.sqrt(dx * dx + dy * dy);
    prevMouseX = rx;
    prevMouseY = ry;
    idleTime = 0;
  }

  function handleMouseOver(el) {
    hoverTarget = el;
    idleTime = 0;
  }

  function handleMouseOut() {
    hoverTarget = null;
  }

  function handleClick() {
    if (isExploding) return;
    isExploding = true;
    explosionTime = 0;
    idleTime = 0;
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

  window.addEventListener('resize', handleResize);

  return {
    renderer,
    animId,
    handleResize,
    handleScroll,
    handleMouseMove,
    handleMouseOver,
    handleMouseOut,
    handleClick,
    dispose() {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      particlesBurst.forEach((p) => { scene.remove(p); p.geometry.dispose(); p.material.dispose(); });
      if (renderer) { renderer.domElement.remove(); renderer.dispose(); }
    }
  };
}

export function destroy(instance) {
  if (!instance) return;
  if (typeof instance.dispose === 'function') instance.dispose();
}
