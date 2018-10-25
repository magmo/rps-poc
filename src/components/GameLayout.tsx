import React from 'react';
import NavigationBarContainer from "src/containers/NavigationBarContainer";
import GameBarContainer from "src/containers/GameBarContainer";

export const GameLayout = (props) => {
  return (
    <div className="w-100">
      <NavigationBarContainer />
      <GameBarContainer />

      <div className="container centered-container w-100">
        {props.children}
      </div>
    </div>
  );
};
