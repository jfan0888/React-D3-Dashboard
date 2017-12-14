import React, { PropTypes } from 'react';

import Header from './base/Header';
import Footer from './base/Footer';

function App({ children }) {
  return (
    <div className="main-container">
      <Header />
        <div className="page-wrapper">
            <div className="page-inner">
            {children}
            </div>
        </div>
      <Footer />
    </div>
  );
}

App.propTypes = { children: PropTypes.object };

export default App;
