import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useGlobalContext();
  const lastPage = localStorage.getItem('lastPage');

  if (lastPage) {
    return children;
  } else if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
