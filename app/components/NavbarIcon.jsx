export default function NavbarIcon({ icon, onClick }) {
    return (
      <button onClick={onClick} className="text-xl text-gray-600 hover:text-black">
        {icon}
      </button>
    );
  }
  