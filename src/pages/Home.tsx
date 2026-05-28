import { Link } from "react-router-dom";
import ArtFeatures from "../components/ArtFeatures";

export default function Home() {
  return (
    <>
      <header className="hero hero--primary">
        <div className="hero__inner">
          <h1 className="hero__title">Note Space</h1>
          <p className="hero__subtitle">ENJOY BEING IN THE PROCESS OF BECOMING</p>
          <div className="hero__buttons">
            <Link className="btn btn--secondary btn--lg" to="/hello">
              LET'S SAY HI !
            </Link>
          </div>
        </div>
      </header>
      <ArtFeatures />
    </>
  );
}
