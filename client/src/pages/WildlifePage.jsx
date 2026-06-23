import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaVolumeUp, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import countries from '../data/countries';

const conservationColors = {
  'Least Concern': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Near Threatened': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Vulnerable': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Endangered': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Critically Endangered': 'bg-rose-600/20 text-rose-400 border-rose-600/30',
  'Domesticated': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
};

const WildlifePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  // Flatten all wildlife from all countries
  const allWildlife = useMemo(() => {
    const list = [];
    countries.forEach(country => {
      if (country.wildlife) {
        country.wildlife.forEach(animal => {
          list.push({ ...animal, countryName: country.name, countryCode: country.code });
        });
      }
    });
    // Remove duplicates by name (if any animal exists in multiple countries)
    const unique = [];
    const seen = new Set();
    list.forEach(animal => {
      if (!seen.has(animal.name)) {
        seen.add(animal.name);
        unique.push(animal);
      }
    });
    return unique;
  }, []);

  const filteredWildlife = allWildlife.filter(animal => 
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.countryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlaySound = () => {
    toast('🔊 Audio coming soon!', { icon: '🦁' });
  };

  return (
    <div className="min-h-screen bg-bgPrimary p-6 lg:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-forest-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sunset-600/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="font-display text-4xl lg:text-5xl font-bold text-textPrimary mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Global Wildlife Safari 🌍
          </motion.h1>
          <motion.p 
            className="text-textSecondary text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Discover the incredible animals that share our planet. Explore their habitats, learn fascinating facts, and understand their conservation status.
          </motion.p>
        </div>

        {/* Search */}
        <motion.div 
          className="max-w-xl mx-auto mb-12 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" />
          <input
            type="text"
            placeholder="Search by animal or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bgSecondary border border-borderColor rounded-full py-3 pl-12 pr-4 text-textPrimary focus:outline-none focus:border-forest-500/50 transition-colors"
          />
        </motion.div>

        {/* Grid */}
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredWildlife.map((animal, i) => (
            <motion.div
              key={i}
              className="glass-card-hover overflow-hidden group cursor-pointer"
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedAnimal(animal)}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={animal.image} alt={animal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-3xl drop-shadow-lg">{animal.emoji}</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-semibold border uppercase tracking-wider backdrop-blur-sm ${conservationColors[animal.conservation] || 'bg-gray-500/20 text-gray-400'}`}>
                    {animal.conservation}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-textPrimary text-xl mb-1">{animal.name}</h3>
                <p className="text-textSecondary text-sm flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-forest-400" /> {animal.countryName}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredWildlife.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="font-display text-xl text-textPrimary mb-2">No animals found</h3>
            <p className="text-textSecondary">Try searching for a different animal or country.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAnimal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAnimal(null)}
          >
            <motion.div
              className="bg-[#0f0f23] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-borderColor shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 md:h-80">
                <img src={selectedAnimal.image} alt={selectedAnimal.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f23] to-transparent" />
                <button 
                  onClick={() => setSelectedAnimal(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black text-textPrimary rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 md:p-8 -mt-20 relative z-10">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-5xl">{selectedAnimal.emoji}</span>
                      <h2 className="font-display text-4xl font-bold text-textPrimary">{selectedAnimal.name}</h2>
                    </div>
                    <p className="text-textSecondary text-lg flex items-center gap-2">
                      <FaMapMarkerAlt className="text-forest-400" /> Native to {selectedAnimal.countryName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${conservationColors[selectedAnimal.conservation] || 'bg-gray-500/20 text-gray-400'}`}>
                      {selectedAnimal.conservation}
                    </span>
                    <button 
                      onClick={handlePlaySound}
                      className="p-3 bg-bgSecondary hover:bg-forest-500/20 text-textPrimary hover:text-forest-400 rounded-full transition-colors border border-borderColor"
                      title="Play Sound"
                    >
                      <FaVolumeUp />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="bg-bgSecondary rounded-xl p-6 border border-borderColor">
                    <h3 className="font-display text-xl text-passport-gold mb-4">Habitat</h3>
                    <p className="text-white/80 leading-relaxed">{selectedAnimal.habitat}</p>
                  </div>
                  <div className="bg-bgSecondary rounded-xl p-6 border border-borderColor">
                    <h3 className="font-display text-xl text-passport-gold mb-4">Interesting Facts</h3>
                    <ul className="space-y-3">
                      {selectedAnimal.facts.map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-white/80">
                          <span className="text-forest-400 mt-1">•</span>
                          <span className="leading-relaxed">{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WildlifePage;
