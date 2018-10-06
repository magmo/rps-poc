import { PureComponent } from "react";
import Button from "../../components/Button";
import React from 'react';
interface Props {
    selectAddress(address: string);
}
interface State {
    address: string;
}
export default class WithdrawFunds extends PureComponent<Props, State>{
    constructor(props) {
        super(props);
        this.state = { address: web3.eth.defaultAccount };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({ address: event.target.value });
    }

    render() {
        return (
            <form>
                <input type="text" value={this.state.address} onChange={this.handleChange} />
                <Button onClick={()=>this.props.selectAddress(this.state.address)}>Withdraw Funds</Button>
            </form>

        );
    }
}