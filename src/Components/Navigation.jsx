import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/logout">Logout</Link>
    </nav>
  );
}

export default Navigation;