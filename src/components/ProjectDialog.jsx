import { useEffect, useRef } from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectDialog({ project, onClose }) {
  const closeButton = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    closeButton.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (previous && document.contains(previous)) previous.focus();
    };
  }, [onClose]);

  return <div className="dialog-backdrop" onClick={onClose}><div className="dialog-panel" role="dialog" aria-modal="true" aria-label={project.title} onClick={(event) => event.stopPropagation()}><button className="dialog-close" type="button" onClick={onClose} ref={closeButton} aria-label="Close project">✕</button><ProjectCard project={project} /></div></div>;
}
