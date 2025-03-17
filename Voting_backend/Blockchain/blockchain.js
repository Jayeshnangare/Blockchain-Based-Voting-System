const crypto = require("crypto");

class Blockchain {
  constructor() {
    this.chain = [];
  }

  createBlock(voterDetails) {
    const block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      voterDetails, // Store non-sensitive voter details
      previousHash: this.chain.length
        ? this.chain[this.chain.length - 1].hash
        : "0",
    };
    block.hash = this.generateHash(block);
    this.chain.push(block);
    return block.hash;
  }

  generateHash(block) {
    return crypto.createHash("sha256").update(JSON.stringify(block)).digest("hex");
  }
}

module.exports = new Blockchain();
