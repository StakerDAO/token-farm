require("ts-node").register({
    files: true,
});

// const { mnemonic, secret, password, email } = require("./faucet.json");
const { alice, mainnetKey } = require('./scripts/sandbox/accounts');

module.exports = {
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  contracts_directory: "./contracts/main",
  networks: {
    development: {
      host: "http://localhost",
      port: 8732,
      network_id: "*",
      secretKey: alice.sk,
      type: "tezos"
    },
    edonet: {
      host: "https://edonet-tezos.giganode.io",
      network_id: "*",
      secretKey: alice.sk,
      type: "tezos"
    },
    florencenet: {
      host: "https://testnet-tezos.giganode.io",
      network_id: "*",
      secretKey: "edsk2woetjNqZ4N3DWDeV6yNkHmyJLMeKJ1AJvEJgDdYYrPFZCfxe6",
      type: "tezos"
    },
    mainnet: {
      host: "https://mainnet-tezos.giganode.io",
      network_id: "*",
      secretKey: mainnetKey.sk,
      type: "tezos"
    }
  }
};
