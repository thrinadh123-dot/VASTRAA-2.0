import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './routes/AppRouter';
import { fetchUser } from './redux/slices/authSlice';
import { mergeCart } from './redux/slices/cartSlice';
import type { AppDispatch, RootState } from './redux';
import SecurityAlertPopup from './components/security/SecurityAlertPopup';
import { useSecurityAlert } from './components/security/useSecurityAlert';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { alert, dismissAlert } = useSecurityAlert(userInfo?._id);

  const handleSecureAccount = useCallback(() => {
    navigate('/profile?tab=security');
  }, [navigate]);

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
      <SecurityAlertPopup alert={alert} onClose={dismissAlert} onSecureAccount={handleSecureAccount} />
      <AppRouter />
    </>
  );
}

export default App;
