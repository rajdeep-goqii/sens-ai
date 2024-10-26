// src/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import { AnimatedBackground } from 'animated-backgrounds';
import Navbar from '../components/common/Navbar';

const MainLayout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <AnimatedBackground 
          animationName="gradientWave" 
          style={{ 
            opacity: 0.5,
            width: '100%',
            height: '100%'
          }} 
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;