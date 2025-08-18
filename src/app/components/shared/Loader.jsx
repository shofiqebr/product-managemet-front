import "./loader.css";

const Loader = () => {
  return (
    <div className="h-screen fixed top-0 left-0 flex w-full bg-black bg-opacity-55 items-center justify-center z-50">
      <svg className="spinner" viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  );
};

export default Loader;
