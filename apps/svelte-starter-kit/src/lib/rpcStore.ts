import { writable } from 'svelte/store';
// import type { RpcClient } from '@kluster/kaspa-wasm-web'; // Removing type import to avoid static dependency if possible, or using 'any' for now to ensure total decoupling during load

// Create writable stores
export const isConnected = writable(false);
export const rpcClient = writable<any | null>(null);

let rpc: any;

// Function to initialize and connect
export const initRpc = async () => {
  try {
    // Dynamically import the WASM package
    // @ts-ignore
    const { default: init, RpcClient, Encoding, Resolver } = await import('@kluster/kaspa-wasm-web');

    // Initialize WASM
    await init();
    
    // Initialize RPC Client
    rpc = new RpcClient({
      resolver: new Resolver(),
      encoding: Encoding.Borsh,
      networkId: 'mainnet',
    });
    
    rpcClient.set(rpc);

    await rpc.connect();
    isConnected.set(true);
    console.log('Connected to Kaspa RPC');
  } catch (error) {
    console.error('Failed to connect to Kaspa RPC:', error);
    isConnected.set(false);
  }
};

// Function to disconnect
export const disconnect = async () => {
  if (!rpc) return;
  try {
    await rpc.disconnect();
    isConnected.set(false);
    console.log('Disconnected from Kaspa RPC');
  } catch (error) {
    console.error('Failed to disconnect:', error);
  }
};

// Export the init function to be called by the bootloader
// initRpc(); // Removed auto-init
