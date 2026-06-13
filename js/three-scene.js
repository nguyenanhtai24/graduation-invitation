// ==========================================================================
// THREE.JS 3D BACKGROUND AND PARTICLES
// ==========================================================================

class ThreeBg {
  constructor() {
    this.canvas = document.getElementById('three-bg');
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    
    this.particles = null;
    this.particleCount = 1200;
    
    // Mouse coordinates tracking
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    
    // 3D floating models
    this.floatingModels = [];

    this.init();
  }

  init() {
    // 1. Create Scene, Camera, and Renderer
    this.scene = new THREE.Scene();
    
    // Add atmospheric fog for depth
    this.scene.fog = new THREE.FogExp2(0x050914, 0.015);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 8;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Add Lights
    const ambientLight = new THREE.AmbientLight(0x111625, 1.5);
    this.scene.add(ambientLight);

    // Warm gold point light simulating light rays scanning
    this.lightRay = new THREE.PointLight(0xd4af37, 2, 30);
    this.lightRay.position.set(5, 5, 5);
    this.scene.add(this.lightRay);

    // 3. Create Procedural Glowing Particle Texture
    const particleTexture = this.createCircleTexture();

    // 4. Create 3D Gold Particles
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const scale = new Float32Array(this.particleCount);

    for (let i = 0; i < this.particleCount * 3; i += 3) {
      // Spread particles in a large 3D sphere/box
      positions[i] = (Math.random() - 0.5) * 25;     // X
      positions[i + 1] = (Math.random() - 0.5) * 20; // Y
      positions[i + 2] = (Math.random() - 0.5) * 15; // Z
      
      scale[i / 3] = Math.random();
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Elegant translucent gold particle material
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.16,
      map: particleTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.particles);

    // 5. Add minimal 3D floating academic shapes
    this.createFloatingShapes();

    // 6. Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    
    // Support mobile gyroscope or touch motion
    window.addEventListener('touchmove', (e) => this.onTouchMove(e));

    // 7. Start Animation Loop
    this.animate();
  }

  // Generate a smooth circular glowing gradient texture in canvas
  createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(244, 219, 133, 0.8)'); // Light gold glow
    grad.addColorStop(0.5, 'rgba(212, 175, 55, 0.3)');  // Primary gold fade
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Create floating 3D objects in the background
  createFloatingShapes() {
    // We create 3 minimal 3D Graduation Caps
    const capMaterial = new THREE.MeshPhongMaterial({
      color: 0x111b30,
      specular: 0xd4af37,
      shininess: 30,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    
    const goldCapDetailMat = new THREE.MeshPhongMaterial({
      color: 0xd4af37,
      specular: 0xffffff,
      shininess: 50,
      transparent: true,
      opacity: 0.7
    });

    for (let i = 0; i < 3; i++) {
      const capGroup = new THREE.Group();
      
      // Board (flat rotated square)
      const boardGeo = new THREE.BoxGeometry(1.6, 0.04, 1.6);
      const board = new THREE.Mesh(boardGeo, capMaterial);
      board.rotation.y = Math.PI / 4;
      capGroup.add(board);

      // Skull Cap (cylinder underneath)
      const skullGeo = new THREE.CylinderGeometry(0.5, 0.55, 0.35, 16);
      const skull = new THREE.Mesh(skullGeo, capMaterial);
      skull.position.y = -0.2;
      capGroup.add(skull);

      // Small gold button on top
      const buttonGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 8);
      const button = new THREE.Mesh(buttonGeo, goldCapDetailMat);
      button.position.y = 0.04;
      capGroup.add(button);
      
      // Position them deep in the screen boundaries
      capGroup.position.set(
        (i - 1) * 7 + (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 6,
        -5 - Math.random() * 5
      );
      
      // Random rotation
      capGroup.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        0
      );
      
      // Store drift variables
      capGroup.userData = {
        speedX: (Math.random() - 0.5) * 0.003,
        speedY: (Math.random() - 0.5) * 0.003,
        rotSpeedX: 0.002 + Math.random() * 0.004,
        rotSpeedY: 0.002 + Math.random() * 0.004
      };

      this.scene.add(capGroup);
      this.floatingModels.push(capGroup);
    }
  }

  onMouseMove(event) {
    // Normalize coordinates from -1 to 1
    this.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onTouchMove(event) {
    if (event.touches.length > 0) {
      this.targetMouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.targetMouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.0008;

    // Smooth lerp for mouse interactions (simulating fluid inertia)
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.08;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.08;

    // 1. Animate particles group slightly based on mouse
    if (this.particles) {
      this.particles.rotation.y = time * 0.03 + this.mouseX * 0.15;
      this.particles.rotation.x = time * 0.02 + this.mouseY * 0.15;
    }

    // 2. Animate floating 3D caps
    this.floatingModels.forEach(cap => {
      // Rotation
      cap.rotation.x += cap.userData.rotSpeedX;
      cap.rotation.y += cap.userData.rotSpeedY;
      
      // Float drift up & down
      cap.position.y += Math.sin(time + cap.position.x) * 0.004;
      cap.position.x += cap.userData.speedX;
      
      // Mouse Parallax displacement
      cap.position.x += (this.mouseX * 0.5 - cap.position.x * 0.05) * 0.02;
      cap.position.y += (this.mouseY * 0.5 - cap.position.y * 0.05) * 0.02;

      // Wrap-around bounds check
      if (Math.abs(cap.position.x) > 12) {
        cap.position.x = -cap.position.x;
      }
    });

    // 3. Move point light to simulate shifting rays
    if (this.lightRay) {
      this.lightRay.position.x = Math.sin(time) * 8;
      this.lightRay.position.y = Math.cos(time * 0.8) * 8;
      this.lightRay.position.z = 5 + Math.sin(time * 0.5) * 3;
    }

    // 4. Subtle camera sway based on mouse
    this.camera.position.x += (this.mouseX * 1.5 - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.mouseY * 1.5 - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate background on script load
document.addEventListener('DOMContentLoaded', () => {
  window.threeBackground = new ThreeBg();
});
