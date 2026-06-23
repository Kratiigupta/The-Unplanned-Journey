import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMoon, FaSun, FaPalette } from 'react-icons/fa';

const SettingsPage = () => {
  const { theme, setTheme, colorPalette, setColorPalette } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bgPrimary p-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto pt-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-textSecondary hover:text-theme mb-8 transition-colors"
        >
          <FaArrowLeft /> Back
        </button>

        <h1 className="font-display text-4xl font-bold text-textPrimary mb-8">Settings</h1>

        <div className="space-y-8">
          {/* Appearance Section */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-borderColor pb-4">
              <FaMoon className="text-xl text-theme" />
              <h2 className="font-display text-2xl font-semibold text-textPrimary">Appearance</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  theme === 'light' ? 'border-theme bg-theme/10' : 'border-borderColor hover:border-theme/50'
                }`}
              >
                <FaSun className={`text-2xl ${theme === 'light' ? 'text-theme' : 'text-textSecondary'}`} />
                <span className="text-textPrimary font-medium">Light Mode</span>
              </button>
              
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  theme === 'dark' ? 'border-theme bg-theme/10' : 'border-borderColor hover:border-theme/50'
                }`}
              >
                <FaMoon className={`text-2xl ${theme === 'dark' ? 'text-theme' : 'text-textSecondary'}`} />
                <span className="text-textPrimary font-medium">Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Theme Color Section */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-borderColor pb-4">
              <FaPalette className="text-xl text-theme" />
              <h2 className="font-display text-2xl font-semibold text-textPrimary">Theme Color</h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setColorPalette('ocean')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                  colorPalette === 'ocean' ? 'border-blue-500 bg-blue-500/10' : 'border-borderColor hover:border-blue-500/50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 shadow-glow-ocean"></div>
                <span className="text-textPrimary font-medium">Ocean</span>
              </button>

              <button
                onClick={() => setColorPalette('sunset')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                  colorPalette === 'sunset' ? 'border-orange-500 bg-orange-500/10' : 'border-borderColor hover:border-orange-500/50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-orange-500 shadow-glow-sunset"></div>
                <span className="text-textPrimary font-medium">Sunset</span>
              </button>

              <button
                onClick={() => setColorPalette('forest')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                  colorPalette === 'forest' ? 'border-green-500 bg-green-500/10' : 'border-borderColor hover:border-green-500/50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-green-500 shadow-glow-forest"></div>
                <span className="text-textPrimary font-medium">Forest</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
