import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaHeart, FaGlobeAmericas, FaCamera, FaArrowRight, FaArrowLeft, FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const animals = ['🐯 Tiger', '🦁 Lion', '🐘 Elephant', '🐼 Panda', '🐺 Wolf', '🦅 Eagle', '🐬 Dolphin', '🦋 Butterfly', '🐢 Turtle', '🦊 Fox', '🐧 Penguin', '🦒 Giraffe', '🐻 Bear', '🦜 Parrot', '🐨 Koala', '🦭 Seal', '🐆 Leopard', '🦩 Flamingo', '🐋 Whale', '🦉 Owl'];

const destinations = [
  { name: 'Switzerland', flag: '🇨🇭' }, { name: 'Japan', flag: '🇯🇵' }, { name: 'Italy', flag: '🇮🇹' },
  { name: 'France', flag: '🇫🇷' }, { name: 'India', flag: '🇮🇳' }, { name: 'Australia', flag: '🇦🇺' },
  { name: 'Brazil', flag: '🇧🇷' }, { name: 'South Africa', flag: '🇿🇦' }, { name: 'Iceland', flag: '🇮🇸' },
  { name: 'New Zealand', flag: '🇳🇿' }, { name: 'Greece', flag: '🇬🇷' }, { name: 'Norway', flag: '🇳🇴' },
  { name: 'Egypt', flag: '🇪🇬' }, { name: 'Peru', flag: '🇵🇪' }, { name: 'Thailand', flag: '🇹🇭' },
  { name: 'Kenya', flag: '🇰🇪' }, { name: 'Canada', flag: '🇨🇦' }, { name: 'Mexico', flag: '🇲🇽' },
  { name: 'Nepal', flag: '🇳🇵' }, { name: 'Argentina', flag: '🇦🇷' },
];

