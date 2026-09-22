import { useEffect, useRef, useState } from "react";
import { navigation, profile } from "../data/portfolio";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuButton = useRef(null);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return <header className="site-header"><nav className="nav container" aria-label="Primary navigation"><a className="brand" href="#top" aria-label={`${profile.brand} home`}><img className="brand-logo" src={profile.brandLogo} alt="Jai'fore logo" /><span>{profile.brand}</span></a><button ref={menuButton} className="menu-button" type="button" aria-expanded={isOpen} aria-controls="navigation-links" aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} onClick={() => setIsOpen((open) => !open)}><span></span><span></span></button><div className={`nav-links${isOpen ? " is-open" : ""}`} id="navigation-links">{navigation.map(([label, href]) => <a key={href} href={href} onClick={() => setIsOpen(false)}>{label}</a>)}<a className="nav-contact" href="#contact" onClick={() => setIsOpen(false)}>Contact</a></div></nav></header>;
}
