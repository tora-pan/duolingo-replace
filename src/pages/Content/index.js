import * as OpenCC from 'opencc-js';

const simpToTrad = (element) => {
  if (!element) return;

  const innerElement = element.querySelector('span');
  if (!innerElement) {
    const chineseRegex = /[\u4e00-\u9fa5]/g;
    let matched = [];
    if (element.innerHTML || element.innerText) {
      const text = element.innerHTML || element.innerText;
      let match;
      const converter = OpenCC.Converter({ from: 'cn', to: 'hk' });
      let result;
      while ((match = chineseRegex.exec(text)) !== null) {
        result = converter(element.innerText);
        element.innerText = result ? result :  element.innerText;
      }
    }
  } else {
    simpToTrad(innerElement);
  }
};

const scanDom = () => {
  const elements = document.querySelectorAll('[data-test]');

  elements.forEach((element) => {
    const dataTestValue = element.getAttribute('data-test');
    switch (dataTestValue) {
      case 'challenge-judge-text':
      case 'challenge-choice':
      case 'hint-token':
        simpToTrad(element);
        break;
      default:
        if (
          /^challenge-tap-token-\w+$/.test(dataTestValue) ||
          /^.*-challenge-tap-token$/.test(dataTestValue)
        ) {
          simpToTrad(element);
        } else {
          console.log('noMatch');
        }
        break;
    }
  });
};

// challenge challenge-selectTranscription
// challenge challenge-selectTranscription
// challenge challenge-listenTap
// challenge challenge-characterSelect
// challenge challenge-translate
// challenge challenge-characterMatch

// Array of target element IDs
const targetElementIds = [
  'challenge challenge-selectTranscription',
  'challenge challenge-listenTap',
  'challenge challenge-characterSelect',
  'challenge challenge-translate',
  'challenge challenge-characterMatch',
];

function waitForPlayerSkipButton() {
  return new Promise((resolve, reject) => {
    const targetSelector = '[data-test="player-skip"]';
    const element = document.querySelector(targetSelector);

    if (element) {
      resolve(element);
    } else {
      const observer = new MutationObserver((mutationsList, observer) => {
        const foundElement = document.querySelector(targetSelector);

        if (foundElement) {
          observer.disconnect();
          resolve(foundElement);
        }
      });

      observer.observe(document, { childList: true, subtree: true });
    }
  });
}

function waitForBanner() {
  return new Promise((resolve, reject) => {
    const targetSelector = '[data-test^="blame"]';
    const element = document.querySelector(targetSelector);

    if (element) {
      resolve(element);
    } else {
      const observer = new MutationObserver((mutationsList, observer) => {
        const foundElement = document.querySelector(targetSelector);

        if (foundElement) {
          observer.disconnect();
          waitForControls();
          resolve(foundElement);
        }
      });

      observer.observe(document, { childList: true, subtree: true });
    }
  });
}

const waitForControls = () => {
  waitForPlayerSkipButton()
    .then(() => {
      scanDom();
      waitForBanner();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

waitForControls();
