export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__copy">
        Copyright © {new Date().getFullYear()} Afra's Note Space, Inc. Built with{" "}
        <strong>React + TypeScript + Vite</strong>.
      </p>
    </footer>
  );
}
