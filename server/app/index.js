import React, { Component } from 'react';
import QRCode from 'qrcode.react';

export default class App extends Component {
  render(){
    return(
      <div>
        <QRCode value="0xe46a82035de48a19d9325cf43aa969e6b8cda978"/>
      </div>
    )
  }
}


// <h1 class="Welcome-to-Source"> Welcome to Source. </h1>
// <h3 class="Source-is-a-ubiquito">
//     Source is a ubiquitous WiFi network that’s secure and simple to use.
//     Only pay for the amount of data you need.
//     You can also sign up as a WiFi provider and make money by
//     sharing your network. Learn more at
//     <a href="https://sourcewifi.com">www.sourcewifi.com</a>.
// </h3>
// <a href="/terms_accepted">Access Source</a>
// <img type="image/png" src="/assets/BalloonGuy.png" class="balloon2"/>
