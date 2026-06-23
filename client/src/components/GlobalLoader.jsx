import { motion } from 'framer-motion';
import { GiWorld } from 'react-icons/gi';
import { FaPlane } from 'react-icons/fa';

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 bg-bgPrimary z-[9999] flex flex-col items-center justify-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 bg-ocean-600/10 rounded-full blur-[80px]" />

      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="relative text-6xl text-ocean-400 mb-6"
        >
          <GiWorld />
          
          {/* Orbital Plane */}
          <motion.div 
            className="absolute -inset-4 rounded-full border border-ocean-500/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <FaPlane className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sunset-400 text-sm rotate-45" />
          </motion.div>
        </motion.div>

        <motion.h2 
          className="font-display text-xl font-semibold text-textPrimary tracking-wider"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Preparing your journey...
        </motion.h2>
      </div>
    </div>
  );
};

export default GlobalLoader;
