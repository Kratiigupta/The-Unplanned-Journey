import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { FaPlane } from 'react-icons/fa';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const planeRotate = useMotionValue(-45); // default top-left

  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const planeX = useSpring(cursorX, springConfig);
  const planeY = useSpring(cursorY, springConfig);
  const planeRotateSpring = useSpring(planeRotate, { damping: 20, stiffness: 200 });

  useEffect(() => {
    let lastSpawnTime = 0;
    let lastX = 0;
    let lastY = 0;
    let currentAngle = 0;

    const spawnParticle = (x, y, angle) => {
      const isSmoke = Math.random() > 0.4;
      const particle = document.createElement('div');
      
      particle.className = `fixed pointer-events-none z-[9998] rounded-full`;
      
      if (isSmoke) {
        particle.style.width = '14px';
        particle.style.height = '14px';
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        particle.style.filter = 'blur(4px)';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.transform = `translate(-50%, -50%) scale(1)`;
        particle.style.transition = 'all 0.8s cubic-bezier(0.1, 0.8, 0.3, 1)';
      } else {
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        particle.style.width = '12px';
        particle.style.height = '3px';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        particle.style.transition = 'all 0.6s linear';
      }
      
      document.body.appendChild(particle);

      // Fade out and shrink/expand
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          particle.style.opacity = '0';
          if (isSmoke) {
            const moveX = (Math.random() - 0.5) * 30;
            const moveY = (Math.random() - 0.5) * 30;
            particle.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(3)`;
          } else {
            particle.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(0.2)`;
          }
        });
      });

      // Cleanup
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, isSmoke ? 800 : 600);
    };

    const updateMousePosition = (e) => {
      // Offset so the plane tail is roughly at the cursor tip
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);
      
      if (!isVisible) setIsVisible(true);

      const now = Date.now();
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance > 3) {
        // Calculate angle of movement
        currentAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // Handle rotation shortest path
        const currentRotation = planeRotate.get();
        let newRotation = currentAngle + 45; // FaPlane naturally points top-right (45deg offset)
        
        let diff = newRotation - currentRotation;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        
        planeRotate.set(currentRotation + diff);
      }

      // Spawn dashed trail if moved enough
      if (distance > 25 || (distance > 5 && now - lastSpawnTime > 60)) {
        spawnParticle(e.clientX, e.clientY, currentAngle);
        lastSpawnTime = now;
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName?.toLowerCase() === 'button' ||
        e.target.tagName?.toLowerCase() === 'a' ||
        e.target.closest('button') ||
        e.target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, cursorX, cursorY, planeRotate]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: planeX,
        y: planeY,
        rotate: planeRotateSpring,
        opacity: isVisible ? 1 : 0,
      }}
      animate={{
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <div className={`absolute inset-0 bg-ocean-500 rounded-full blur-md transition-opacity duration-300 ${isHovering ? 'opacity-80' : 'opacity-40'}`} />
        <FaPlane className={`relative text-2xl transition-colors duration-300 ${isHovering ? 'text-sunset-400' : 'text-textPrimary'}`} />
      </div>
    </motion.div>
  );
};

export default CustomCursor;
