// ==UserScript==
// @name         OGame Trader Auctioneer Enhancement (jQuery)
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Enhance the trader auctioneer page in OGame with auto-bidding feature and visual feedback using jQuery
// @match        https://*.ogame.gameforge.com/game/index.php?page=ingame&component=traderOverview*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function($) {
    'use strict';

    // Check if we're on the correct page
    if (!window.location.hash.includes('page=traderAuctioneer')) {
        return; // Exit the script if we're not on the trader auctioneer page
    }

    // User-defined variables stored in Tampermonkey's storage
    let maxBidValue = GM_getValue('maxBidValue', 0);
    let autoBidEnabled = GM_getValue('autoBidEnabled', false);

    // Add CSS for the custom styles
    GM_addStyle(`
        .settings-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            margin-bottom: 10px;
            background-color: #34495e;
            padding: 5px;
            border-radius: 5px;
        }
        .settings-container input[type="number"] {
            width: 70px;
            padding: 3px;
            border: none;
            border-radius: 3px;
        }
        .settings-container label {
            color: white;
            margin-left: 3px;
            font-size: 12px;
        }
        .condition {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 3px;
            font-size: 12px;
        }
        .condition-text {
            flex-grow: 1;
            padding-right: 5px;
        }
        .condition-indicator {
            width: 20px;
            text-align: center;
        }
        .header {
            font-weight: bold;
            text-align: center;
            margin-bottom: 5px;
            font-size: 14px;
            border-bottom: 1px solid white;
            padding-bottom: 3px;
        }
        .update-note {
            font-size: 10px;
            font-style: italic;
            text-align: center;
            margin-top: 5px;
            color: #bdc3c7;
        }
    `);

    // Function to get my name
    function getMyName() {
        const $myNameElement = $('a.overlay.textBeefy[data-overlay-title][data-overlay-popup-width="400"][data-overlay-popup-height="200"]');
        return $myNameElement.text().trim();
    }

    // Function to check if auction is ending in approximately 5 minutes
    function isAuctionEnding() {
        const $auctionInfo = $('p.auction_info');
        return $auctionInfo.text().includes(" 5m ");
    }

    // Function to perform bidding
    function performBidding() {
        const $maxButton = $('a.value-control.max.js_sliderMetalMax.js_valButton.tooltipRight.js_hideTipOnMobile');
        const $submitButton = $('a.pay');

        if ($maxButton.length && !$maxButton.hasClass('disabled')) {
            $maxButton[0].click();
            console.log('Max button clicked');

            setTimeout(() => {
                if ($submitButton.length && !$submitButton.hasClass('disabled')) {
                    $submitButton[0].click();
                    console.log('Auto-bid placed!');
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                    return true;
                } else {
                    console.log('Submit button is disabled or not found');
                }
            }, 1000);
        } else {
            console.log('Max button is disabled or not found');
        }
        return false;
    }

    // Main function to enhance the trader auctioneer
    function enhanceTraderAuctioneer() {
        console.log('OGame Trader Auctioneer Enhancement script is running!');

        // Create custom container for our UI
        const $customContainer = $('<div>').css({
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 9999,
            width: '220px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '5px',
            borderRadius: '5px',
            color: 'white'
        }).appendTo('body');

        // Function to update the display and perform auto-bidding
        function updateDisplay() {
            const currentSum = parseInt($('div.detail_value.odd.currentSum').text().replace(/\D/g, ''), 10);
            const currentPlayerName = $('a.detail_value.odd.currentPlayer').text().trim();
            const myName = getMyName();

            $customContainer.empty();

            // Add header
            $('<div>').addClass('header').text('Auto-Bid Conditions').appendTo($customContainer);

            // Display bid conditions
            const conditions = [
                { text: "Auto-Bid Enabled?", met: autoBidEnabled },
                { text: "Not My Bid?", met: currentPlayerName !== myName },
                { text: "Current bid ≤ Max bid?", met: currentSum <= maxBidValue },
                { text: "Auction ending in 5m?", met: isAuctionEnding() }
            ];

            conditions.forEach(condition => {
                const $conditionDiv = $('<div>').addClass('condition').appendTo($customContainer);
                $('<span>').addClass('condition-text').text(condition.text).appendTo($conditionDiv);
                $('<span>').addClass('condition-indicator').text(condition.met ? '✅' : '❌').appendTo($conditionDiv);
            });

            // Create settings container
            const $settingsContainer = $('<div>').addClass('settings-container').appendTo($customContainer);

            // Add max bid value input
            $('<input>')
                .attr({type: 'number', id: 'maxBidInput', value: maxBidValue})
                .on('input', function() {
                    const newValue = parseInt($(this).val(), 10);
                    if (!isNaN(newValue)) {
                        setTimeout(() => {
                            maxBidValue = newValue;
                            GM_setValue('maxBidValue', maxBidValue);
                            console.log('Max bid value updated:', maxBidValue);
                        }, 3000);
                    }
                })
                .appendTo($settingsContainer);

            $('<label>').attr('for', 'maxBidInput').text('Max Bid').appendTo($settingsContainer);

            // Add auto-bidding checkbox
            $('<input>')
                .attr({type: 'checkbox', id: 'autoBidCheckbox', checked: autoBidEnabled})
                .on('change', function() {
                    autoBidEnabled = this.checked;
                    GM_setValue('autoBidEnabled', autoBidEnabled);
                    console.log('Auto-bidding ' + (autoBidEnabled ? 'enabled' : 'disabled'));
                })
                .appendTo($settingsContainer);

            $('<label>').attr('for', 'autoBidCheckbox').text('Auto-Bid').appendTo($settingsContainer);

            // Add update note
            $('<div>').addClass('update-note').text('UI and script update every 15 seconds').appendTo($customContainer);

            // Auto-bidding logic
            if (autoBidEnabled && currentPlayerName !== myName && currentSum <= maxBidValue && isAuctionEnding()) {
                if (performBidding()) {
                    $('<div>').text('Auto-bid placed!').css({
                        backgroundColor: '#e67e22',
                        padding: '5px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginTop: '5px',
                        fontSize: '12px'
                    }).appendTo($customContainer);
                }
            }
        }

        // Initial display update
        updateDisplay();

        // Set interval to update display regularly
        setInterval(updateDisplay, 15000); // Update every 15 seconds
    }

    // Run the script when the page is ready
    $(document).ready(enhanceTraderAuctioneer);
})(jQuery);
