import "./style.scss";

import homeMain from "../../../assets/images/home-main.png";

const HomePage = () => {
  return (
    <section id="home">
      <div className="container">
        <div className="home-section">
          <div className="home-section__info">
            <h2>Providing Industry Leading Solutions</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Habitant
              cras morbi hendrerit nunc vel sapien. In habitasse at diam
              suspendisse non vitae fermentum, pharetra arcu. Viverra a morbi ut
              donec in. Ac diam, at sed cras nisi.
            </p>
          </div>
          <div className="home-section__img">
            <img src={homeMain} alt="home main" />
          </div>
        </div>
        <div className="about-section">
          <div className="about-section__left">
            <h2>About Company</h2>
          </div>
          <div className="about-section__right">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget duis
              mi nunc bibendum. Tellus elementum nec lorem eget dictumst. Risus
              in gravida eu, enim lorem. Sed consequat ut suspendisse eros. Nunc
              nunc accumsan, viverra enim. Mi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
