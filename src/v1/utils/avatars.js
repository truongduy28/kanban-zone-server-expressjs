const avatarImages = [
  "doraemon.jpeg",
  "goten.jpeg",
  "nobita.webp",
  "songoku.jpeg",
  "trunk.jpeg",
  "vegeta.jpeg",
  "xuka.jpeg",
];

// Function to select a random avatar
const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatarImages.length);
  return avatarImages[randomIndex];
};

module.exports = { getRandomAvatar };
