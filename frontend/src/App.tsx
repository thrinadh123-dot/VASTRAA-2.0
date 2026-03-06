import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './routes/AppRouter';
import { fetchUser } from './redux/slices/authSlice';
import { mergeCart } from './redux/slices/cartSlice';
import type { AppDispatch, RootState } from './redux';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Sync Guest Cart on Login
  useEffect(() => {
    if (userInfo) {
      const guestCartData = localStorage.getItem('vastraa_guest_cart');
      if (guestCartData) {
        try {
          const guestItems = JSON.parse(guestCartData);
          if (Array.isArray(guestItems) && guestItems.length > 0) {
            dispatch(mergeCart(guestItems));
          }
        } catch {
          // ignore json parse errors
        }
      }
    }
  }, [userInfo, dispatch]);

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
