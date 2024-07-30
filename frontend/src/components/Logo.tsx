import logoImage from "/logo.webp";

export const Logo = () => {
  return (
    <header>
      <img
        id="logo"
        src={logoImage}
        alt="Crag Supply Co."
        title="Crag Supply Co."
      />
    </header>
  );
};
