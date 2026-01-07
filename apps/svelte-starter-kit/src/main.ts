import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { initRpc } from '$lib/rpcStore'

// Initialize WASM and RPC in the background
console.log("Starting background RPC init...");
initRpc().then(() => console.log("RPC Init success")).catch(e => console.error("RPC Init failed", e));

console.log("Mounting App...");
try {
    mount(App, {
        target: document.getElementById('app')!,
    });
    console.log("App mounted successfully.");
} catch (error) {
    console.error("Critical error mounting App:", error);
}

// export default app; // no longer exporting app instance directly as it is async
