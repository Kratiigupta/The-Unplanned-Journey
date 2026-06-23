import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaGlobeAmericas, FaCompass, FaPlane, FaMountain, FaWater, FaPaw, FaCog } from 'react-icons/fa';
import { GiPalmTree, GiMountainRoad, GiWorld } from 'react-icons/gi';
import Orb from '../components/Orb';
import { useTheme } from '../context/ThemeContext';

const floatingIcons = [
  { Icon: FaPlane, x: '10%', y: '20%', delay: 0, size: 24, rotate: 45 },
  { Icon: FaCompass, x: '80%', y: '15%', delay: 0.5, size: 28, rotate: 0 },
  { Icon: FaMountain, x: '15%', y: '70%', delay: 1, size: 22, rotate: 0 },
  { Icon: FaWater, x: '85%', y: '65%', delay: 1.5, size: 26, rotate: 0 },
  { Icon: FaPaw, x: '75%', y: '80%', delay: 2, size: 20, rotate: 0 },
  { Icon: GiPalmTree, x: '5%', y: '45%', delay: 0.8, size: 30, rotate: 0 },
  { Icon: GiMountainRoad, x: '90%', y: '40%', delay: 1.3, size: 24, rotate: 0 },
];

const WelcomePage = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { theme, colorPalette } = useTheme();

  // Calculate Orb colors based on theme
  let orbHue = 0;
  if (colorPalette === 'sunset') orbHue = -90;
  if (colorPalette === 'forest') orbHue = 120;

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-bgPrimary relative overflow-hidden transition-colors duration-300">
      
      {/* Background Container */}
      <div className="absolute inset-0 z-0">
        
        {/* Dynamic Background Circles */}
        <motion.div 
          className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 bg-theme"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 bg-sunset-500"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Orb Background */}
        <div className={`absolute inset-0 pointer-events-none opacity-40 mix-blend-screen transition-all duration-300 ${theme === 'light' ? 'invert' : ''}`}>
          <Orb
            hue={orbHue}
            hoverIntensity={0.5}
            rotateOnHover={true}
            forceHoverState={false}
            backgroundColor="#000000"
          />
        </div>
      </div>

      {/* Radial Gradient for Text Readability */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--bg-primary)_0%,_transparent_60%)] opacity-90" />

      {/* Floating Travel Icons */}
      {floatingIcons.map(({ Icon, x, y, delay, size, rotate }, index) => (
        <motion.div
          key={index}
          className="absolute text-white/10"
          style={{ left: x, top: y }}
          animate={{
            y: [0, -20, 0],
            rotate: [rotate, rotate + 10, rotate],
          }}
          transition={{
            duration: 4 + index,
            repeat: Infinity,
            delay,
            ease: 'easeInOut',
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-12 pb-6">
        {/* Globe Icon */}
        <motion.div
          className="mb-4"
          style={{
            transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, type: 'spring', bounce: 0.4 }}
        >
          <div className="relative">
            <motion.div
              className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 108, 245, 0.2), rgba(34, 197, 94, 0.2))',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <GiWorld className="text-5xl md:text-6xl text-ocean-400" />
            </motion.div>
            {/* Orbital ring */}
            <motion.div
              className="absolute inset-[-15px] rounded-full border border-ocean-500/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-sunset-400 rounded-full shadow-lg shadow-sunset-400/50" />
            </motion.div>
            <motion.div
              className="absolute inset-[-30px] rounded-full border border-forest-500/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute bottom-0 left-1/2 w-2 h-2 -translate-x-1/2 translate-y-1/2 bg-forest-400 rounded-full shadow-lg shadow-forest-400/50" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.p
            className="text-ocean-400 font-display text-xs md:text-sm tracking-[0.3em] uppercase mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Welcome to
          </motion.p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-1">
            <span className="gradient-text-ocean">The Unplanned</span>
          </h1>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold">
            <span className="gradient-text-sunset">Journey</span>
          </h1>
        </motion.div>

        {/* Quote */}
        <motion.div
          className="mb-6 text-center max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <div className="relative inline-block">
            <span className="absolute -left-5 -top-3 text-3xl text-ocean-500/30 font-serif">"</span>
            <p className="text-lg md:text-xl text-textSecondary font-body italic leading-relaxed">
              The world is waiting to be explored.
            </p>
            <span className="absolute -right-5 -bottom-3 text-3xl text-sunset-500/30 font-serif">"</span>
          </div>
        </motion.div>

        {/* Start Journey Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.button
            onClick={() => navigate('/register')}
            className="group relative px-8 py-3 md:py-4 rounded-full font-display font-semibold text-base md:text-lg text-textPrimary overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Button gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-600 via-ocean-500 to-sunset-500 transition-all duration-500 group-hover:from-ocean-500 group-hover:via-sunset-500 group-hover:to-sunset-400" />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Button content */}
            <span className="relative flex items-center gap-3">
              <FaCompass className="text-xl group-hover:rotate-[360deg] transition-transform duration-700" />
              Start Your Journey
              <motion.span
                animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaPlane className="text-lg rotate-45" />
              </motion.span>
            </span>
          </motion.button>
        </motion.div>

        {/* Already have account */}
        <motion.p
          className="mt-4 text-textSecondary text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Already an explorer?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-ocean-400 hover:text-ocean-300 transition-colors underline underline-offset-4"
          >
            Continue Journey
          </button>
        </motion.p>

        {/* Stats Bar */}
        <motion.div
          className="mt-auto pt-6 flex flex-wrap justify-center gap-6 md:gap-16 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          {[
            { label: 'Countries', value: '25+', icon: '🌍' },
            { label: 'Wildlife', value: '50+', icon: '🦁' },
            { label: 'Adventures', value: '∞', icon: '🗺️' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xl mb-1">{stat.icon}</p>
              <p className="text-white/80 font-display font-bold text-base md:text-lg">{stat.value}</p>
              <p className="text-textSecondary text-[10px] md:text-xs tracking-wider uppercase">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Settings Button (Bottom Left) */}
      <button 
        onClick={() => navigate('/settings')}
        className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-glass-bg border border-glass-border text-textSecondary hover:text-theme hover:scale-110 transition-all shadow-lg backdrop-blur-md"
        title="Settings"
      >
        <FaCog className="text-xl" />
      </button>
    </div>
  );
};

export default WelcomePage;
