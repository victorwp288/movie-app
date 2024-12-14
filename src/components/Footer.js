import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <footer className="bg-black text-white-50 py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p className="mb-0">© {currentYear} IMDb Clone. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
