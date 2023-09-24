import { FormEvent, useEffect, useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { createUser } = useGlobalContext();

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(email, password);
    if (!email || !password) return;
    setError('');
    try {
      await createUser(email, password);
      navigate('/');
    } catch (err) {
      const firebaseError = err as { code: string };
      console.log(firebaseError.code);
      switch (firebaseError.code) {
        case 'auth/invalid-email':
          setError('Проверьте поле почты на ошибки.');
          break;
        case 'auth/email-already-in-use':
          setError('Этот е-мейл уже используется.');
          break;
        case 'auth/weak-password':
          setError('Пароль должен содержать минимум 6 символов.');
          break;
        default:
          setError('Неизвестная ошибка. Попробуйте ещё раз.');
          break;
      }
    }
  };

  useEffect(() => {
    setError('');
  }, [email, password]);

  return (
    <Container className="d-flex align-items-center justify-content-center mt-5">
      <Card bg="transparent" text="dark" className="p-5" style={{ width: '450px' }}>
        <h2 className="text-center mb-4">Регистрация</h2>
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
            У вас есть аккаунт?{' '}
            <Link className="custom-link" to="/login">
              На страницу входа
            </Link>
          </p>

          <Button variant="success" type="submit" className="mt-3">
            Создать пользователя
          </Button>
        </Form>
      </Card>
    </Container>
  );
};
export default SignupPage;
