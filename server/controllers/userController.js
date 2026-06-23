import User from '../models/User.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, age, favoriteAnimal, dreamDestination } = req.body;
    if (name) user.name = name;
    if (age) user.age = age;
    if (favoriteAnimal) user.favoriteAnimal = favoriteAnimal;
    if (dreamDestination) user.dreamDestination = dreamDestination;
    
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    } else if (req.body.profilePicture) {
      user.profilePicture = req.body.profilePicture;
    }

    const updated = await user.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// @desc    Mark country as visited
// @route   POST /api/users/visit-country
export const visitCountry = async (req, res) => {
  try {
    const { countryCode, countryName } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.visitedCountries.includes(countryCode)) {
      return res.status(400).json({ message: 'Country already visited' });
    }

    user.visitedCountries.push(countryCode);
    user.stamps.push({ country: countryName, countryCode });
    user.explorerPoints += 100;

    // Check achievements
    const newAchievements = checkAchievements(user);
    newAchievements.forEach(a => {
      if (!user.achievements.includes(a)) {
        user.achievements.push(a);
      }
    });

    await user.save();

    res.json({
      visitedCountries: user.visitedCountries,
      stamps: user.stamps,
      explorerPoints: user.explorerPoints,
      achievements: user.achievements,
      newAchievements: newAchievements.filter(a => !user.achievements.includes(a) || newAchievements.includes(a)),
    });
  } catch (error) {
    console.error('Visit country error:', error);
    res.status(500).json({ message: 'Error marking country as visited' });
  }
};

// @desc    Get user stats
// @route   GET /api/users/stats
export const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const totalCountries = 25; // Our curated list
    const visitedCount = user.visitedCountries.length;
    const progressPercentage = Math.round((visitedCount / totalCountries) * 100);

    res.json({
      visitedCount,
      totalCountries,
      progressPercentage,
      explorerPoints: user.explorerPoints,
      achievementCount: user.achievements.length,
      stampCount: user.stamps.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

// Achievement check logic
function checkAchievements(user) {
  const achievements = [];
  const visited = user.visitedCountries.length;

  if (visited >= 1) achievements.push('first_explorer');
  if (visited >= 5) achievements.push('mountain_explorer');
  if (visited >= 10) achievements.push('world_traveler');
  if (visited >= 15) achievements.push('ocean_discoverer');
  if (visited >= 20) achievements.push('wildlife_lover');
  if (visited >= 25) achievements.push('master_explorer');

  return achievements;
}
