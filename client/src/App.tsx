// src/App.tsx
import { Routes, Route,Navigate,BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/navbar/navbar.component';
import { Home } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { Post } from './pages/post/post';
import { Login } from './pages/login/login.pages';
import { SignUp } from './pages/signup/signup.pages';
import { useUserStore } from './store/useUserStore';
import { CreatePost } from './pages/create-post/create-post.pages';
import { useQuery } from '@tanstack/react-query';
import { api } from './config/axios';
import { IPaymentStatusResponse } from './types/type';

const checkPaymentStatus = async (username: string): Promise<IPaymentStatusResponse> => {
  const response = await api.get(`/payment/check-payment-status`, {
    params: { username }
  });
  return response.data;
};

const App = () => {
  const user = useUserStore(state=>state.user);
  const setUser=useUserStore(state=>state.setUser);
  const setPaymentStatus=useUserStore(state=>state.setPaymentStatus);
  const hasPaid=useUserStore(state=>state.paymentStatus);
 // React Query hook for fetching payment status

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  const { data: paymentStatusResponse, isLoading, isError } = useQuery<IPaymentStatusResponse, Error>({
    queryKey: ['paymentStatus', user],
    queryFn: () => checkPaymentStatus(user as string),
    enabled: !!user, 
  });

  useEffect(()=>{
    if(paymentStatusResponse?.hasPaid){
      setPaymentStatus(paymentStatusResponse);
    }
  },[paymentStatusResponse])

  return (
    <BrowserRouter>
        <Routes>
        <Route path='/' element={<Navbar />}>
          <Route index element={user ? (hasPaid ? <Home /> : <Navigate to='/payment' replace />) : <Navigate to='/login' replace />} />
          <Route path='login' element={user ? <Navigate to='/' replace /> : <Login />} />
          <Route path='signup' element={user ? <Navigate to='/' replace /> : <SignUp />} />
          <Route path='profile' element={user ? (hasPaid ? <Profile /> : <Navigate to='/payment' replace />) : <Navigate to='/login' replace />} />
          <Route path='create' element={user ? (hasPaid ? <CreatePost /> : <Navigate to='/payment' replace />) : <Navigate to='/login' replace />} />
          <Route path='account' element={user ? (hasPaid ? <Profile /> : <Navigate to='/payment' replace />) : <Navigate to='/login' replace />} />
          <Route path='posts/:id' element={user ? (hasPaid ? <Post /> : <Navigate to='/payment' replace />) : <Navigate to='/login' replace />} />
         </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
