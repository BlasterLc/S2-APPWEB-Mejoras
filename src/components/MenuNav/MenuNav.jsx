import { Link } from "react-router-dom";

function MenuNav() {
  return (
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/checkin">Check-In</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/contacto">Contacto</Link>
    </nav>
  );
}

export default MenuNav;