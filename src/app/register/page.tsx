import AuthForm from '@/components/auth/AuthForm';
import Header from '@/components/Header';

export default function RegisterPage() {
  return (
    <div>
      <Header />
      <div className='flex items-center justify-center min-h-[calc(100vh-64px)] p-4'>
        <AuthForm isLogin={false} />
      </div>
    </div>
  );
}
