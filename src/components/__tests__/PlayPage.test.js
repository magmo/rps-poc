import React from 'react';
import ReactDOM from 'react-dom';
import PlayPage from '../PlayPage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PlayPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
