import { useState } from "react"
import "./NavBar.css"

export default function Menu() {

const [isOpen, setIsOpen] = useState(false);
  const pathData = "M 300,-1.9235101 C 304.63084,565.59088 299.51618,538.96021 301.42857,1052.3622";


  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
      <div>
            <nav className={isOpen ? 'nav nav--open' : 'nav'}>
      <button className="nav-toggle" onClick={handleToggle}><span>Menu</span></button>

      <ul className="nav-menu">
        <li className="li">Home</li>
          <li className="li">Favorites</li>
          <li className="li">Theaters</li>
          <li className="li">News</li>
          <li className="li">Settings</li>
          <li className="li">logout</li>
          <li className="li">Delete Account</li>
      </ul>

      <div className="nav-morph">
        <svg width="100%" height="100%" viewBox="0 0 600 800" preserveAspectRatio="none">
          <path fill="none" d={pathData} />
        </svg>
      </div>
    </nav>
    </div>
  )
}
