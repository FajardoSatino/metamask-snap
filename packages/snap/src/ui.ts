import { heading, text, divider, panel, copyable } from '@metamask/snaps-sdk';

export function renderGetPublicKey(host: any, pubkey: any) {
  return snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('Confirm access'),
        text(host),
        divider(),
        text(pubkey),
      ]),
    },
  });
}

export function renderSignTransaction(host: any, message: any) {
  return snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('Sign transaction'),
        text(host),
        divider(),
        copyable(message),
      ]),
    },
  });
}

export function renderSignAllTransactions(host: any, messages: any) {
  if (messages.length === 1) {
    return renderSignTransaction(host, messages[0]);
  }

  const uiElements = [];

  for (let i = 0; i < messages.length; i++) {
    uiElements.push(divider());
    uiElements.push(text(`Transaction ${i + 1}`));
    uiElements.push(copyable(messages[i]));
  }

  return snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([heading('Sign transactions'), text(host), ...uiElements]),
    },
  });
}

export function renderSignMessage(host: any, message: any) {
  return snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('Sign message'),
        text(host),
        divider(),
        copyable(message),
      ]),
    },
  });
}
