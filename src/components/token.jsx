import React, { Component } from 'react';
import { formatFixed } from "@ethersproject/bignumber";

class token extends Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    setTransferClick(balanceObj) {
        this.props.helpers.transferToken(this.props.to, balanceObj)
            .then(console.log)
            .catch(console.error);
    }

    render() {
        const { name, balance, decimals, type } = this.props.balanceObj;
        try {
            const formattedBalance = formatFixed(balance.toString(), Math.max(parseInt(decimals.toString()), 1));
            return (
                <div>
                    <div className="grid-container">
                        <div className="grid-items">{name}</div>
                        <div className="grid-items">{formattedBalance.toString()}</div>
                        <div className="grid-items">{type}</div>
                        <div className="grid-items">
                            <button className="btn btn-primary" onClick={() => { this.setTransferClick(this.props.balanceObj) }}> Transfer</button>
                        </div>
                    </div>
                </div>
            )
        } catch (e) {
            return (<div/>)
        }
    }
}

export default token;
