import { motion } from 'framer-motion';

const PassportCard = ({ user, passportRef }) => {
  return (
    <motion.div
      ref={passportRef}
      className="passport-card w-full max-w-md p-8 relative z-10"
      initial={{ scale: 0.5, rotateY: 90 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-px bg-passport-gold/50" />
          <span className="text-passport-gold text-xs tracking-[0.3em] uppercase font-passport">Virtual</span>
          <div className="w-8 h-px bg-passport-gold/50" />
        </div>
        <h2 className="font-display text-2xl font-bold text-passport-gold tracking-wider">
          EXPLORER PASSPORT
        </h2>
        <p className="text-textSecondary text-xs font-passport mt-1">THE UNPLANNED JOURNEY</p>
      </div>

      <div className="h-px bg-passport-gold/20 mb-6" />

      {/* Photo & Info */}
      <div className="flex gap-4 sm:gap-6 items-start mb-6 border-b border-borderColor pb-6">
        <div className="relative group">
          {(() => {
            const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
            const imgSrc = user?.profilePicture?.startsWith('/uploads') ? `${baseUrl}${user.profilePicture}` : (user?.profilePicture || '');
            return imgSrc ? (
              <img src={imgSrc} alt={user?.name || 'Explorer'} className="w-24 h-32 sm:w-28 sm:h-36 object-cover rounded shadow-inner" crossOrigin="anonymous" />
            ) : (
              <div className="w-24 h-32 sm:w-28 sm:h-36 rounded bg-gradient-to-br from-ocean-500/20 to-sunset-500/20 flex items-center justify-center">
                <span className="text-4xl">🧑‍🚀</span>
              </div>
            );
          })()}
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-passport-gold/60 text-xs font-passport uppercase tracking-wider">Explorer Name</p>
            <p className="text-textPrimary font-display font-semibold text-lg">{user?.name || 'Explorer'}</p>
          </div>
          <div>
            <p className="text-passport-gold/60 text-xs font-passport uppercase tracking-wider">Passport ID</p>
            <p className="text-passport-gold font-passport font-bold tracking-wider">{user?.passportId || 'VEXP-2026-001'}</p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-bgSecondary rounded-lg p-3">
          <p className="text-passport-gold/60 text-xs font-passport uppercase mb-1">🦁 Spirit Animal</p>
          <p className="text-textPrimary text-sm font-medium">{user?.favoriteAnimal || 'Not set'}</p>
        </div>
        <div className="bg-bgSecondary rounded-lg p-3">
          <p className="text-passport-gold/60 text-xs font-passport uppercase mb-1">🌍 Dream Destination</p>
          <p className="text-textPrimary text-sm font-medium">{user?.dreamDestination || 'Not set'}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center bg-bgSecondary rounded-lg p-4 mb-4">
        <div className="text-center flex-1">
          <p className="text-2xl font-display font-bold text-textPrimary">{user?.visitedCountries?.length || 0}</p>
          <p className="text-textSecondary text-xs">Countries Visited</p>
        </div>
        <div className="w-px h-10 bg-bgSecondary" />
        <div className="text-center flex-1">
          <p className="text-2xl font-display font-bold text-sunset-400">{user?.explorerPoints || 0}</p>
          <p className="text-textSecondary text-xs">Explorer Points</p>
        </div>
        <div className="w-px h-10 bg-bgSecondary" />
        <div className="text-center flex-1">
          <p className="text-2xl font-display font-bold text-forest-400">{user?.stamps?.length || 0}</p>
          <p className="text-textSecondary text-xs">Stamps</p>
        </div>
      </div>

      {/* Stamps Grid */}
      {user?.stamps?.length > 0 && (
        <div className="mb-4">
          <p className="text-passport-gold/60 text-xs font-passport uppercase mb-2">🎫 Passport Stamps</p>
          <div className="flex flex-wrap gap-2">
            {user.stamps.map((stamp, i) => (
              <motion.div
                key={i}
                className="passport-stamp text-xs"
                style={{ borderColor: ['#c0392b', '#2980b9', '#27ae60', '#f39c12', '#8e44ad'][i % 5], color: ['#c0392b', '#2980b9', '#27ae60', '#f39c12', '#8e44ad'][i % 5] }}
                initial={{ scale: 4, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 0.85, rotate: -5 + Math.random() * 10 }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
              >
                {stamp.country}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="h-px bg-passport-gold/20 mt-4 mb-3" />
      <p className="text-center text-white/20 text-xs font-passport">
        Issued by The Unplanned Journey • {new Date().getFullYear()}
      </p>
    </motion.div>
  );
};

export default PassportCard;
