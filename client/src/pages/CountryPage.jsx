import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useExplorer } from '../context/ExplorerContext';
import { FaArrowLeft, FaMountain, FaPaw, FaTheaterMasks, FaLandmark, FaVideo, FaCheck, FaStar } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'nature', label: 'Nature', icon: FaMountain, emoji: '🏔️' },
  { id: 'wildlife', label: 'Wildlife', icon: FaPaw, emoji: '🦁' },
  { id: 'culture', label: 'Culture', icon: FaTheaterMasks, emoji: '🎭' },
  { id: 'places', label: 'Famous Places', icon: FaLandmark, emoji: '🏛️' },
  { id: 'tours', label: 'Virtual Tours', icon: FaVideo, emoji: '🎥' },
];

const CountryPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCountryByCode, isCountryVisited, visitCountry } = useExplorer();
  const [activeTab, setActiveTab] = useState('nature');
  const [marking, setMarking] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const country = getCountryByCode(code);
  if (!country) return (
    <div className="min-h-screen bg-bgPrimary flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">🌍</p>
        <p className="text-textSecondary text-xl">Country not found</p>
        <button onClick={() => navigate('/map')} className="btn-primary mt-4">Back to Map</button>
      </div>
    </div>
  );

  const visited = isCountryVisited(code);

  const handleMarkExplored = async () => {
    if (visited || marking) return;
    setMarking(true);
    try {
      await visitCountry(code, country.name);
      // Confetti burst!
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#22c55e', '#d4a843', '#338dff', '#fb923c'] });
      setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { y: 0.4 } }), 300);
      setShowReward(true);
      toast.success(`🎉 +100 Explorer Points! You explored ${country.name}!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as explored');
    } finally {
      setMarking(false);
    }
  };

  const conservationColors = {
    'Least Concern': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Near Threatened': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Vulnerable': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Endangered': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Critically Endangered': 'bg-red-700/20 text-red-300 border-red-700/30',
    'Domesticated': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <div className="min-h-screen bg-bgPrimary relative">
      {/* Reward Modal */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReward(false)}
          >
            <motion.div
              className="glass-card p-8 max-w-md mx-4 text-center"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              onClick={e => e.stopPropagation()}
            >
              <motion.p className="text-6xl mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                🎉
              </motion.p>
              <h2 className="font-display text-3xl font-bold text-textPrimary mb-2">Congratulations!</h2>
              <p className="text-textSecondary text-lg mb-6">You explored <span className="text-sunset-400 font-semibold">{country.name}</span> {country.flag}</p>
              <div className="flex justify-center gap-6 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-display font-bold text-forest-400">+1</p>
                  <p className="text-textSecondary text-sm">Passport Stamp</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-display font-bold text-sunset-400">+100</p>
                  <p className="text-textSecondary text-sm">Explorer Points</p>
                </div>
              </div>
              <div className="passport-stamp inline-block text-sm mb-6" style={{ borderColor: '#d4a843', color: '#d4a843' }}>
                {country.name} ✓
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => { setShowReward(false); navigate('/passport'); }}
                  className="px-6 py-2.5 rounded-full bg-bgSecondary border border-borderColor text-textSecondary hover:bg-bgSecondary transition-all">
                  View Passport
                </button>
                <button onClick={() => { setShowReward(false); navigate('/map'); }}
                  className="btn-primary px-6 py-2.5">
                  Continue Exploring
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={country.coverImage} alt={country.name}
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <button onClick={() => navigate('/map')}
            className="flex items-center gap-2 text-textSecondary hover:text-textPrimary text-sm mb-4 transition-colors">
            <FaArrowLeft /> Back to Map
          </button>
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{country.flag}</span>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-textPrimary text-shadow-lg">{country.name}</h1>
              </div>
              <p className="text-textSecondary max-w-2xl">{country.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-textSecondary">
                <span>🏛️ {country.capital}</span>
                <span>🌍 {country.continent}</span>
              </div>
            </div>
            <motion.button
              onClick={handleMarkExplored}
              disabled={visited || marking}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full font-display font-semibold transition-all ${
                visited
                  ? 'bg-forest-500/20 border border-forest-500/30 text-forest-400'
                  : 'btn-sunset'
              }`}
              whileHover={!visited ? { scale: 1.05 } : {}}
              whileTap={!visited ? { scale: 0.95 } : {}}
            >
              {visited ? <><FaCheck /> Explored</> : marking ? <span className="loading-spinner w-5 h-5" /> : <><FaStar /> Mark as Explored</>}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-bgPrimary/90 backdrop-blur-lg border-b border-borderColor">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-ocean-500/20 text-ocean-400 border border-ocean-500/30'
                    : 'text-textSecondary hover:text-white/80 hover:bg-bgSecondary'
                }`}
              >
                <span>{tab.emoji}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Nature Tab */}
            {activeTab === 'nature' && (
              <div className="space-y-8">
                {country.nature.mountains?.length > 0 && (
                  <div>
                    <h3 className="font-display text-xl font-semibold text-textPrimary mb-4 flex items-center gap-2">⛰️ Mountains</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {country.nature.mountains.map((m, i) => (
                        <motion.div key={i} className="glass-card-hover overflow-hidden" whileHover={{ y: -4 }}>
                          <img src={m.image} alt={m.name} className="w-full h-48 object-cover" />
                          <div className="p-4">
                            <h4 className="font-display font-semibold text-textPrimary text-lg">{m.name}</h4>
                            <p className="text-textSecondary text-sm mt-1">{m.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                {country.nature.lakes?.length > 0 && (
                  <div>
                    <h3 className="font-display text-xl font-semibold text-textPrimary mb-4 flex items-center gap-2">🌊 Lakes</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {country.nature.lakes.map((l, i) => (
                        <motion.div key={i} className="glass-card-hover overflow-hidden" whileHover={{ y: -4 }}>
                          <img src={l.image} alt={l.name} className="w-full h-48 object-cover" />
                          <div className="p-4">
                            <h4 className="font-display font-semibold text-textPrimary text-lg">{l.name}</h4>
                            <p className="text-textSecondary text-sm mt-1">{l.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                {country.nature.forests?.length > 0 && (
                  <div>
                    <h3 className="font-display text-xl font-semibold text-textPrimary mb-4 flex items-center gap-2">🌲 Forests</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {country.nature.forests.map((f, i) => (
                        <motion.div key={i} className="glass-card-hover overflow-hidden" whileHover={{ y: -4 }}>
                          <img src={f.image} alt={f.name} className="w-full h-48 object-cover" />
                          <div className="p-4">
                            <h4 className="font-display font-semibold text-textPrimary text-lg">{f.name}</h4>
                            <p className="text-textSecondary text-sm mt-1">{f.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                {country.nature.mountains?.length === 0 && country.nature.lakes?.length === 0 && country.nature.forests?.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">🏜️</p>
                    <p className="text-textSecondary">Nature content coming soon for {country.name}</p>
                  </div>
                )}
              </div>
            )}

            {/* Wildlife Tab */}
            {activeTab === 'wildlife' && (
              <div>
                <h3 className="font-display text-xl font-semibold text-textPrimary mb-6 flex items-center gap-2">🦁 Wildlife of {country.name}</h3>
                {country.wildlife.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {country.wildlife.map((animal, i) => (
                      <motion.div
                        key={i}
                        className="glass-card-hover overflow-hidden group"
                        whileHover={{ y: -6 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="relative overflow-hidden">
                          <img src={animal.image} alt={animal.name} className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute top-3 right-3">
                            <span className={`px-2 py-1 rounded-full text-xs border ${conservationColors[animal.conservation] || 'bg-gray-500/20 text-gray-400'}`}>
                              {animal.conservation}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <span className="text-3xl">{animal.emoji}</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-display font-semibold text-textPrimary text-lg mb-1">{animal.name}</h4>
                          <p className="text-textSecondary text-xs mb-3">Habitat: {animal.habitat}</p>
                          <div className="space-y-1.5">
                            {animal.facts.map((fact, j) => (
                              <p key={j} className="text-textSecondary text-sm flex items-start gap-2">
                                <span className="text-ocean-400 mt-0.5">•</span> {fact}
                              </p>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-textSecondary">Wildlife data coming soon</p>
                  </div>
                )}
              </div>
            )}

            {/* Culture Tab */}
            {activeTab === 'culture' && (
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 className="font-display text-lg font-semibold text-textPrimary mb-4 flex items-center gap-2">🍽️ Local Food</h3>
                  <div className="space-y-2">
                    {country.culture.food.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-bgSecondary">
                        <span className="text-sunset-400">🍴</span>
                        <span className="text-white/80 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <h3 className="font-display text-lg font-semibold text-textPrimary mb-4 flex items-center gap-2">🎉 Festivals</h3>
                  <div className="space-y-2">
                    {country.culture.festivals.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-bgSecondary">
                        <span className="text-forest-400">🎊</span>
                        <span className="text-white/80 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h3 className="font-display text-lg font-semibold text-textPrimary mb-4 flex items-center gap-2">🎎 Traditions</h3>
                  <div className="space-y-2">
                    {country.culture.traditions.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-bgSecondary">
                        <span className="text-ocean-400">✨</span>
                        <span className="text-white/80 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Famous Places Tab */}
            {activeTab === 'places' && (
              <div>
                <h3 className="font-display text-xl font-semibold text-textPrimary mb-6 flex items-center gap-2">🏛️ Famous Places</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {country.famousPlaces.map((place, i) => (
                    <motion.div
                      key={i}
                      className="glass-card-hover overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      whileHover={{ y: -4 }}
                    >
                      <img src={place.image} alt={place.name} className="w-full h-56 object-cover" />
                      <div className="p-5">
                        <h4 className="font-display font-semibold text-textPrimary text-xl mb-2">{place.name}</h4>
                        <p className="text-textSecondary">{place.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Virtual Tours Tab */}
            {activeTab === 'tours' && (
              <div>
                <h3 className="font-display text-xl font-semibold text-textPrimary mb-6 flex items-center gap-2">🎥 Virtual Tours</h3>
                {country.virtualTours?.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {country.virtualTours.map((tour, i) => (
                      <motion.div
                        key={i}
                        className="glass-card overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                      >
                        <div className="aspect-video">
                          <iframe
                            src={tour.url}
                            title={tour.name}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-display font-semibold text-textPrimary">{tour.name}</h4>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">🎬</p>
                    <p className="text-textSecondary">Virtual tours coming soon</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CountryPage;
