import React, { Component } from 'react';
import { formatFixed } from '@ethersproject/bignumber';
import { zksyncSupportedTokens } from '../helpers/constants';

class token extends Component {

    state = {
        swapButton: "",
        l2MigrationButton: ""
    }

    constructor(props) {
        super(props);
        this.props = props;
    }

    setTransferClick(balanceObj) {
        this.props.helpers.transferToken(balanceObj)
            .then(console.log)
            .catch(console.error);
    }

    setL2MigrationButton() {
        //TODO do includes or something more logical here
        const { balanceObj } = this.props;
        const zksyncSupportedToken = zksyncSupportedTokens.filter((token) => {
            return token.address === balanceObj.address;
        })[0];
        if(zksyncSupportedToken !== undefined) {
            const button = (<button className="btn btn-danger" onClick={ () => { this.props.helpers.migrateToZksync(balanceObj).then(console.log).catch(console.error) } }> Migrate to L2</button>)
            this.setState({ l2MigrationButton: button });
        }
    }

    async set1InchButton() {
        const { balanceObj } = this.props;
        const quote = await this.props.helpers.getQuoteInEth1Inch(balanceObj);
        if(!!quote) {
            const button = (<button className="btn btn-success" onClick={ () => { this.props.helpers.tradeToEthWith1Inch(balanceObj).then(console.log).catch(console.error) } }>Swap for {quote} ETH</button>);
            this.setState({ swapButton: button })
        }
    }

    componentDidMount() {
        this.setL2MigrationButton()
        return this.set1InchButton();
    }

    render() {
        const { name, balance, decimals, type } = this.props.balanceObj;
        try {
            let formattedBalance = formatFixed(balance.toString(), Math.max(parseInt(decimals.toString()), 1)).toString();
            if(type === "ERC721" && formattedBalance.length > 19) {
                formattedBalance = formattedBalance.substring(0, 19) + "...";
            }
            return (
                <div>
                    <div className="grid-container">
                        <div className="grid-items">{name}</div>
                        <div className="grid-items">{formattedBalance}</div>
                        <div className="grid-items">{type}</div>
                        <div className="grid-items">
                            <button className="btn btn-primary" onClick={() => { this.setTransferClick(this.props.balanceObj) }}> Transfer</button>
                            {this.state.l2MigrationButton}
                            {this.state.swapButton}
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
