// Colours for users who have not uploaded a photo. Chosen to stay readable
// with white text on our dark background.
const COLORS = [
  "#6366f1", // indigo
  "#0284c7", // sky
  "#059669", // emerald
  "#d97706", // amber
  "#e11d48", // rose
  "#7c3aed", // violet
  "#0d9488", // teal
  "#db2777", // pink
];

// "John Doe" -> "JD", "Emma" -> "E"
function getInitials(name = "") {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";

  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

// Add up the character codes and pick a colour with the remainder. The same
// name always lands on the same colour, so a user's avatar never changes.
function getColor(name = "") {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return COLORS[sum % COLORS.length];
}

/**
 * Shows the user's photo, or a coloured circle with their initials.
 * Pass both the size and the text size in `className`, e.g. "size-11 text-sm".
 */
const Avatar = ({ user, className = "size-10 text-sm" }) => {
  const name = user?.fullName || "";

  if (user?.profilePic) {
    return (
      <img
        src={user.profilePic}
        alt={name}
        className={`${className} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      title={name}
      style={{ backgroundColor: getColor(name) }}
      className={`${className} rounded-full flex items-center justify-center
        font-semibold text-white select-none tracking-wide`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