const steps = [
  { title: 'Your Identity', subtitle: 'Tell us about yourself', icon: FaUser },
  { title: 'Spirit Animal', subtitle: 'Choose your companion', icon: FaHeart },
  { title: 'Dream Destination', subtitle: 'Where would you go first?', icon: FaGlobeAmericas },
  { title: 'Profile Photo', subtitle: 'Show your explorer face', icon: FaCamera },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', age: '',
    favoriteAnimal: '', dreamDestination: '', profilePicture: '',
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('age', form.age);
      formData.append('favoriteAnimal', form.favoriteAnimal);
      formData.append('dreamDestination', form.dreamDestination);
      if (form.profilePictureFile) {
        formData.append('profilePicture', form.profilePictureFile);
      }

      await register(formData);
      toast.success('🎉 Welcome, Explorer! Your passport is ready!');
      navigate('/passport');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return form.name && form.email && form.password && form.age;
      case 1: return form.favoriteAnimal;
      case 2: return form.dreamDestination;
      case 3: return true;
      default: return false;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, profilePicture: reader.result, profilePictureFile: file }));
      reader.readAsDataURL(file);
    }
  };

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
  };

  const [direction, setDirection] = useState(0);

  const next = () => { if (canProceed()) { setDirection(1); setStep(s => s + 1); } };
  const prev = () => { setDirection(-1); setStep(s => s - 1); };

  return (
    <div className="min-h-screen bg-bgPrimary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-ocean-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sunset-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        className="relative w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-gradient-to-r from-ocean-500 to-sunset-500' : 'bg-bgSecondary'
              }`} />
              <p className={`text-xs mt-2 text-center transition-colors ${i <= step ? 'text-textSecondary' : 'text-textSecondary'}`}>
                {s.title}
              </p>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card p-8 relative overflow-hidden">
          {/* Step Header */}
          <div className="text-center mb-8">
            <motion.div
              key={step}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex w-16 h-16 items-center justify-center rounded-full bg-gradient-to-br from-ocean-500/20 to-sunset-500/20 border border-borderColor mb-4"
            >
              {(() => {
                const StepIcon = steps[step].icon;
                return <StepIcon className="text-2xl text-ocean-400" />;
              })()}
            </motion.div>
            <h2 className="font-display text-2xl font-bold text-textPrimary">{steps[step].title}</h2>
            <p className="text-textSecondary text-sm mt-1">{steps[step].subtitle}</p>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-textSecondary mb-1 block">Explorer Name</label>
                    <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-bgSecondary border border-borderColor text-textPrimary placeholder-white/30 focus:border-ocean-500 focus:outline-none focus:ring-1 focus:ring-ocean-500/50 transition-all"
                      placeholder="Enter your name" />
                  </div>
                  <div>
                    <label className="text-sm text-textSecondary mb-1 block">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-bgSecondary border border-borderColor text-textPrimary placeholder-white/30 focus:border-ocean-500 focus:outline-none focus:ring-1 focus:ring-ocean-500/50 transition-all"
                      placeholder="explorer@journey.com" />
                  </div>
                  <div>
                    <label className="text-sm text-textSecondary mb-1 block">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                        className="w-full px-4 pr-12 py-3 rounded-xl bg-bgSecondary border border-borderColor text-textPrimary placeholder-white/30 focus:border-ocean-500 focus:outline-none focus:ring-1 focus:ring-ocean-500/50 transition-all"
                        placeholder="Min 6 characters" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textSecondary transition-colors">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-textSecondary mb-1 block">Age</label>
                    <input type="number" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-bgSecondary border border-borderColor text-textPrimary placeholder-white/30 focus:border-ocean-500 focus:outline-none focus:ring-1 focus:ring-ocean-500/50 transition-all"
                      placeholder="Your age" min="1" max="150" />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {animals.map((animal) => (
                    <motion.button
                      key={animal}
                      onClick={() => setForm(p => ({ ...p, favoriteAnimal: animal }))}
                      className={`px-3 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                        form.favoriteAnimal === animal
                          ? 'bg-gradient-to-r from-ocean-500/30 to-sunset-500/30 border-ocean-400 text-textPrimary border'
                          : 'bg-bgSecondary border border-borderColor text-textSecondary hover:bg-bgSecondary'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {animal}
                    </motion.button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {destinations.map(({ name, flag }) => (
                    <motion.button
                      key={name}
                      onClick={() => setForm(p => ({ ...p, dreamDestination: name }))}
                      className={`px-3 py-3 rounded-xl text-sm font-medium transition-all text-left flex items-center gap-2 ${
                        form.dreamDestination === name
                          ? 'bg-gradient-to-r from-ocean-500/30 to-sunset-500/30 border-ocean-400 text-textPrimary border'
                          : 'bg-bgSecondary border border-borderColor text-textSecondary hover:bg-bgSecondary'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-lg">{flag}</span> {name}
                    </motion.button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="text-center">
                  <div className="mb-6">
                    {form.profilePicture ? (
                      <div className="relative inline-block">
                        <img src={form.profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-ocean-500/50 mx-auto" />
                        <button onClick={() => setForm(p => ({ ...p, profilePicture: '' }))}
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-textPrimary flex items-center justify-center text-sm hover:bg-red-600">
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer group">
                        <div className="w-32 h-32 rounded-full bg-bgSecondary border-2 border-dashed border-borderColor mx-auto flex flex-col items-center justify-center gap-2 group-hover:border-ocean-400 group-hover:bg-ocean-500/10 transition-all">
                          <FaCamera className="text-2xl text-textSecondary group-hover:text-ocean-400 transition-colors" />
                          <span className="text-xs text-textSecondary group-hover:text-ocean-400">Upload Photo</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    )}
                  </div>
                  <p className="text-textSecondary text-sm mb-6">Optional — you can add this later</p>

                  {/* Summary */}
                  <div className="glass-card p-4 text-left space-y-2">
                    <h3 className="text-sm font-display text-textSecondary mb-3 text-center">Your Explorer Profile</h3>
                    <div className="flex justify-between items-center py-1 border-b border-borderColor">
                      <span className="text-textSecondary text-sm">Name</span>
                      <span className="text-textPrimary font-medium text-sm">{form.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-borderColor">
                      <span className="text-textSecondary text-sm">Age</span>
                      <span className="text-textPrimary font-medium text-sm">{form.age}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-borderColor">
                      <span className="text-textSecondary text-sm">Spirit Animal</span>
                      <span className="text-textPrimary font-medium text-sm">{form.favoriteAnimal}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-textSecondary text-sm">Dream Destination</span>
                      <span className="text-textPrimary font-medium text-sm">{form.dreamDestination}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <motion.button onClick={prev} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-bgSecondary border border-borderColor text-textSecondary hover:bg-bgSecondary transition-all">
                <FaArrowLeft className="text-sm" /> Back
              </motion.button>
            ) : (
              <button onClick={() => navigate('/')} className="flex items-center gap-2 px-6 py-2.5 rounded-full text-textSecondary hover:text-textSecondary transition-all">
                ← Home
              </button>
            )}

            {step < 3 ? (
              <motion.button onClick={next} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${
                  canProceed()
                    ? 'btn-primary'
                    : 'bg-bgSecondary text-textSecondary cursor-not-allowed'
                }`}>
                Next <FaArrowRight className="text-sm" />
              </motion.button>
            ) : (
              <motion.button onClick={handleSubmit} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="flex items-center gap-2 btn-sunset px-8">
                {loading ? (
                  <span className="loading-spinner w-5 h-5" />
                ) : (
                  <><FaCheck /> Create Passport</>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-textSecondary text-sm">
          Already have a passport?{' '}
          <button onClick={() => navigate('/login')} className="text-ocean-400 hover:text-ocean-300 underline underline-offset-4 transition-colors">
            Login here
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
