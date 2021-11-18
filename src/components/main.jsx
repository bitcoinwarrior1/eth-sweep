import React, { Component } from 'react';
import '../App.css';
import { ethers } from 'ethers';
import helpers from '../helpers/helpers';
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
        const h = new helpers(provider, accounts[0], APIKeyString, this.state.to, parseInt(window.ethereum.chainId));
        this.setState({ helpers: h });
        const balancesMapping = await h.getTokenBalances();
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
                    </div>
                </div>
                <div id="gh">
                    <a href="https://github.com/James-Sangalli/eth-sweep" target="_blank">
                        <img alt="GitHub" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/2048px-Octicons-mark-github.svg.png" width="40" height="40"/>
                    </a>
                </div>
                <div id="startBox">
                    <h5 id="description">
                        <i>This website allows you to easily sweep your ethereum wallet's funds to another address,
                            transfer them to a Layer 2 wallet on <a href={"https://zksync.io/"}>ZkSync</a>  or sweep all the tokens into Ether via <a href={"https://1inch.exchange/"}>1inch</a>.</i>
                    </h5>
                    <br/>
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
