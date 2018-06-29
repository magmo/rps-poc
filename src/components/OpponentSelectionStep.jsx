import React from 'react';

import Button from './Button';

export default class OpponentSelectionStep extends React.PureComponent {
  constructor(props) {
    super(props);

    this.nameInput = React.createRef();
    this.wagerInput = React.createRef();

    this.onClickCreateChallenge.bind(this);
  }

  render() {
    const { opponents, handleSelectChallenge } = this.props;

    return (
      <div style={{ maxWidth: '90%', margin: 'auto' }}>
        <div>
          <h1>Select an opponent:</h1>
        </div>
        <div
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            position: 'absolute',
          }}
        >
          <table style={{ textAlign: 'left' }}>
            <tbody>
              <tr style={{ height: 60 }}>
                <th>Name</th>
                <th>Wager (Finney)</th>
                <th>Time initiated</th>
                <th />
              </tr>
              {opponents.map(opponent => (
                <tr key={opponent.id}>
                  <td>{opponent.name}</td>
                  <td>{opponent.wager}</td>
                  <td>{opponent.timestamp}</td>
                  <td>
                    <Button
                      onClick={() =>
                        handleSelectChallenge({ opponentId: opponent.id, stake: opponent.wager })}
                    >
                      Challenge
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form>
            <h3>Or, create a challenge:</h3>
            <div style={{ marginTop: 12 }}>
              Name:
              <input style={{ marginLeft: 12 }} type="text" name="name" ref={this.nameInput} />
            </div>
            <div style={{ marginTop: 12 }}>
              Wager (in Finney):
              <input style={{ marginLeft: 12 }} type="text" name="wager" ref={this.wagerInput} />
            </div>
            <div style={{ marginTop: 12 }}>
              <Button onClick={this.onClickCreateChallenge.bind(this)}>Submit</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  onClickCreateChallenge() {
    const name = this.nameInput.current.value;
    const wager = Number(this.wagerInput.current.value);
    if (!name || !wager) {
      return;
    }

    this.props.handleCreateChallenge(name, wager);
  }
}
