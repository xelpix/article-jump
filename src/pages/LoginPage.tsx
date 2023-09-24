import { FormEvent, useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useGlobalContext();
  const navigate = useNavigate();

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return;
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const firebaseError = err as { code: string };
      console.log(firebaseError.code);
      switch (firebaseError.code) {
        case 'auth/user-not-found':
          setError('Пользователь не найден');
          break;
        case 'auth/wrong-password':
          setError('Неправильный пароль');
          break;
        case 'auth/invalid-login-credentials':
          setError('Неправильный логин или пароль');
          break;

        default:
          setError('Неизвестная ошибка. Попробуйте ещё раз.');
          break;
      }
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center mt-5">
      <Card bg="transparent" text="dark" className="p-5" style={{ width: '450px' }}>
        <h2 className="text-center mb-4">Вход</h2>
        {error && (
          <Alert variant="danger" className="mt-2">
            {error}
          </Alert>
        )}
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Введите е-мейл:</Form.Label>
            <Form.Control
              type="email"
              placeholder="пример@почта.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2" controlId="formPassword">
            <Form.Label>Введите пароль:</Form.Label>
            <Form.Control
              type="password"
              placeholder="минимум 6 символов"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <p className="small text-muted">
            Ещё нет аккаунта?{' '}
            <Link className="custom-link" to="/signup">
              Регистрация
            </Link>
          </p>

          <Button variant="success" type="submit" className="mt-3">
            Войти
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginPage;
