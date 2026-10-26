import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const COVERS = [0x8c2f2f, 0x23406b, 0x2f6b4f, 0x6b3f7a, 0x8a5a1f];
const FILLER = [0x3a3a4a, 0x5a4a2a, 0x2a4a4a, 0x4a2a2a, 0x2a3a5a];

function spineTexture(title, number, color) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 512;
  const g = canvas.getContext("2d");
  g.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
  g.fillRect(0, 0, 128, 512);
  g.strokeStyle = "#e8c872";
  g.lineWidth = 4;
  g.strokeRect(10, 10, 108, 492);
  g.fillStyle = "#f3e2b0";
  g.textAlign = "center";
  g.font = "bold 22px Georgia, serif";
  g.fillText(number, 64, 46);
  g.font = "bold 22px Georgia, serif";
  g.save();
  g.translate(64, 76);
  g.rotate(-Math.PI / 2);
  g.textAlign = "right";
  g.fillText(title.length > 26 ? `${title.slice(0, 25)}…` : title, 0, 10);
  g.restore();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function Bookshelf({ projects, selected = -1, onSelect }) {
  const mount = useRef(null);
  const tipRef = useRef(null);
  const selectedRef = useRef(selected);
  const onSelectRef = useRef(onSelect);
  const [open, setOpen] = useState(false);
  const openRef = useRef(open);
  const focusRef = useRef(-1);
  selectedRef.current = selected;
  onSelectRef.current = onSelect;
  openRef.current = open;

  useEffect(() => {
    const host = mount.current;
    const tip = tipRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
    camera.position.set(0, 4.0, 15);
    camera.lookAt(0, 1.4, 1.2);

    scene.add(new THREE.AmbientLight(0xffe4c0, 0.6));
    const lamp = new THREE.PointLight(0xffb868, 80, 30);
    lamp.position.set(-3, 4.5, 5);
    lamp.castShadow = true;
    scene.add(lamp);
    const rim = new THREE.PointLight(0x8ee5c6, 18, 20);
    rim.position.set(4.5, 3.5, -1.5);
    scene.add(rim);

    const disposables = [];
    const track = (item) => (disposables.push(item), item);
    const woodMaterial = (color) => track(new THREE.MeshStandardMaterial({ color, roughness: 0.75 }));
    const frame = woodMaterial(0x6b4429);
    const dark = woodMaterial(0x4a2f1b);
    const pagesMaterial = track(new THREE.MeshStandardMaterial({ color: 0xefe3c4, roughness: 0.9 }));

    const shelf = new THREE.Group();
    scene.add(shelf);
    const addBox = (w, h, d, material, x, y, z, parent = shelf) => {
      const mesh = new THREE.Mesh(track(new THREE.BoxGeometry(w, h, d)), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    addBox(8.6, 0.2, 1.6, frame, 0, 0.1, 0);
    addBox(8.6, 0.2, 1.6, frame, 0, 2.3, 0);
    addBox(8.6, 0.2, 1.6, frame, 0, 4.5, 0);
    addBox(0.25, 4.8, 1.6, frame, -4.3, 2.4, 0);
    addBox(0.25, 4.8, 1.6, frame, 4.3, 2.4, 0);
    addBox(8.6, 4.8, 0.12, dark, 0, 2.4, -0.75);

    const addBook = (x, shelfY, width, height, color, spineMap, parent = shelf) => {
      const side = track(new THREE.MeshStandardMaterial({ color, roughness: 0.8 }));
      const spine = spineMap ? track(new THREE.MeshStandardMaterial({ map: track(spineMap), roughness: 0.7 })) : side;
      const mesh = new THREE.Mesh(track(new THREE.BoxGeometry(width, height, 1.15)), [pagesMaterial, side, side, side, spine, side]);
      mesh.position.set(x, shelfY + height / 2, 0);
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    };

    const fillerBooks = (startX, endX, shelfY, seed) => {
      let x = startX;
      for (let i = 0; x < endX; i += 1) {
        const width = 0.4 + ((i * 7 + seed) % 4) * 0.07;
        const height = 1.3 + ((i * 5 + seed) % 5) * 0.12;
        addBook(x + width / 2, shelfY, width, height, FILLER[(i + seed) % FILLER.length]);
        x += width + 0.04;
      }
    };

    fillerBooks(-4.1, 4.1, 4.6, 1);
    fillerBooks(-4.1, 4.1, 2.4, 3);
    fillerBooks(-4.1, 4.1, 0.2, 4);

    addBox(8.6, 0.12, 1.7, frame, 0, -1.74, 0);
    addBox(0.25, 1.8, 1.7, frame, -4.3, -0.9, 0);
    addBox(0.25, 1.8, 1.7, frame, 4.3, -0.9, 0);
    addBox(8.6, 1.8, 0.12, dark, 0, -0.9, -0.75);
    addBox(8.4, 0.7, 0.18, frame, 0, -0.35, 0.89);

    const drawer = new THREE.Group();
    shelf.add(drawer);
    const drawerWood = woodMaterial(0x7a4e2d);
    const gold = track(new THREE.MeshStandardMaterial({ color: 0xd8b04a, metalness: 0.8, roughness: 0.3 }));
    const drawerParts = [
      addBox(8.2, 1.0, 0.18, drawerWood, 0, -1.2, 0.89, drawer),
      addBox(0.7, 0.14, 0.16, gold, 0, -1.2, 1.05, drawer),
    ];
    drawerParts.forEach((part) => { part.userData = { kind: "drawer" }; });
    addBox(8.0, 0.1, 1.64, drawerWood, 0, -1.0, 0.05, drawer);
    addBox(0.1, 0.25, 1.64, drawerWood, -4.0, -0.825, 0.05, drawer);
    addBox(0.1, 0.25, 1.64, drawerWood, 4.0, -0.825, 0.05, drawer);
    addBox(8.0, 0.25, 0.1, drawerWood, 0, -0.825, -0.77, drawer);

    let x = -3.2;
    const projectBooks = projects.map((project, i) => {
      const width = 0.7;
      const book = addBook(x + width / 2, -0.95, width, 1.85 - (i % 2) * 0.12, COVERS[i % COVERS.length], spineTexture(project.title, project.number, COVERS[i % COVERS.length]), drawer);
      book.position.z = 0.2;
      book.userData = { kind: "book", index: i, baseY: book.position.y, z: 0, lift: 0 };
      book.visible = false;
      x += width + 0.1;
      return book;
    });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.position.z = w < 600 ? 19 : 15;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    const pointer = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let hovered = -1;
    let overDrawer = false;
    const pick = (event) => {
      const rect = host.getBoundingClientRect();
      ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const targets = openRef.current ? [...projectBooks, ...drawerParts] : drawerParts;
      const hit = raycaster.intersectObjects(targets, false)[0];
      return hit ? hit.object.userData : null;
    };
    const showTip = (text, event) => {
      const rect = host.getBoundingClientRect();
      tip.textContent = text;
      tip.style.left = `${event.clientX - rect.left}px`;
      tip.style.top = `${event.clientY - rect.top - 18}px`;
      tip.hidden = false;
    };
    const setHover = (target, event) => {
      hovered = target?.kind === "book" ? target.index : -1;
      overDrawer = target?.kind === "drawer";
      host.style.cursor = target ? "pointer" : "";
      if (target && selectedRef.current < 0) {
        showTip(overDrawer ? (openRef.current ? "Close the drawer" : "Open the drawer") : `${projects[hovered].number} · ${projects[hovered].title}`, event);
      } else {
        tip.hidden = true;
      }
    };
    const onPointer = (event) => {
      const rect = host.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
      setHover(pick(event), event);
    };
    const onLeave = () => setHover(null);
    const onClick = (event) => {
      const target = pick(event);
      if (target?.kind === "drawer") setOpen((value) => !value);
      else if (target?.kind === "book") onSelectRef.current?.(target.index);
      tip.hidden = true;
    };
    host.addEventListener("pointermove", onPointer, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("click", onClick);

    let openness = 0;
    const clock = new THREE.Clock();
    let frame_ = 0;
    let visible = true;
    const render = () => {
      const dt = Math.min(clock.getDelta(), 0.1);
      const ease = (rate) => 1 - Math.exp(-dt * rate);
      shelf.rotation.y += (pointer.x * 0.35 - shelf.rotation.y) * ease(3);
      shelf.rotation.x += (pointer.y * 0.12 - shelf.rotation.x) * ease(3);
      openness += ((openRef.current ? 1 : 0) - openness) * ease(5);
      drawer.position.z = openness * 1.3;
      projectBooks.forEach((book, i) => {
        const data = book.userData;
        const chosen = selectedRef.current;
        const active = hovered >= 0 ? hovered : focusRef.current;
        const targetZ = chosen === i ? 2.6 : active === i && chosen < 0 ? 0.35 : 0;
        const targetLift = chosen === i ? 0.3 : active === i && chosen < 0 ? 0.12 : 0;
        data.z += (targetZ - data.z) * ease(7);
        data.lift += (targetLift - data.lift) * ease(7);
        book.visible = openness > 0.02;
        book.position.z = 0.2 + data.z;
        book.position.y = data.baseY + data.lift + (openness - 1) * 2.4;
      });
      renderer.render(scene, camera);
      frame_ = requestAnimationFrame(render);
    };
    const start = () => { if (!frame_ && visible && !document.hidden) frame_ = requestAnimationFrame(render); };
    const stop = () => { cancelAnimationFrame(frame_); frame_ = 0; };
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); });
    intersection.observe(host);
    start();

    return () => {
      stop();
      observer.disconnect();
      intersection.disconnect();
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibility);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [projects]);

  return <div className="bookshelf-wrap"><div className="bookshelf-canvas" ref={mount} aria-hidden="true" /><span className="bookshelf-tip" ref={tipRef} hidden></span><div className="bookshelf-controls"><button className="button button-secondary" type="button" aria-expanded={open} aria-controls="shelf-books" onClick={() => setOpen((value) => !value)}>{open ? "Close the drawer" : "Open the drawer"}</button><ul id="shelf-books" aria-label="Projects in the drawer" hidden={!open}>{projects.map((project, i) => <li key={project.number}><button type="button" onClick={() => onSelect?.(i)} onFocus={() => { focusRef.current = i; }} onBlur={() => { focusRef.current = -1; }}>{project.number} {project.title}</button></li>)}</ul></div></div>;
}
