import React from 'react';
import NavigationBarContainer from "../containers/NavigationBarContainer";

import MAGMO_LOGO from '../images/magmo_logo.svg';

export const ApplicationLayout = (props) => {
  return (
    <div className="w-100">
      <NavigationBarContainer />

      <div className="container centered-container w-100">
        {props.children}
      </div>


      <footer className="footer">
        <div className="container">
          <div className="float-right">
            <img src={MAGMO_LOGO} />
          </div>
        </div>
      </footer>
    </div>
  );
};
