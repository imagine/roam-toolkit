import {browser} from 'webextension-polyfill-ts';
import {triggerNextBucket} from '../srs';
import {Roam} from '../../utils/roam';
import {guard, replaceFuzzyDate} from '../fuzzy_date';
import {createDemo} from '../create-block-demo'

/**
 * Be cautious to reference functions on the objects via anonymous functions (e.g. see Roam.deleteBlock)
 * Otherwise they won't be called properly on the object
 */
const dispatchMap = new Map([
    ['srs-next-bucket', triggerNextBucket],
    ['delete-current-block', () => Roam.deleteBlock()],
    ['duplicate-current-block', () => Roam.duplicateBlock()],
    ['replace-fuzzy-date', replaceFuzzyDate],
]);

browser.runtime.onMessage.addListener((command) => dispatchMap.get(command)?.());

document.addEventListener('keyup', ev => {
    if (ev.key === guard) replaceFuzzyDate();
});



//@ts-ignore couldn't resolve this typing
browser.runtime.onMessage.addListener((message,sender,sendResponse) => {
    switch (message) {
        case 'create-block-demo':
            createDemo();
            sendResponse('exec demo');
            break;
        default:
            break;
    }
})