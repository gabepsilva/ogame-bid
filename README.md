# OGame Trader Auctioneer Enhancement (jQuery)

## Disclaimer

**This script has become illegal and does not work anymore. It has also been nerfed and is no longer competitive.**

## Description

This script was designed to enhance the OGame trader auctioneer page by adding an auto-bidding feature and visual feedback using jQuery. The script automatically placed bids based on user-defined conditions, ensuring that you stayed competitive in auctions without manual intervention.

## Features

- **Auto-Bidding**: Automatically place bids up to a user-defined maximum value.
- **Visual Feedback**: Display current auction conditions and auto-bid status in a custom UI.
- **Customizable Settings**: Easily configure maximum bid value and enable/disable auto-bidding.

## Installation 

1. **Install Tampermonkey**: If you haven't already, install the Tampermonkey extension for your browser.
2. **Add the Script**: Create a new script in Tampermonkey and copy-paste the entire script from this repository.
3. **Save and Enable**: Save the script and ensure it is enabled in Tampermonkey.

## Usage 

1. **Navigate to the Trader Auctioneer Page**: The script will only run on the trader auctioneer page in OGame.
2. **Configure Settings**: Use the custom UI to set your maximum bid value and enable/disable auto-bidding.

## User-Defined Variables 

- **maxBidValue**: The maximum value you are willing to bid.
- **autoBidEnabled**: Toggle auto-bidding on or off.

## How It Worked 

- **Check Page**: The script checked if you were on the correct page before executing.
- **Auto-Bid Conditions**: Auto-bid was placed if the following conditions were met:
  - Auto-bidding was enabled.
  - You were not the current highest bidder.
  - The current bid was less than or equal to your maximum bid value.
  - The auction was ending in approximately 5 minutes.
- **Visual Feedback**: The custom UI displayed the status of each condition and allowed you to update settings.

**Note**: The script is no longer functional or competitive due to changes in the game's policies and mechanics.

## Screenshot

![Screenshot of the script in action](https://github.com/gabepsilva/ogame-bid/blob/main/o-screenshot1.png)

