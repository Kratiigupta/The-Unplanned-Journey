import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaWalking, FaSuitcaseRolling, FaPlane, FaCloud } from 'react-icons/fa';

const FlightTransition = ({ destinationCode, onComplete }) => {
  const planeControls = useAnimation();
  const characterControls = useAnimation();
  const bgControls = useAnimation();

  useEffect(() => {
    let isMounted = true;
    const runAnimation = async () => {
      // 1. Fade in background
      await bgControls.start({ opacity: 1, transition: { duration: 0.3 } });
      
      if (!isMounted) return;

      // 2. Character walks in to the plane
      // Positions: Center of screen horizontally, slightly below center vertically
      characterControls.set({ x: '-30vw', y: '10vh', opacity: 1, scale: 1 });
      planeControls.set({ x: '-5vw', y: '10vh', rotate: -5, scale: 1 });
      
      // Character walking
      await characterControls.start({ 
        x: '-8vw', 
        transition: { duration: 0.8, ease: "linear" } 
      });
      
      if (!isMounted) return;

      // 3. Character boards (fades out and shrinks into plane)
      await characterControls.start({ 
        opacity: 0, 
        scale: 0.5, 
        x: '-5vw',
        transition: { duration: 0.3 } 
      });
      
      if (!isMounted) return;

      // 4. Plane tilts up and takes off diagonally!
      planeControls.start({ rotate: -35, transition: { duration: 0.4 } });
      await planeControls.start({ 
        x: '100vw', 
        y: '-100vh', 
        scale: 1.5,
        transition: { duration: 1.2, ease: "easeIn" } 
      });

      if (!isMounted) return;

      // 5. Trigger navigation
      onComplete();
    };

    runAnimation();
    
    return () => {
      isMounted = false;
    };
  }, [bgControls, characterControls, planeControls, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] pointer-events-auto flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={bgControls}
      style={{ background: 'rgba(15, 15, 35, 0.95)', backdropFilter: 'blur(15px)' }}
    >
      <motion.div
        animate={characterControls}
        className="absolute z-30 flex items-end gap-1 text-white"
      >
        <FaWalking className="text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        <FaSuitcaseRolling className="text-3xl text-passport-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] mb-1" />
      </motion.div>
      
      <motion.div
        animate={planeControls}
        className="absolute z-20 flex items-center text-white"
      >
        <FaPlane className="text-8xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] relative z-10" />
        {/* Trail effect */}
        <div className="absolute right-[80%] top-1/2 w-48 h-2 bg-gradient-to-l from-white/80 to-transparent -translate-y-1/2 rounded-full blur-[2px]" />
      </motion.div>
      
      {/* Decorative clouds */}
      <motion.div className="absolute top-[20%] left-[15%] text-white/5" initial={{ x: -20 }} animate={{ x: 20 }} transition={{ repeat: Infinity, duration: 4, repeatType: 'reverse' }}>
        <FaCloud className="text-[120px]" />
      </motion.div>
      <motion.div className="absolute top-[60%] right-[20%] text-white/5" initial={{ x: 20 }} animate={{ x: -20 }} transition={{ repeat: Infinity, duration: 5, repeatType: 'reverse' }}>
        <FaCloud className="text-[150px]" />
      </motion.div>
      <motion.div className="absolute bottom-[10%] left-[30%] text-white/5" initial={{ y: -10 }} animate={{ y: 10 }} transition={{ repeat: Infinity, duration: 3, repeatType: 'reverse' }}>
        <FaCloud className="text-[100px]" />
      </motion.div>
      
      {/* Destination Text */}
      <motion.div
        className="absolute bottom-24 font-display text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-passport-gold to-white tracking-widest uppercase drop-shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Boarding Flight to {destinationCode}...
      </motion.div>
    </motion.div>
  );
};

export default FlightTransition;
