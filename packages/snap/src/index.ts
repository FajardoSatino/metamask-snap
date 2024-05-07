import type { Json, OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { panel, text, heading } from '@metamask/snaps-sdk';
import type { OnTransactionHandler } from '@metamask/snaps-sdk';
import { assertConfirmation, assertInput, assertIsString } from './utils';
import { deriveKeyPair } from './privateKey';
import { renderSignTransaction } from './ui';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  const dappOrigin = (request?.params as any).origin || origin;
  const dappHost = new URL(dappOrigin)?.host;

  switch (request.method) {
    case 'hello':
      const response = snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
    case 'signTransaction': {
      // const { derivationPath, message } = request.params;
      console.log(`message => ${Object.keys((request.params as any).message)}`);
      const derivationPath = (request.params as Record<string, Json>)
        .derivationPath;
      const message = JSON.stringify(
        (request.params as Record<string, Json>).message,
      );

      // assertInput(message);
      // assertIsString(message);

      const keyPair = await deriveKeyPair(derivationPath);
      console.log(keyPair);
      const accepted = await renderSignTransaction(dappHost, message);
      assertConfirmation(accepted);
      console.log({
        accepted,
        decodedMessage: new TextEncoder().encode(message?.toString() ?? ''),
      });
      const signature = nacl.sign.detached(
        new TextEncoder().encode(message?.toString() ?? ''),
        keyPair.secretKey,
      );
      console.log(`keypair => ${keyPair}`);
      console.log(`signature => ${signature}`);

      console.log(`publicKey => ${bs58.encode(keyPair.publicKey)}`);
      console.log(`signature => ${bs58.encode(signature)}`);
      return {
        publicKey: bs58.encode(keyPair.publicKey),
        signature: bs58.encode(signature),
      };
    }
    case 'call_agent': {
      const { prompt } = request.params;
    }
    default:
      throw new Error('Method not found.');
  }
};

// Handle outgoing transactions.
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  if (typeof transaction.data === 'string' && transaction.data !== '0x') {
    return {
      content: panel([
        heading('Percent Snap'),
        text(
          'This Snap only provides transaction insights for simple ETH transfers.',
        ),
      ]),
    };
  }
  // Use the Ethereum provider to fetch the gas price.
  const currentGasPrice = (await ethereum.request({
    method: 'eth_gasPrice',
  })) as string;

  // Get fields from the transaction object.
  const transactionGas = parseInt(transaction.gas as string, 16);
  const currentGasPriceInWei = parseInt(currentGasPrice ?? '', 16);
  const maxFeePerGasInWei = parseInt(transaction.gas as string, 16);
  const maxPriorityFeePerGasInWei = parseInt(transaction.gas as string, 16);

  // Calculate gas fees the user would pay.
  const gasFees = Math.min(
    maxFeePerGasInWei * transactionGas,
    (currentGasPriceInWei + maxPriorityFeePerGasInWei) * transactionGas,
  );

  // Calculate gas fees as percentage of transaction.
  const transactionValueInWei = parseInt(transaction.value as string, 16);
  const gasFeesPercentage = (gasFees / (gasFees + transactionValueInWei)) * 100;

  // Display percentage of gas fees in the transaction insights UI.
  return {
    content: panel([
      heading('Transaction insights Snap'),
      text(
        `As set up, you are paying **${gasFeesPercentage.toFixed(2)}%**
        in gas fees for this transaction.`,
      ),
    ]),
  };
};
