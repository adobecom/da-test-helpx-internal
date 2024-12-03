import DA_SDK from 'https://da.live/nx/utils/sdk.js';

(async function init() {
  const { context, token, actions } = await DA_SDK;
  const data = { context, token, actions };
  actions.sendText('Send text and close');
  actions?.setHash('nthakur');
  // TODO Actions could be closeLibrary, daFetch and sendText
  document.body.innerHTML += `<p>${JSON.stringify(data)}</p>`;
})();
