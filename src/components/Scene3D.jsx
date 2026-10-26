import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Scene3D() {
  const mount = useRef(null);

  useEffect(() => {
    const host = mount.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    host.appendChild(renderer.domElement);
    document.body.classList.add("has-3d");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 8;

    const accent = new THREE.Color("#8ee5c6");
    const count = 700;
    const positions = new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 30);
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: accent, size: 0.04, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const shapeMaterial = new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.22 });
    const shapes = [new THREE.IcosahedronGeometry(1.6, 0), new THREE.OctahedronGeometry(1.1, 0), new THREE.TetrahedronGeometry(1.3, 0)].map((geometry, i) => {
      const mesh = new THREE.Mesh(geometry, shapeMaterial);
      mesh.position.set([-5, 5.5, 4][i], [1.5, -1, -3][i], [-2, -4, -1][i]);
      scene.add(mesh);
      return mesh;
    });

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const pointer = { x: 0, y: 0 };
    const onPointer = (event) => {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let frame = 0;
    const clock = new THREE.Clock();
    const render = () => {
      const t = clock.getElapsedTime();
      particles.rotation.y = t * 0.02;
      shapes.forEach((mesh, i) => {
        mesh.rotation.x = t * 0.1 * (i + 1);
        mesh.rotation.y = t * 0.14;
      });
      camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.04;
      camera.position.y += (-pointer.y * 0.8 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    const start = () => { if (!frame) frame = requestAnimationFrame(render); };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      document.body.classList.remove("has-3d");
      particleGeometry.dispose();
      particleMaterial.dispose();
      shapes.forEach((mesh) => mesh.geometry.dispose());
      shapeMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="scene-3d" ref={mount} aria-hidden="true" />;
}
