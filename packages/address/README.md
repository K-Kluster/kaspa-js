Pure JS implementation of Kaspa Address, support Schnorr and ECDSA addresses.

Getting started:

```bash
npm i @kluster/kaspa-address
```

Example:

```js
const str =
  "kaspa:qqjmak7xtwq8kn57ngjt0fcw59jgh7nrxc4q59kj0g2gqgyktfeucgwqm3fnl";

const kaspaAddress = KaspaAddress.fromString(str);

console.log({
  prefix: kaspaAddress.prefix,
  version: kaspaAddress.version,
  payload: kaspaAddress.payload,
});
```