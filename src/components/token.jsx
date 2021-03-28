import React, { Component } from 'react';
import { formatFixed } from '@ethersproject/bignumber';
import { zksyncSupportedTokens } from '../helpers/constants';

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

    createL2MigrationButton(balanceObj) {
        //TODO do includes or something more logical here
        const zksyncSupportedToken = zksyncSupportedTokens.filter((token) => {
            return token.address === balanceObj.address;
        })[0];
        if(zksyncSupportedToken !== undefined) {
           return (<button className="btn btn-danger" onClick={ () => { this.props.helpers.migrateToZksync(balanceObj, this.props.account).then(console.log).catch(console.error) } }> Migrate to L2</button>)
        }
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
                            {this.createL2MigrationButton(this.props.balanceObj)}
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
