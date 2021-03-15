import React, { Component } from 'react';
import '../App.css';
import { ethers } from 'ethers';
import Helpers from '../helpers/helpers';
import Sweep from './sweep';
const APIKeyString = "&apikey=ANVBH7JCNH1BVHJ1NPB5FH1WKP5C6YSYJW";

class main extends Component {

    state = {
        balance: undefined,
        to: undefined,
        account: undefined,
        helpers: undefined,
        balancesMapping: undefined
    }

    constructor(props) {
        super(props);
        this.setReadyClick = this.setReadyClick.bind(this);
        this.load = this.load.bind(this);
    }

    async load() {
        const accounts = await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
        const balance = await provider.getBalance(accounts[0]);
        this.setState({ balance: balance });
        this.setState({ account: accounts[0] });
        const helpers = new Helpers(provider, accounts[0], APIKeyString, this.state.to, parseInt(window.ethereum.chainId));
        this.setState({ helpers: helpers });
        const balancesMapping = await helpers.getTokenBalances();
        this.setState({ balancesMapping: balancesMapping });
        document.getElementById("loading").hidden = true;
    }

    setReadyClick() {
        const to = document.getElementById("transferTo").value;
        const isAddress = ethers.utils.isAddress(to);
        if(!isAddress) {
            return alert("Invalid address provided, please try again");
        } else {
            document.getElementById("loading").hidden = false;
            this.setState({ to: to });
            this.load();
        }
    }

    render() {
        let sweepElement;
        if(!!this.state.balancesMapping) {
            sweepElement = <Sweep
                balance={this.state.balance.toString()}
                account={this.state.account}
                helpers={this.state.helpers}
                to={this.state.to}
                balancesMapping={this.state.balancesMapping}
            />
        }
        return (
            <div>
                <div className="jumbotron">
                    <div id="titles">
                        <h1>eth-sweep</h1>
                        <h2>Sweep your ethereum wallet</h2>
                    </div>
                </div>
                <div id="startBox">
                    <input id="transferTo" type="text" placeholder="Paste the ethereum address you wish to transfer to"/>
                    <br/>
                    <br/>
                    <button className="btn btn-primary" id="ready" onClick={this.setReadyClick}> Begin </button>
                    <h3 id="loading" hidden>Loading, please wait...</h3>
                </div>
                <br/>
                {sweepElement}
            </div>
        )
    }
}

export default main;
