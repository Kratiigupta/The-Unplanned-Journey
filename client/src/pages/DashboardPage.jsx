import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExplorer } from '../context/ExplorerContext';
import { FaGlobeAmericas, FaPassport, FaBook, FaTrophy, FaSignOutAlt, FaMap, FaCog } from 'react-icons/fa';
import countries from '../data/countries';
import Hyperspeed from '../components/Hyperspeed';

const hyperspeedOptions = {
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x0a0a1a,
    shoulderLines: 0x1a6cf5,
    brokenLines: 0xfb923c,
    leftCars: [0x1a6cf5, 0x2563eb, 0x3b82f6],
    rightCars: [0xfb923c, 0xf97316, 0xea580c],
    sticks: 0x1a6cf5,
  }
};

import { useTheme } from '../context/ThemeContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getProgress, isCountryVisited } = useExplorer();
  const { theme } = useTheme(); // Use theme context
  const progress = getProgress();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const recentStamps = user?.stamps?.slice(-5).reverse() || [];

  const quickLinks = [
    { title: 'World Map', desc: 'Explore countries', icon: FaMap, path: '/map', color: 'from-ocean-500 to-ocean-700' },
    { title: 'My Passport', desc: 'View your passport', icon: FaPassport, path: '/passport', color: 'from-passport-gold to-yellow-700' },
    { title: 'Wildlife Safari', desc: 'Global animals', icon: FaGlobeAmericas, path: '/wildlife', color: 'from-forest-500 to-forest-700' },
    { title: 'Scrapbook', desc: 'Travel journal', icon: FaBook, path: '/scrapbook', color: 'from-sunset-500 to-sunset-700' },
    { title: 'Achievements', desc: 'Badges & rewards', icon: FaTrophy, path: '/achievements', color: 'from-purple-500 to-purple-700' },
  ];

  // Dynamic Hyperspeed options based on theme
  const hyperspeedOptions = {
    colors: {
      roadColor: theme === 'light' ? 0xffffff : 0x080808,
      islandColor: theme === 'light' ? 0xf3f4f6 : 0x0a0a0a,
      background: theme === 'light' ? 0xffffff : 0x0a0a1a,
      shoulderLines: 0x1a6cf5,
      brokenLines: 0xfb923c,
      leftCars: [0x1a6cf5, 0x2563eb, 0x3b82f6],
      rightCars: [0xfb923c, 0xf97316, 0xea580c],
      sticks: 0x1a6cf5,
    }
  };

  const continents = ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'];

  return (
    <div className="min-h-screen bg-bgPrimary relative">
      {/* Hyperspeed Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
        <Hyperspeed effectOptions={hyperspeedOptions} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <motion.h1
              className="font-display text-3xl font-bold text-textPrimary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Welcome back, <span className="gradient-text-sunset">{user?.name}</span>! 🌍
            </motion.h1>
            <p className="text-textSecondary mt-1">Passport ID: <span className="text-passport-gold font-passport">{user?.passportId}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sunset-400 font-display font-bold text-lg">{user?.explorerPoints || 0} pts</p>
              <p className="text-textSecondary text-xs">Explorer Points</p>
            </div>
            <button onClick={handleLogout}
              className="p-3 rounded-xl bg-bgSecondary border border-borderColor text-textSecondary hover:text-red-400 hover:border-red-400/30 transition-all">
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        {/* Progress Card */}
        <motion.div
          className="glass-card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaGlobeAmericas className="text-2xl text-ocean-400" />
              <div>
                <h2 className="font-display text-lg font-semibold text-textPrimary">World Exploration Progress</h2>
                <p className="text-textSecondary text-sm">{progress.visited} of {progress.total} countries explored</p>
              </div>
            </div>
            <span className="text-3xl font-display font-bold gradient-text-ocean">{progress.percentage}%</span>
          </div>
          <div className="w-full h-3 bg-bgSecondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-ocean-500 via-forest-500 to-sunset-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {quickLinks.map((link, i) => (
            <motion.button
              key={link.title}
              onClick={() => navigate(link.path)}
              className="glass-card-hover p-6 text-left group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <link.icon className="text-xl text-textPrimary" />
              </div>
              <h3 className="font-display font-semibold text-textPrimary">{link.title}</h3>
              <p className="text-textSecondary text-sm mt-1">{link.desc}</p>
            </motion.button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Countries by Continent */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="font-display text-lg font-semibold text-textPrimary mb-4">🗺️ Countries to Explore</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {continents.map(continent => {
                const continentCountries = countries.filter(c => c.continent === continent);
                if (continentCountries.length === 0) return null;
                return (
                  <div key={continent}>
                    <p className="text-xs text-textSecondary uppercase tracking-wider mb-1">{continent}</p>
                    <div className="flex flex-wrap gap-2">
                      {continentCountries.map(c => (
                        <button
                          key={c.code}
                          onClick={() => navigate(`/country/${c.code}`)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                            isCountryVisited(c.code)
                              ? 'bg-forest-500/20 border border-forest-500/30 text-forest-300'
                              : 'bg-bgSecondary border border-borderColor text-textSecondary hover:bg-bgSecondary'
                          }`}
                        >
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                          {isCountryVisited(c.code) && <span>✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-display text-lg font-semibold text-textPrimary mb-4">🎫 Recent Stamps</h3>
            {recentStamps.length > 0 ? (
              <div className="space-y-3">
                {recentStamps.map((stamp, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-bgSecondary">
                    <div className="passport-stamp text-xs" style={{ borderColor: '#d4a843', color: '#d4a843', transform: `rotate(${-3 + Math.random() * 6}deg)` }}>
                      {stamp.country}
                    </div>
                    <div>
                      <p className="text-textPrimary text-sm font-medium">{stamp.country}</p>
                      <p className="text-textSecondary text-xs">{new Date(stamp.earnedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">🗺️</p>
                <p className="text-textSecondary">No stamps yet!</p>
                <p className="text-textSecondary text-sm mt-1">Start exploring countries to earn stamps</p>
                <button onClick={() => navigate('/map')}
                  className="btn-primary mt-4 text-sm px-6 py-2">
                  Open World Map
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
