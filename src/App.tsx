import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import Home from './pages/Home';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import TopicPage from './pages/TopicPage';
import NewTopic from './pages/NewTopic';

import { FaUserCircle, FaPen } from 'react-icons/fa';
import Account from './pages/Account';
import EditTopic from './pages/EditTopic';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { useGlobalContext } from './context';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, logout } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            ARTICLE-JUMP
          </Navbar.Brand>
          <Nav>
            {user?.email ? (
              <div className="d-flex align-items-center gap-2">
                <Nav.Link as={Link} to="/newtopic">
                  <FaPen size={24} />
                </Nav.Link>
                <Nav.Link as={Link} to="/account">
                  <FaUserCircle size={30} />
                </Nav.Link>
                <Nav.Link as="button" onClick={handleLogout}>
                  Выйти
                </Nav.Link>
              </div>
            ) : (
              <Nav.Link as={Link} to="/signup">
                Войти / Регистрация
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Container className="my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route path="/topics/:id" element={<TopicPage />} />
          <Route
            path="/newtopic"
            element={
              <ProtectedRoute>
                <NewTopic />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditTopic />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;
