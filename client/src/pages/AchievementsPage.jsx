import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';
import achievementsData from '../data/achievements';

const AchievementsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const visitedCount = user?.visitedCountries?.length || 0;

  return (
    <div className="min-h-screen bg-bgPrimary relative">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-passport-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-ocean-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-textSecondary hover:text-white/80 text-sm mb-3 transition-colors">
            <FaArrowLeft /> Dashboard
          </button>
          <h1 className="font-display text-3xl font-bold text-textPrimary flex items-center gap-3">
            🏆 <span className="gradient-text-gold">Achievements</span>
          </h1>
          <p className="text-textSecondary mt-1">
            {user?.achievements?.length || 0} of {achievementsData.length} badges earned •{' '}
            <span className="text-sunset-400">{user?.explorerPoints || 0} points</span>
          </p>
        </div>

        {/* Achievement Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {achievementsData.map((achievement, i) => {
            const isUnlocked = user?.achievements?.includes(achievement.id);
            const progress = Math.min(visitedCount / achievement.threshold, 1);

            return (
              <motion.div
                key={achievement.id}
                className={`glass-card p-6 relative overflow-hidden ${isUnlocked ? '' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Glow effect for unlocked */}
                {isUnlocked && (
                  <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at center, ${achievement.color}, transparent 70%)` }} />
                )}

                <div className="flex items-start gap-4 relative">
                  {/* Badge Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
                      isUnlocked
                        ? 'badge-unlocked'
                        : 'badge-locked'
                    }`}
                    style={{
                      background: isUnlocked
                        ? `linear-gradient(135deg, ${achievement.color}30, ${achievement.color}10)`
                        : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${isUnlocked ? achievement.color + '50' : 'rgba(255,255,255,0.1)'}`,
                    }}
                    whileHover={isUnlocked ? { rotate: [0, -10, 10, 0], scale: 1.1 } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    {achievement.emoji}
                  </motion.div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-display font-semibold text-lg ${isUnlocked ? 'text-textPrimary' : 'text-textSecondary'}`}>
                        {achievement.name}
                      </h3>
                      {isUnlocked && (
                        <motion.span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: `${achievement.color}20`, color: achievement.color, border: `1px solid ${achievement.color}30` }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', bounce: 0.5, delay: i * 0.1 + 0.3 }}
                        >
                          UNLOCKED ✓
                        </motion.span>
                      )}
                    </div>
                    <p className={`text-sm mb-3 ${isUnlocked ? 'text-textSecondary' : 'text-textSecondary'}`}>
                      {achievement.description}
                    </p>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-textSecondary">{achievement.requirement}</span>
                        <span style={{ color: isUnlocked ? achievement.color : 'rgba(255,255,255,0.3)' }}>
                          {Math.min(visitedCount, achievement.threshold)}/{achievement.threshold}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-bgSecondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: isUnlocked ? achievement.color : 'rgba(255,255,255,0.2)' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress * 100}%` }}
                          transition={{ duration: 1, delay: i * 0.1 + 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <motion.div
          className="glass-card p-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="font-display text-lg font-semibold text-textPrimary mb-4 text-center">📊 Your Explorer Stats</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-display font-bold gradient-text-ocean">{visitedCount}</p>
              <p className="text-textSecondary text-xs mt-1">Countries</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold gradient-text-sunset">{user?.explorerPoints || 0}</p>
              <p className="text-textSecondary text-xs mt-1">Points</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold gradient-text-forest">{user?.stamps?.length || 0}</p>
              <p className="text-textSecondary text-xs mt-1">Stamps</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold gradient-text-gold">{user?.achievements?.length || 0}</p>
              <p className="text-textSecondary text-xs mt-1">Badges</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AchievementsPage;
