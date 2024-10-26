import { ParallaxProvider } from 'react-scroll-parallax';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layout/MainLayout';
import Home from './Pages/Home';
import Search from './Pages/Search';
import NotFound from './Pages/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';
import StudyRoom from './Pages/StudyRoom';

function App() {
  return (
    <AuthProvider>
      <ParallaxProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path='studyroom' element={<ProtectedRoute><StudyRoom /></ProtectedRoute>} />
              <Route path="search" element={<Search />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </ParallaxProvider>
    </AuthProvider>
  );
}

export default App;