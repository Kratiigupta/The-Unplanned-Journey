import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowRight, FaGlobeAmericas } from 'react-icons/fa';
import { useRef } from 'react';
import PassportCard from '../components/PassportCard';

const PassportPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const passportRef = useRef(null);

  const handleDownload = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(passportRef.current, {
        backgroundColor: '#1a1a3e',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        ignoreElements: (element) => element.classList && element.classList.contains('ignore-canvas'),
        onclone: (document) => {
          const el = document.querySelector('.passport-card');
          if (el) el.style.boxShadow = 'none';
        }
      });
      const link = document.createElement('a');
      link.download = `passport-${user?.passportId || 'explorer'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 ignore-canvas">
        <div className="absolute top-10 right-10 w-72 h-72 bg-passport-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-ocean-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <motion.div
        className="text-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-bold gradient-text-gold mb-2">🎉 Your Passport is Ready!</h1>
        <p className="text-textSecondary">Welcome to the Explorer's Club</p>
      </motion.div>

      {/* Passport Card */}
      <PassportCard user={user} passportRef={passportRef} />

      {/* Actions */}
      <motion.div
        className="flex gap-4 mt-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-bgSecondary border border-borderColor text-textSecondary hover:bg-bgSecondary transition-all"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <FaDownload /> Download
        </motion.button>
        <motion.button onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 btn-sunset"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <FaGlobeAmericas /> Explore the World <FaArrowRight />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PassportPage;
