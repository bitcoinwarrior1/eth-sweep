import React, { Component } from 'react';
import Token from "./token";

class sweep extends Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        const {account, to, provider, helpers} = this.props;
        const tokens = this.props.balancesMapping.map((balanceObj) => {
            return <Token balanceObj={balanceObj} account={account} to={to} provider={provider} helpers={helpers}/>
        });

        return (
            <div>
                <div id="results">
                    <div className="grid-container">
                        <div className="grid-item">Coin</div>
                        <div className="grid-item">Balance</div>
                        <div className="grid-item">Type</div>
                        <div className="grid-item">Action</div>
                    </div>
                </div>
                <div className="grid-container">
                    <div className="grid-items">ETH</div>
                    <div className="grid-items">{this.props.balance / 1e18}</div>
                    <div className="grid-items">Ether</div>
                    <div className="grid-items">
                        <button className="btn btn-danger" id="sweepAllETH" onClick={ () => { this.props.helpers.sendAllEth().then(console.log).catch(console.error) } }>Sweep All ETH</button>
                    </div>
                </div>
                <div className="grid-container">
                    <div className="grid-items">ALL</div>
                    <div className="grid-items">ALL</div>
                    <div className="grid-items">ALL</div>
                    <div className="grid-items">
                        <button className="btn btn-danger" id="sweepAllTokens" onClick={ () => { this.props.helpers.sendAllTokens(this.props.balancesMapping).then(console.log).catch(console.error) } }>Sweep All Tokens</button>
                    </div>
                </div>
                {tokens}
            </div>
        )
    }
}

export default sweep;
