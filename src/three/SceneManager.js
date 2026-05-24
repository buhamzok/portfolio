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

  // ─── Sentient Cube ────────────────────────────────────────────
  const cubeGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
  const cubeMat = new THREE.MeshPhysicalMaterial({
    color: 0xFF6B00,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.85,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
  });
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  scene.add(cube);

  // Edges
  const edges = new THREE.EdgesGeometry(cubeGeo);
  const lineMat = new THREE.LineBasicMaterial({ color: 0xFF6B00, transparent: true, opacity: 0.6 });
  const edgeLines = new THREE.LineSegments(edges, lineMat);
  cube.add(edgeLines);

  // Inner Core (the "eye")
  const coreGeo = new THREE.IcosahedronGeometry(0.32, 2);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xFF4500,
    emissive: 0xFF4500,
    emissiveIntensity: 2,
    roughness: 0.3,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  // Outer glow shell (grows when excited)
  const glowGeo = new THREE.IcosahedronGeometry(0.55, 2);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xFF6B00,
    transparent: true,
    opacity: 0.0,
    wireframe: true,
  });
  const glowShell = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glowShell);

  // Lights
  const light1 = new THREE.PointLight(0xFF6B00, 2, 12);
  light1.position.set(2, 2, 2);
  scene.add(light1);
  const light2 = new THREE.PointLight(0xFF6B00, 2, 12);
  light2.position.set(-2, -2, 2);
  scene.add(light2);
  const ambient = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambient);

  // Floating Particles
  const particleCount = 200;
  const particlesGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) positions[i] = (Math.random() - 0.5) * 8;
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = new THREE.PointsMaterial({ color: 0xFF6B00, size: 0.02, transparent: true, opacity: 0.25 });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // ─── State ────────────────────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  let rawMouseX = window.innerWidth / 2;
  let rawMouseY = window.innerHeight / 2;
  let prevMouseX = rawMouseX;
  let prevMouseY = rawMouseY;
  let mouseSpeed = 0;
  let hoverTarget = null; // element tagName
  let idleTime = 0;
  let isExploding = false, explosionTime = 0;
  let particlesBurst = [];
  let searchPhase = 0;
  let animId;
  const clock = new THREE.Clock();

  // Smooth rotation targets
  let curRotX = -0.3, curRotY = 0.5, curRotZ = 0;
  let targetRotX = -0.3, targetRotY = 0.5, targetRotZ = 0;

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const dt = clock.getDelta(); // just to advance

    // ── Mouse speed decay ──
    mouseSpeed *= 0.92;
    idleTime += 0.016;

    // ── Determine target rotation from SCREEN cursor position ──
    // Map full page coordinates to rotation angles so cube ALWAYS looks at the cursor
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    // Centered coordinates [-1,1]
    const sx = ((rawMouseX / screenW) * 2 - 1);
    const sy = -((rawMouseY / screenH) * 2 - 1);

    // Excitement factor: how fast/energetic is cursor movement
    const excitement = Math.min(mouseSpeed / 30, 1); // 0..1

    if (idleTime > 2.5) {
      // Searching / idle mode — animate gentle wandering
      searchPhase += 0.02;
      targetRotY = Math.sin(searchPhase) * 0.6;
      targetRotX = Math.sin(searchPhase * 0.7) * 0.4 - 0.2;
      targetRotZ = Math.sin(searchPhase * 0.4) * 0.15;
    } else {
      // Looking directly at cursor
      targetRotY = sx * 0.9; // gaze left-right
      targetRotX = sy * 0.7; // gaze up-down
      targetRotZ = sx * 0.15; // slight head tilt
    }

    // Lerp toward target (springy follow)
    const lerpFactor = 0.04 + excitement * 0.08;
    curRotX += (targetRotX - curRotX) * lerpFactor;
    curRotY += (targetRotY - curRotY) * lerpFactor;
    curRotZ += (targetRotZ - curRotZ) * lerpFactor;

    // Apply to cube
    cube.rotation.x = curRotX;
    cube.rotation.y = curRotY;
    cube.rotation.z = curRotZ;

    // Core (eye) mimics but more reactive
    const eyeLag = 0.08 + excitement * 0.12;
    core.rotation.x += (targetRotX - core.rotation.x) * eyeLag;
    core.rotation.y += (targetRotY - core.rotation.y) * eyeLag;

    // Core position shifts slightly toward cursor (parallax eyeball feel)
    const pupilShift = 0.08 + excitement * 0.1;
    core.position.x += (sx * pupilShift - core.position.x) * 0.1;
    core.position.y += (sy * pupilShift - core.position.y) * 0.1;

    // ── Breathing / Pulse ──
    const basePulse = 1 + Math.sin(t * 2) * 0.08;
    const excitedPulse = 1 + Math.sin(t * (5 + excitement * 5)) * (0.12 + excitement * 0.1);
    core.scale.setScalar(excitedPulse);

    // Core glow intensifies when interacting with buttons/links
    let targetEmissive = 1.8 + Math.sin(t * 3) * 0.4;
    if (hoverTarget === 'A' || hoverTarget === 'BUTTON') targetEmissive = 4.5;
    else if (hoverTarget) targetEmissive = 3.2;
    else if (excitement > 0.3) targetEmissive += excitement * 2;
    coreMat.emissiveIntensity += (targetEmissive - coreMat.emissiveIntensity) * 0.08;

    // Edge glow follows excitement
    const targetEdgeOpacity = (hoverTarget === 'A' || hoverTarget === 'BUTTON') ? 1.0 : (excitement > 0.15 ? 0.9 : 0.5);
    lineMat.opacity += (targetEdgeOpacity - lineMat.opacity) * 0.06;

    // Glow shell expands on excitement
    const targetGlow = excitement > 0.2 || hoverTarget ? 0.18 : 0.0;
    glowMat.opacity += (targetGlow - glowMat.opacity) * 0.05;
    glowShell.rotation.x += 0.01;
    glowShell.rotation.y += 0.015;

    // ── Background particles ──
    const posAttr = particles.geometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      posAttr.array[i * 3] += Math.sin(t + i) * 0.0006;
      posAttr.array[i * 3 + 1] += Math.cos(t + i) * 0.0006;
    }
    posAttr.needsUpdate = true;
    particles.rotation.y = t * 0.04;

    // ── Explosion effect ──
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

  // ─── Handlers ─────────────────────────────────────────────────
  function handleResize() {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function handleScroll(scrollPercent) {
    // subtle roll from scroll
    curRotZ += (scrollPercent * Math.PI * 0.3 - curRotZ) * 0.02;
  }

  function handleMouseMove(x, y, rx, ry) {
    rawMouseX = rx;
    rawMouseY = ry;
    const dx = rx - prevMouseX;
    const dy = ry - prevMouseY;
    mouseSpeed = Math.sqrt(dx * dx + dy * dy);
    prevMouseX = rx;
    prevMouseY = ry;
    idleTime = 0;

    // For in-canvas interaction we still keep NDC values if needed later
    mouseX = x;
    mouseY = y;
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
