const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p>Copyright © {year} Resumind. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
