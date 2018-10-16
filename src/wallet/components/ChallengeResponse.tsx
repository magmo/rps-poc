import React from 'react';
import Button from 'reactstrap/lib/Button';
import { ChallengeResponse as ResponseOption, RespondWithMove, RespondWithAlternativeMove, Refute, Conclude } from '../domain/ChallengeResponse';
interface Props {
    responseOptions: ResponseOption[];
    expiryTime: number;
    selectMoveResponse: ()=>void;
}

export default class ChallengeResponse extends React.PureComponent<Props> {
    render() {
        const { responseOptions, expiryTime, selectMoveResponse } = this.props;
        const parsedExpiryDate = new Date(expiryTime * 1000).toLocaleDateString();
        return (
            <div>
                <h1>A challenge has been detected!</h1>
                <p>
                    A challenge has been detected! The game will automatically conclude by {parsedExpiryDate} if no action is taken.
        </p>
                <p>
                    You can take the following actions:
                    </p>
                <div>
                    {responseOptions.map(option => {
                        if (option instanceof RespondWithMove) {
                            return <Button onClick={selectMoveResponse} key={option.toString()} >Respond with Move</Button>;
                        }
                        else if (option instanceof RespondWithAlternativeMove) {
                            return <Button key={option.toString()} >Respond with Alternative Move</Button>;
                        }
                        else if (option instanceof Refute) {
                            return <Button key={option.toString()} >Refute</Button>;
                        }
                        else if (option instanceof Conclude) {
                            return <Button key={option.toString()} >Conclude</Button>;
                        } else {
                            return null;
                        }

                    })}
                </div>
            </div>
        );

    }
}
