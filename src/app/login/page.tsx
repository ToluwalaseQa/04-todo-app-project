import AuthForm from '@/components/auth/AuthForm';
import Header from '@/components/Header';

export default function LoginPage() {
  return (
    <div>
      <Header />
      <div className='flex items-center justify-center min-h-[calc(100vh-64px)] p-4'>
        <AuthForm isLogin />
      </div>
    </div>
  );
}
