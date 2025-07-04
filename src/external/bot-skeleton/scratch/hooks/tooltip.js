import { blueInfo } from '../blocks/images';

console.log('🔧 Loading custom stable tooltip system...');

// Custom tooltip system that bypasses Blockly's problematic tooltip logic
const createCustomTooltipSystem = () => {
    console.log('🔧 Creating custom tooltip system...');

    // Custom tooltip state
    let customTooltipDiv = null;
    let currentHoveredElement = null;
    let showTimeout = null;
    let isTooltipVisible = false;

    // Configuration
    const SHOW_DELAY = 300; // Delay before showing tooltip
    const HIDE_DELAY = 100; // Delay before hiding tooltip

    // Create custom tooltip div
    const createTooltipDiv = () => {
        if (customTooltipDiv) return customTooltipDiv;

        customTooltipDiv = document.createElement('div');
        customTooltipDiv.id = 'custom-blockly-tooltip';
        customTooltipDiv.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            z-index: 10000;
            pointer-events: none;
            display: none;
            max-width: 300px;
            word-wrap: break-word;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(customTooltipDiv);
        console.log('🔧 Custom tooltip div created');
        return customTooltipDiv;
    };

    // Show custom tooltip
    const showCustomTooltip = (element, x, y) => {
        const tooltipDiv = createTooltipDiv();

        // Get tooltip content
        let tooltipText = getTooltipText(element);
        if (!tooltipText) return;

        console.log('🔍 Showing custom tooltip:', tooltipText);

        // Set content
        tooltipDiv.innerHTML = `
            <div style="display: flex; align-items: center;">
                <img src="${blueInfo}" style="width: 16px; height: 16px; margin-right: 8px;">
                <span>${tooltipText}</span>
            </div>
        `;

        // Position tooltip
        tooltipDiv.style.left = x + 10 + 'px';
        tooltipDiv.style.top = y - 30 + 'px';
        tooltipDiv.style.display = 'block';

        // Adjust position if tooltip goes off screen
        const rect = tooltipDiv.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            tooltipDiv.style.left = x - rect.width - 10 + 'px';
        }
        if (rect.top < 0) {
            tooltipDiv.style.top = y + 20 + 'px';
        }

        isTooltipVisible = true;
    };

    // Hide custom tooltip
    const hideCustomTooltip = () => {
        if (customTooltipDiv) {
            console.log('🔍 Hiding custom tooltip');
            customTooltipDiv.style.display = 'none';
            isTooltipVisible = false;
        }
    };

    // Get tooltip text for an element
    const getTooltipText = element => {
        // Check various tooltip sources
        let tooltipText = element.getAttribute('title') || element.getAttribute('data-tooltip') || element.tooltip;

        if (tooltipText) return tooltipText;

        // Generate tooltip based on block type
        const blockType = element.getAttribute('data-testid');

        if (blockType) {
            switch (blockType) {
                case 'trade_definition':
                    return 'Define your trading parameters and conditions';
                case 'contract_type':
                    return 'Select the type of contract for your trade (Up/Down, Touch/No Touch, etc.)';
                case 'market':
                    return 'Choose the market for your trading strategy (Forex, Indices, etc.)';
                case 'trade_type':
                    return 'Specify whether to buy or sell';
                case 'duration':
                    return 'Set how long your contract should run';
                case 'stake':
                    return 'Define your stake amount for the trade';
                case 'sell_conditions':
                    return 'Set conditions for when to sell your position';
                case 'restart_conditions':
                    return 'Define when to restart your trading bot';
                default: {
                    const blockText = element.textContent?.trim();
                    if (blockText && blockText.length > 0 && blockText.length < 50) {
                        return `${blockText} – Click to configure this block`;
                    }
                    return 'Trading block – Click to configure';
                }
            }
        }

        return null;
    };

    // Add custom tooltip to element
    const addCustomTooltipToElement = element => {
        if (element._customTooltipAdded) return;
        element._customTooltipAdded = true;

        console.log('🔧 Adding custom tooltip to element:', element);

        const handleMouseEnter = e => {
            console.log('🔍 Custom mouse enter');
            currentHoveredElement = e.target;

            // Clear any existing timeout
            if (showTimeout) {
                clearTimeout(showTimeout);
            }

            // Show tooltip after delay
            showTimeout = setTimeout(() => {
                if (currentHoveredElement === e.target) {
                    showCustomTooltip(e.target, e.clientX, e.clientY);
                }
            }, SHOW_DELAY);
        };

        const handleMouseMove = e => {
            // Update tooltip position if visible
            if (isTooltipVisible && currentHoveredElement === e.target && customTooltipDiv) {
                customTooltipDiv.style.left = e.clientX + 10 + 'px';
                customTooltipDiv.style.top = e.clientY - 30 + 'px';
            }
        };

        const handleMouseLeave = e => {
            console.log('🔍 Custom mouse leave');

            // Clear show timeout
            if (showTimeout) {
                clearTimeout(showTimeout);
                showTimeout = null;
            }

            // Hide tooltip after small delay
            setTimeout(() => {
                // Check if mouse is still over the element
                const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
                const stillOverElement =
                    elementUnderMouse === e.target ||
                    e.target.contains(elementUnderMouse) ||
                    elementUnderMouse?.closest('.blocklyDraggable') === e.target;

                if (!stillOverElement) {
                    hideCustomTooltip();
                    currentHoveredElement = null;
                }
            }, HIDE_DELAY);
        };

        // Add event listeners
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        console.log('🔧 ✅ Custom tooltip events added to element');
    };

    // Completely disable Blockly's original tooltip system
    const disableBlocklyTooltips = () => {
        if (window.Blockly && window.Blockly.Tooltip) {
            console.log('🔧 Completely disabling Blockly original tooltip system');

            // Override all Blockly tooltip functions to do nothing
            window.Blockly.Tooltip.show = () => {
                console.log('🔍 Blockly tooltip show blocked');
                return;
            };

            window.Blockly.Tooltip.hide = () => {
                console.log('🔍 Blockly tooltip hide blocked');
                return;
            };

            window.Blockly.Tooltip.bindMouseEvents = element => {
                console.log('🔧 Blockly bindMouseEvents blocked');
                // Add our custom tooltip instead
                addCustomTooltipToElement(element);
                return;
            };

            window.Blockly.Tooltip.unbindMouseEvents = () => {
                console.log('🔧 Blockly unbindMouseEvents blocked');
                return;
            };

            // Disable all tooltip-related functions
            window.Blockly.Tooltip.createDom = () => {
                console.log('🔧 Blockly createDom blocked');
                return null;
            };

            window.Blockly.Tooltip.getDiv = () => {
                console.log('🔧 Blockly getDiv blocked');
                return null;
            };

            window.Blockly.Tooltip.setCustomTooltip = () => {
                console.log('🔧 Blockly setCustomTooltip blocked');
                return;
            };

            window.Blockly.Tooltip.getTooltipOfObject = () => {
                console.log('🔧 Blockly getTooltipOfObject blocked');
                return null;
            };

            // Set all blocking flags
            window.Blockly.Tooltip.blocked_ = true;
            window.Blockly.Tooltip.visible = false;

            // Remove any existing Blockly tooltip div
            const existingTooltip = document.querySelector('.blocklyTooltipDiv');
            if (existingTooltip) {
                existingTooltip.remove();
                console.log('🔧 Removed existing Blockly tooltip div');
            }

            // Also check for other possible tooltip selectors
            const otherTooltips = document.querySelectorAll('[class*="tooltip"], [id*="tooltip"]');
            otherTooltips.forEach(tooltip => {
                if (tooltip.id !== 'custom-blockly-tooltip') {
                    tooltip.style.display = 'none';
                    console.log('🔧 Hidden other tooltip element:', tooltip);
                }
            });
        }
    };

    // Find and setup tooltips for existing blocks
    const setupExistingBlocks = () => {
        const blocks = document.querySelectorAll('.blocklyBlockCanvas .blocklyDraggable');
        console.log(`🔧 Setting up custom tooltips for ${blocks.length} existing blocks`);

        blocks.forEach(addCustomTooltipToElement);
    };

    // Monitor for new blocks
    const setupBlockObserver = () => {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const blocks = node.classList?.contains('blocklyDraggable')
                                ? [node]
                                : node.querySelectorAll?.('.blocklyDraggable') || [];

                            blocks.forEach(addCustomTooltipToElement);
                        }
                    });
                }
            });
        });

        const workspace = document.querySelector('.blocklyWorkspace');
        if (workspace) {
            observer.observe(workspace, {
                childList: true,
                subtree: true,
            });
            console.log('🔧 ✅ Block observer setup for custom tooltips');
        }
    };

    // Add CSS to hide any Blockly tooltips
    const addTooltipBlockingCSS = () => {
        const style = document.createElement('style');
        style.id = 'blockly-tooltip-blocker';
        style.textContent = `
            .blocklyTooltipDiv,
            .blocklyTooltip,
            [class*="blocklyTooltip"],
            [id*="blocklyTooltip"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
            
            /* Ensure our custom tooltip is always visible */
            #custom-blockly-tooltip {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
        console.log('🔧 Added CSS to block Blockly tooltips');
    };

    // Continuous monitoring to remove any Blockly tooltips that might appear
    const startTooltipMonitoring = () => {
        setInterval(() => {
            // Remove any Blockly tooltip divs that might have been created
            const blocklyTooltips = document.querySelectorAll(
                '.blocklyTooltipDiv, .blocklyTooltip, [class*="blocklyTooltip"], [id*="blocklyTooltip"]'
            );
            blocklyTooltips.forEach(tooltip => {
                if (tooltip.id !== 'custom-blockly-tooltip') {
                    tooltip.style.display = 'none';
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                }
            });
        }, 500); // Check every 500ms
    };

    // Initialize custom tooltip system
    addTooltipBlockingCSS();
    disableBlocklyTooltips();
    startTooltipMonitoring();

    setTimeout(() => {
        setupExistingBlocks();
        setupBlockObserver();
        console.log('🔧 ✅ Custom tooltip system fully initialized');
    }, 1000);
};

// Initialize when Blockly is available
if (window.Blockly) {
    console.log('🔧 Blockly available, creating custom tooltip system...');
    createCustomTooltipSystem();
} else {
    console.log('🔧 Waiting for Blockly to load...');
    const checkBlockly = setInterval(() => {
        if (window.Blockly) {
            console.log('🔧 Blockly loaded, creating custom tooltip system...');
            clearInterval(checkBlockly);
            createCustomTooltipSystem();
        }
    }, 100);

    setTimeout(() => {
        clearInterval(checkBlockly);
        console.log('🔧 Timeout waiting for Blockly');
    }, 10000);
}
