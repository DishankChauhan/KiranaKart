import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthForm from '../components/auth/AuthForm';
import { useAuthStore } from '../store/authStore';
import { signInWithGoogle } from '../services/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const user = await signIn(data.email, data.password);
      toast.success('Successfully logged in!');
      navigate(user.role === 'store_owner' ? '/dashboard' : '/browse');
    } catch (error) {
      toast.error('Failed to login: ' + (error as Error).message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      toast.success('Successfully logged in with Google!');
      navigate(user.role === 'store_owner' ? '/dashboard' : '/browse');
    } catch (error) {
      toast.error('Failed to login with Google: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
      <AuthForm 
        type="login" 
        onSubmit={handleLogin}
        onGoogleSignIn={handleGoogleLogin}
      />
    </div>
  );
};

export default Login;