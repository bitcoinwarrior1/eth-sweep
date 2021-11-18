(this["webpackJsonpeth-sweep"]=this["webpackJsonpeth-sweep"]||[]).push([[0],{105:function(e,t,a){"use strict";a.r(t);var n=a(7),s=a(17),r=a.n(s),c=a(58),i=a.n(c),d=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,108)).then((function(t){var a=t.getCLS,n=t.getFID,s=t.getFCP,r=t.getLCP,c=t.getTTFB;a(e),n(e),s(e),r(e),c(e)}))},o=(a(70),a(43),a(2)),u=a.n(o),l=a(11),h=a(3),b=a(4),p=a(8),f=a(6),m=a(5),v=a(15),x=a(25),j=a(32),y=a(14),g=a(23),k=a(33),O=a.n(k),w=function(){function e(t,a,n,s,r){Object(h.a)(this,e),this.provider=t,this.account=a,this.APIKeyString=n,this.to=s,this.chainId=r}return Object(b.a)(e,[{key:"sendAllEth",value:function(){var e=Object(l.a)(u.a.mark((function e(){var t,a,n,s,r;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.provider.getBalance(this.account);case 2:return t=e.sent,e.next=5,this.provider.getGasPrice();case 5:return a=e.sent,n={to:this.to,value:t},e.next=9,this.provider.estimateGas(n);case 9:return s=e.sent,r=v.a.BigNumber.from(s).mul(v.a.BigNumber.from(a)),n.value=t.sub(r),e.next=14,this.provider.getSigner().sendTransaction(n);case 14:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"sendAllTokens",value:function(){var e=Object(l.a)(u.a.mark((function e(t){var a,n,s;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=Object(j.a)(t);try{for(a.s();!(n=a.n()).done;)s=n.value,new v.a.Contract(s.address,g.ERC20).connect(this.provider.getSigner()).transfer(this.to,s.balance).then(console.log).catch(console.error)}catch(r){a.e(r)}finally{a.f()}case 2:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"transferToken",value:function(){var e=Object(l.a)(u.a.mark((function e(t){var a;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=new v.a.Contract(t.address,g.ERC20).connect(this.provider.getSigner()),e.abrupt("return",a.transfer(this.to,t.balance));case 5:return e.prev=5,e.t0=e.catch(0),e.abrupt("return",e.t0);case 8:case"end":return e.stop()}}),e,this,[[0,5]])})));return function(t){return e.apply(this,arguments)}}()},{key:"tradeToEthWith1Inch",value:function(){var e=Object(l.a)(u.a.mark((function e(t){var a,n,s,r;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.get1InchTradeData(t);case 2:if(a=e.sent,n=a.tx,!(s=a.approvalAddress)){e.next=13;break}return r=new v.a.Contract(t.address,g.ERC20).connect(this.provider.getSigner()),e.next=9,r.approve(s,y.unlimitedAllowance);case 9:return e.next=11,this.tradeToEthWith1Inch(t);case 11:e.next=14;break;case 13:return e.abrupt("return",this.provider.sendTransaction(n));case 14:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"get1InchTradeData",value:function(){var e=Object(l.a)(u.a.mark((function e(t){var a,n,s,r,c;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a="".concat(y.OneInchAPIURL,"/swap?fromTokenAddress=").concat(t.address,"&toTokenAddress=").concat(y.ethAddress,"&amount=").concat(t.balance.toString(),"&fromAddress=").concat(this.account,"&slippage=",5),e.next=4,O.a.get(a);case 4:return n=e.sent,s=n.body.tx,r=s.to,e.abrupt("return",{response:n,tx:s,DEXAddress:r});case 10:if(e.prev=10,e.t0=e.catch(0),console.error(e.t0),!(c=JSON.parse(e.t0.response.text).message).includes("Not enough allowance")){e.next=16;break}return e.abrupt("return",{approvalAddress:c.substring(c.length-42)});case 16:case"end":return e.stop()}}),e,this,[[0,10]])})));return function(t){return e.apply(this,arguments)}}()},{key:"getQuoteInEth1Inch",value:function(){var e=Object(l.a)(u.a.mark((function e(t){var a,n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a="".concat(y.OneInchAPIURL,"/quote?fromTokenAddress=").concat(t.address,"&toTokenAddress=").concat(y.ethAddress,"&amount=").concat(t.balance.toString()),e.next=4,O.a.get(a);case 4:return n=e.sent,e.abrupt("return",n.body.toTokenAmount/1e18);case 8:e.prev=8,e.t0=e.catch(0),console.error(e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(t){return e.apply(this,arguments)}}()},{key:"migrateEthtoL2",value:function(){var e=Object(l.a)(u.a.mark((function e(t){var a,n,s;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.provider.getGasPrice();case 2:return a=e.sent,59476,n=t-59476*a,s=new v.a.Contract(y.zksyncAddress,g.ZKSYNC).connect(this.provider.getSigner()),e.next=8,s.depositETH(this.to,{value:n.toString()});case 8:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"migrateToZksync",value:function(){var e=Object(l.a)(u.a.mark((function e(t){var a,n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=new v.a.Contract(t.address,g.ERC20).connect(this.provider.getSigner()),e.next=3,a.allowance(this.account,y.zksyncAddress);case 3:if("0x00"!==e.sent._hex){e.next=7;break}return e.next=7,a.approve(y.zksyncAddress,y.unlimitedAllowance);case 7:return n=new v.a.Contract(y.zksyncAddress,g.ZKSYNC).connect(this.provider.getSigner()),e.next=10,n.depositERC20(t.address,t.amount,y.zksyncAddress);case 10:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getTokenBalances",value:function(){var e=Object(l.a)(u.a.mark((function e(){var t,a,n,s;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getERC20Tokens();case 2:return t=e.sent,e.next=5,this.getERC721Tokens();case 5:return a=e.sent,e.next=8,this.getAllERC20Balances(t);case 8:return n=e.sent,e.next=11,this.getAllERC721Balances(a);case 11:return s=e.sent,e.abrupt("return",[].concat(Object(x.a)(n),Object(x.a)(s)));case 13:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"uniq",value:function(e){var t={};return e.filter((function(e){return!t.hasOwnProperty(e)&&(t[e]=!0)}))}},{key:"getAllERC721Balances",value:function(){var e=Object(l.a)(u.a.mark((function e(t){var a,n,s,r,c,i,d,o;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=[],n=this.uniq(t.contractAddresses),s=this.uniq(t.tokenNames),e.t0=u.a.keys(n);case 4:if((e.t1=e.t0()).done){e.next=27;break}r=e.t1.value,c=Object(j.a)(t.tokenIds[n[r]]),e.prev=7,c.s();case 9:if((i=c.n()).done){e.next=17;break}return d=i.value,e.next=13,this.getStillOwnedERC721(d,n[r]);case 13:e.sent&&((o={}).address=n[r],o.type="ERC721",o.balance=d,o.decimals=0,o.name=s[r],a.push(o));case 15:e.next=9;break;case 17:e.next=22;break;case 19:e.prev=19,e.t2=e.catch(7),c.e(e.t2);case 22:return e.prev=22,c.f(),e.finish(22);case 25:e.next=4;break;case 27:return e.abrupt("return",a);case 28:case"end":return e.stop()}}),e,this,[[7,19,22,25]])})));return function(t){return e.apply(this,arguments)}}()},{key:"getAllERC20Balances",value:function(){var e=Object(l.a)(u.a.mark((function e(t){var a,n,s,r,c;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=[],e.t0=u.a.keys(t.contractAddresses);case 2:if((e.t1=e.t0()).done){e.next=17;break}return n=e.t1.value,s=t.contractAddresses[n],e.next=7,this.getERC20Balance(s);case 7:r=e.sent,(c={}).decimals=t.decimals[n],c.address=s,c.balance=r,c.type="ERC20",c.name=t.tokenNames[n],"0"!==r.toString()&&a.push(c),e.next=2;break;case 17:return e.abrupt("return",a);case 18:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getStillOwnedERC721",value:function(){var e=Object(l.a)(u.a.mark((function e(t,a){var n,s;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=new v.a.Contract(a,g.ERC721).connect(this.provider),e.next=4,n.ownerOf(t);case 4:return s=e.sent,e.abrupt("return",s.toLowerCase()===this.account.toLowerCase());case 8:e.prev=8,e.t0=e.catch(0),console.error(e.t0);case 11:case"end":return e.stop()}}),e,this,[[0,8]])})));return function(t,a){return e.apply(this,arguments)}}()},{key:"getERC20Balance",value:function(){var e=Object(l.a)(u.a.mark((function e(t){var a;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=new v.a.Contract(t,g.ERC20).connect(this.provider),e.next=4,a.balanceOf(this.account);case 4:return e.abrupt("return",e.sent);case 7:e.prev=7,e.t0=e.catch(0),console.error(e.t0);case 10:case"end":return e.stop()}}),e,this,[[0,7]])})));return function(t){return e.apply(this,arguments)}}()},{key:"getERC20Tokens",value:function(){var e=Object(l.a)(u.a.mark((function e(){var t,a,n,s,r,c,i,d,o,l;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.getQueryERC20Events(this.chainId,this.account),e.prev=1,a={},n=[],s=[],r=[],e.next=8,O.a.get(t);case 8:c=e.sent,i=c.body.result,d=Object(j.a)(i);try{for(d.s();!(o=d.n()).done;)l=o.value,n.includes(l.contractAddress)||(n.push(l.contractAddress),s.push(l.tokenName),r.push(l.tokenDecimal))}catch(u){d.e(u)}finally{d.f()}return a.tokenNames=s,a.contractAddresses=n,a.decimals=r,e.abrupt("return",a);case 18:e.prev=18,e.t0=e.catch(1),console.error(e.t0);case 21:case"end":return e.stop()}}),e,this,[[1,18]])})));return function(){return e.apply(this,arguments)}}()},{key:"getERC721Tokens",value:function(){var e=Object(l.a)(u.a.mark((function e(){var t,a,n,s,r,c,i,d,o,l,h;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.getQueryERC721Events(this.chainId,this.account),e.prev=1,a={},n=[],s=[],r=[],c={},e.next=9,O.a.get(t);case 9:i=e.sent,d=i.body.result,o=Object(j.a)(d);try{for(o.s();!(l=o.n()).done;)h=l.value,n.push(h.contractAddress),s.push(h.tokenName),r.push(h.tokenDecimal),void 0===c[h.contractAddress]&&(c[h.contractAddress]=[]),c[h.contractAddress].includes(h.tokenID)||c[h.contractAddress].push(h.tokenID)}catch(u){o.e(u)}finally{o.f()}return a.tokenNames=s,a.contractAddresses=n,a.decimals=r,a.tokenIds=c,e.abrupt("return",a);case 20:e.prev=20,e.t0=e.catch(1),console.error(e.t0);case 23:case"end":return e.stop()}}),e,this,[[1,20]])})));return function(){return e.apply(this,arguments)}}()},{key:"getQueryERC20Events",value:function(e){switch(e){case 1:return"https://api.etherscan.io/api?module=account&action=tokentx&address="+this.account+this.APIKeyString;case 3:return"https://ropsten.etherscan.io/api?module=account&action=tokentx&address="+this.account+this.APIKeyString;case 4:return"https://rinkeby.etherscan.io/api?module=account&action=tokentx&address="+this.account+this.APIKeyString;case 42:return"https://kovan.etherscan.io/api?module=account&action=tokentx&address="+this.account+this.APIKeyString;case 56:return"https://api.bscscan.com/api?module=account&action=tokentx&address="+this.account;default:return"https://api.etherscan.io/api?module=account&action=tokentx&address="+this.account+this.APIKeyString}}},{key:"getQueryERC721Events",value:function(e){switch(e){case 1:return"https://api.etherscan.io/api?module=account&action=tokennfttx&address="+this.account+this.APIKeyString;case 3:return"https://ropsten.etherscan.io/api?module=account&action=tokennfttx&address="+this.account+this.APIKeyString;case 4:return"https://rinkeby.etherscan.io/api?module=account&action=tokennfttx&address="+this.account+this.APIKeyString;case 42:return"https://kovan.etherscan.io/api?module=account&action=tokennfttx&address="+this.account+this.APIKeyString;case 56:return"https://api.bscscan.com/api?module=account&action=tokennfttx&address="+this.account;default:return"https://api.etherscan.io/api?module=account&action=tokennfttx&address="+this.account+this.APIKeyString}}}]),e}(),E=a(107),A=function(e){Object(f.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(h.a)(this,a),(n=t.call(this,e)).state={swapButton:"",l2MigrationButton:""},n.props=e,n}return Object(b.a)(a,[{key:"setTransferClick",value:function(e){this.props.helpers.transferToken(e).then(console.log).catch(console.error)}},{key:"setL2MigrationButton",value:function(){var e=this,t=this.props.balanceObj;if(void 0!==y.zksyncSupportedTokens.filter((function(e){return e.address===t.address}))[0]){var a=Object(n.jsx)("button",{className:"btn btn-danger",onClick:function(){e.props.helpers.migrateToZksync(t).then(console.log).catch(console.error)},children:" Migrate to L2"});this.setState({l2MigrationButton:a})}}},{key:"set1InchButton",value:function(){var e=Object(l.a)(u.a.mark((function e(){var t,a,s,r=this;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.props.balanceObj,e.next=3,this.props.helpers.getQuoteInEth1Inch(t);case 3:(a=e.sent)&&(s=Object(n.jsxs)("button",{className:"btn btn-success",onClick:function(){r.props.helpers.tradeToEthWith1Inch(t).then(console.log).catch(console.error)},children:["Swap for ",a," ETH"]}),this.setState({swapButton:s}));case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){return this.setL2MigrationButton(),this.set1InchButton()}},{key:"render",value:function(){var e=this,t=this.props.balanceObj,a=t.name,s=t.balance,r=t.decimals,c=t.type;try{var i=Object(E.b)(s.toString(),Math.max(parseInt(r.toString()),1)).toString();return"ERC721"===c&&i.length>19&&(i=i.substring(0,19)+"..."),Object(n.jsx)("div",{children:Object(n.jsxs)("div",{className:"grid-container",children:[Object(n.jsx)("div",{className:"grid-items",children:a}),Object(n.jsx)("div",{className:"grid-items",children:i}),Object(n.jsx)("div",{className:"grid-items",children:c}),Object(n.jsxs)("div",{className:"grid-items",children:[Object(n.jsx)("button",{className:"btn btn-primary",onClick:function(){e.setTransferClick(e.props.balanceObj)},children:" Transfer"}),this.state.l2MigrationButton,this.state.swapButton]})]})})}catch(d){return Object(n.jsx)("div",{})}}}]),a}(s.Component),C=function(e){Object(f.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(h.a)(this,a),(n=t.call(this,e)).props=e,n}return Object(b.a)(a,[{key:"render",value:function(){var e=this,t=this.props,a=t.account,s=t.to,r=t.provider,c=t.helpers,i=this.props.balancesMapping.map((function(e){return Object(n.jsx)(A,{balanceObj:e,account:a,to:s,provider:r,helpers:c})}));return Object(n.jsxs)("div",{children:[Object(n.jsx)("div",{id:"results",children:Object(n.jsxs)("div",{className:"grid-container",children:[Object(n.jsx)("div",{className:"grid-item",children:"Coin"}),Object(n.jsx)("div",{className:"grid-item",children:"Balance"}),Object(n.jsx)("div",{className:"grid-item",children:"Type"}),Object(n.jsx)("div",{className:"grid-item",children:"Action"})]})}),Object(n.jsxs)("div",{className:"grid-container",children:[Object(n.jsx)("div",{className:"grid-items",children:"ETH"}),Object(n.jsx)("div",{className:"grid-items",children:this.props.balance/1e18}),Object(n.jsx)("div",{className:"grid-items",children:"Ether"}),Object(n.jsxs)("div",{className:"grid-items",children:[Object(n.jsx)("button",{className:"btn btn-primary",id:"sweepAllETH",onClick:function(){e.props.helpers.sendAllEth().then(console.log).catch(console.error)},children:"Transfer"}),Object(n.jsx)("button",{className:"btn btn-danger",id:"migrateEthToL2",onClick:function(){e.props.helpers.migrateEthtoL2(e.props.balance).then(console.log).catch(console.error)},children:"Migrate to L2"})]})]}),Object(n.jsxs)("div",{className:"grid-container",children:[Object(n.jsx)("div",{className:"grid-items",children:"ALL"}),Object(n.jsx)("div",{className:"grid-items",children:"ALL"}),Object(n.jsx)("div",{className:"grid-items",children:"ALL"}),Object(n.jsx)("div",{className:"grid-items",children:Object(n.jsx)("button",{className:"btn btn-danger",id:"sweepAllTokens",onClick:function(){e.props.helpers.sendAllTokens(e.props.balancesMapping).then(console.log).catch(console.error)},children:"Sweep All Tokens"})})]}),i]})}}]),a}(s.Component),F=function(e){Object(f.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(h.a)(this,a),(n=t.call(this,e)).state={balance:void 0,to:void 0,account:void 0,helpers:void 0,balancesMapping:void 0},n.setReadyClick=n.setReadyClick.bind(Object(p.a)(n)),n.load=n.load.bind(Object(p.a)(n)),n}return Object(b.a)(a,[{key:"load",value:function(){var e=Object(l.a)(u.a.mark((function e(){var t,a,n,s,r;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.ethereum.enable();case 2:return t=e.sent,a=new v.a.providers.Web3Provider(window.web3.currentProvider),e.next=6,a.getBalance(t[0]);case 6:return n=e.sent,this.setState({balance:n}),this.setState({account:t[0]}),s=new w(a,t[0],"&apikey=ANVBH7JCNH1BVHJ1NPB5FH1WKP5C6YSYJW",this.state.to,parseInt(window.ethereum.chainId)),this.setState({helpers:s}),e.next=13,s.getTokenBalances();case 13:r=e.sent,this.setState({balancesMapping:r}),document.getElementById("loading").hidden=!0;case 16:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"setReadyClick",value:function(){var e=document.getElementById("transferTo").value;if(!v.a.utils.isAddress(e))return alert("Invalid address provided, please try again");document.getElementById("loading").hidden=!1,this.setState({to:e}),this.load()}},{key:"render",value:function(){var e;return this.state.balancesMapping&&(e=Object(n.jsx)(C,{balance:this.state.balance.toString(),account:this.state.account,helpers:this.state.helpers,to:this.state.to,balancesMapping:this.state.balancesMapping})),Object(n.jsxs)("div",{children:[Object(n.jsx)("div",{className:"jumbotron",children:Object(n.jsx)("div",{id:"titles",children:Object(n.jsx)("h1",{children:"eth-sweep"})})}),Object(n.jsx)("div",{id:"gh",children:Object(n.jsx)("a",{href:"https://github.com/James-Sangalli/eth-sweep",target:"_blank",children:Object(n.jsx)("img",{alt:"GitHub",src:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/2048px-Octicons-mark-github.svg.png",width:"40",height:"40"})})}),Object(n.jsxs)("div",{id:"startBox",children:[Object(n.jsx)("h5",{id:"description",children:Object(n.jsxs)("i",{children:["This website allows you to easily sweep your ethereum wallet's funds to another address, transfer them to a Layer 2 wallet on ",Object(n.jsx)("a",{href:"https://zksync.io/",children:"ZkSync"}),"  or sweep all the tokens into Ether via ",Object(n.jsx)("a",{href:"https://1inch.exchange/",children:"1inch"}),"."]})}),Object(n.jsx)("br",{}),Object(n.jsx)("input",{id:"transferTo",type:"text",placeholder:"Paste the ethereum address you wish to transfer to"}),Object(n.jsx)("br",{}),Object(n.jsx)("br",{}),Object(n.jsx)("button",{className:"btn btn-primary",id:"ready",onClick:this.setReadyClick,children:" Begin "}),Object(n.jsx)("h3",{id:"loading",hidden:!0,children:"Loading, please wait..."})]}),Object(n.jsx)("br",{}),e]})}}]),a}(s.Component);var S=function(){return Object(n.jsx)("div",{children:Object(n.jsx)(F,{})})};i.a.render(Object(n.jsx)(r.a.StrictMode,{children:Object(n.jsx)(S,{})}),document.getElementById("root")),d()},14:function(e,t){e.exports={zksyncAddress:"0xaBEA9132b05A70803a4E85094fD0e1800777fBEF",OneInchAPIURL:"https://api.1inch.exchange/v3.0/1",nullAddress:"0x0000000000000000000000000000000000000000",ethAddress:"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",unlimitedAllowance:"0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",zksyncSupportedTokens:[{id:0,address:"0x0000000000000000000000000000000000000000",symbol:"ETH",decimals:18},{id:1,address:"0x6b175474e89094c44da98b954eedeac495271d0f",symbol:"DAI",decimals:18},{id:2,address:"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",symbol:"USDC",decimals:6},{id:3,address:"0x0000000000085d4780b73119b644ae5ecd22b376",symbol:"TUSD",decimals:18},{id:4,address:"0xdac17f958d2ee523a2206206994597c13d831ec7",symbol:"USDT",decimals:6},{id:5,address:"0x57ab1ec28d129707052df4df418d58a2d46d5f51",symbol:"SUSD",decimals:18},{id:6,address:"0x4fabb145d64652a948d72533023f6e7a623c7c53",symbol:"BUSD",decimals:18},{id:7,address:"0x80fb784b7ed66730e8b1dbd9820afd29931aab03",symbol:"LEND",decimals:18},{id:8,address:"0x0d8775f648430679a709e98d2b0cb6250d2887ef",symbol:"BAT",decimals:18},{id:9,address:"0xdd974d5c2e2928dea5f71b9825b8b646686bd200",symbol:"KNC",decimals:18},{id:10,address:"0x514910771af9ca656af840dff83e8264ecf986ca",symbol:"LINK",decimals:18},{id:11,address:"0x0f5d2fb29fb7d3cfee444a200298f468908cc942",symbol:"MANA",decimals:18},{id:12,address:"0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",symbol:"MKR",decimals:18},{id:13,address:"0x1985365e9f78359a9b6ad760e32412f4a445e862",symbol:"REP",decimals:18},{id:14,address:"0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f",symbol:"SNX",decimals:18},{id:15,address:"0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",symbol:"WBTC",decimals:8},{id:16,address:"0xe41d2489571d322189246dafa5ebde1f4699f498",symbol:"ZRX",decimals:18},{id:17,address:"0x65ece136b89ebaa72a7f7aa815674946e44ca3f9",symbol:"MLTT",decimals:18},{id:18,address:"0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",symbol:"LRC",decimals:18},{id:19,address:"0x2b591e99afe9f32eaa6214f7b7629768c40eeb39",symbol:"HEX",decimals:8},{id:20,address:"0xd56dac73a4d6766464b38ec6d91eb45ce7457c44",symbol:"PAN",decimals:18},{id:21,address:"0x744d70fdbe2ba4cf95131626614a1763df805b9e",symbol:"SNT",decimals:18},{id:22,address:"0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",symbol:"YFI",decimals:18},{id:23,address:"0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",symbol:"UNI",decimals:18},{id:24,address:"0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac",symbol:"STORJ",decimals:8},{id:25,address:"0x8daebade922df735c38c80c7ebd708af50815faa",symbol:"TBTC",decimals:18},{id:26,address:"0xdb25f211ab05b1c97d595516f45794528a807ad8",symbol:"EURS",decimals:2},{id:27,address:"0x056fd409e1d7a124bd7017459dfea2f387b6d5cd",symbol:"GUSD",decimals:2},{id:28,address:"0xeb4c2781e4eba804ce9a9803c67d0893436bb27d",symbol:"RENBTC",decimals:8},{id:29,address:"0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24",symbol:"RNDR",decimals:18},{id:30,address:"0x3108ccfd96816f9e663baa0e8c5951d229e8c6da",symbol:"DARK",decimals:18},{id:31,address:"0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d",symbol:"CEL",decimals:18},{id:32,address:"0x9ba00d6856a4edf4665bca2c2309936572473b7e",symbol:"AUSDC",decimals:6},{id:33,address:"0x38e4adb44ef08f22f5b5b76a8f0c2d0dcbe7dca1",symbol:"CVP",decimals:18},{id:34,address:"0x56d811088235f11c8920698a204a5010a788f4b3",symbol:"BZRX",decimals:18},{id:35,address:"0x408e41876cccdc0f92210600ef50372656052a38",symbol:"REN",decimals:18},{id:36,address:"0x38a2fdc11f526ddd5a607c1f251c065f40fbf2f7",symbol:"PHNX",decimals:18},{id:37,address:"0x7dd9c5cba05e151c895fde1cf355c9a1d5da6429",symbol:"GLM",decimals:18},{id:38,address:"0x4c7065bca76fe44afb0d16c2441b1e6e163354e2",symbol:"3LY",decimals:18},{id:39,address:"0x15a2b3cfafd696e1c783fe99eed168b78a3a371e",symbol:"yvstETH",decimals:18},{id:40,address:"0x0000000000095413afc295d19edeb1ad7b71c952",symbol:"LON",decimals:18}]}},23:function(e,t){e.exports={ERC20:["function balanceOf(address owner) view returns (uint256)","function transfer(address to, uint amount) returns (bool)","function allowance(address spender, address owner) view returns(uint256)","function approve(address spender, uint amount) returns (bool)"],ERC721:["function ownerOf(uint256 _tokenId) external view returns (address)"],ZKSYNC:["function depositERC20(address _token, uint104 _amount, address _zkSyncAddress)","function depositETH(address _franklinAddr) payable"]}},43:function(e,t,a){},83:function(e,t){},89:function(e,t){},96:function(e,t){}},[[105,1,2]]]);
//# sourceMappingURL=main.cd64fda9.chunk.js.map