import React from "react";

const Contact = () => {
  return (
    <div className="contact">
      <span className="text">
        <h2>Contact</h2>
        Si vous souhaitez être recenser dans notre annuaire :
        <br />
        <br />
        <span>
          Envoyez-nous par{" "}
          <a href="mailto:animation.territoire@sevadec.com">mail</a>
          <br />
          ce document dûment rempli.
          <a
            className="document"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.sevadec.fr/wp-content/uploads/2022/07/DOC-A-REMPLIR-Inscription-annuaire-EC-SEVADEC.pdf"
          >
            <img
              className="download"
              src="downloadIcon.png"
              alt="downloadIcon.png"
            />
          </a>
        </span>
        <br />
        <span>
          Si vous souhaitez apporter une modification ou ne plus faire partie de
          l'annuaire faites le nous savoir par{" "}
          <a href="mailto:animation.territoire@sevadec.com">mail</a>.
        </span>
      </span>
    </div>
  );
};

export default Contact;
