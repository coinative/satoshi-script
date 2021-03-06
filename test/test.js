var Script = require('../');
var opcodes = Script.opcodes;

function hex(hex) { return new Buffer(hex, 'hex'); }

var scripts = {
  // e2769b09e784f32f62ef849763d4f45b98e07ba658647343b915ff832b110436/0
  pubkeyhash: '76a914badeecfdef0507247fc8f74241d73bc039972d7b88ac',
  // 2ace0f550bdbace7c7ef0aae7876d241aba7816c3a225fc21111738629462071/0
  pubkey: '4104a39b9e4fbd213ef24bb9be69de4a118dd0644082e47c01fd9159d38637b83fbcdc115a5d6e970586a012d1cfe3e3a8b1a3d04e763bdc5a071c0e827c0bd834a5ac',
  // 60a20bd93aa49ab4b28d514ec10b06e1829ce6818ec06cd3aabd013ebcdc4bb1/0
  multisig: '514104cc71eb30d653c0c3163990c47b976f3fb3f37cccdcbedb169a1dfef58bbfbfaff7d8a473e7e2e6d317b87bafe8bde97e3cf8f065dec022b51d11fcdd0d348ac4410461cbdcc5409fb4b4d42b51d33381354d80e550078cb532a34bfa2fcfdeb7d76519aecc62770f5b0e4ef8551946d8a540911abe3e7854a26f39f58b25c15342af52ae',
  // 9c08a4d78931342b37fd5f72900fb9983087e6f46c4a097d8a1f52c74e28eaf6/1
  scripthash: 'a91419a7d869032368fd1f1e26e5e73a4ad0e474960e87',
  // 6ea5c6f1a97f382f87523d13ef9f2ef17b828607107efdbba42a80b8a6555356/0
  nulldata: '6a2606706d409903a6b5dad3f703d00d03dbae5430a136f56d5c2dff7e5f18d12594b22558597cde',
  nonstandard: [
    // Scripts from tx ebc9fa1196a59e192352d76c0f6e73167046b9d37b8302b6bb6968dfd279b767
    '0101',
    '020201',
    '014c',
    '034c0201',
    '044dffff01',
    '014e',
    '064effffffff', // Too few bytes
    // Beyond buffer length
    '4c',
    '4c01',
    '4d00',
    '4d0001',
    '4e000000',
    '4e00000001',
    // Random junk
    '',
    '01',
    '03630f7ed2f576',
    '4494c03f4786a2289d',
    'ec54dc118007b466c596066afdbd8764',
    '062058ea6e975ebdbad94b5e2acc8500c44f',
    '21d053e5a71bcde816e0da04feea36caf7ae489670e5951b4895d9e80d70df8ba0693cc8e55440c227eb102c6b804fb0edd5',
    '4c10f1fcc01733ec4f20ff98cf5026f6651648dd39c5c93c2a894acc0afaece408f085aabf8288d259386fdc5164642094e5'
  ]
};
Object.keys(scripts).forEach(function (type) {
  if (Array.isArray(scripts[type])) {
    scripts[type] = scripts[type].map(function (hex) {
      return new Buffer(hex, 'hex');
    });
  } else {
    scripts[type] = new Buffer(scripts[type], 'hex');
  }
});

describe('Script', function () {
  describe('parse', function () {
    it('pubkeyhash', function () {
      var script = new Script(new Buffer(scripts.pubkeyhash, 'hex'));
      expect(script.chunks[0]).to.equal(opcodes.OP_DUP);
      expect(script.chunks[1]).to.equal(opcodes.OP_HASH160);
      expect(script.chunks[2].toString('hex')).to.equal('badeecfdef0507247fc8f74241d73bc039972d7b');
      expect(script.chunks[3]).to.equal(opcodes.OP_EQUALVERIFY);
      expect(script.chunks[4]).to.equal(opcodes.OP_CHECKSIG);
    });

    it('pubkey', function () {
      var script = new Script(new Buffer(scripts.pubkey, 'hex'));
      expect(script.chunks[0].toString('hex')).to.equal('04a39b9e4fbd213ef24bb9be69de4a118dd0644082e47c01fd9159d38637b83fbcdc115a5d6e970586a012d1cfe3e3a8b1a3d04e763bdc5a071c0e827c0bd834a5');
      expect(script.chunks[1]).to.equal(opcodes.OP_CHECKSIG);
    });

    it('multisig', function () {
      var script = new Script(new Buffer(scripts.multisig, 'hex'));
      expect(script.chunks[0]).to.equal(opcodes.OP_1);
      expect(script.chunks[1].toString('hex')).to.equal('04cc71eb30d653c0c3163990c47b976f3fb3f37cccdcbedb169a1dfef58bbfbfaff7d8a473e7e2e6d317b87bafe8bde97e3cf8f065dec022b51d11fcdd0d348ac4');
      expect(script.chunks[2].toString('hex')).to.equal('0461cbdcc5409fb4b4d42b51d33381354d80e550078cb532a34bfa2fcfdeb7d76519aecc62770f5b0e4ef8551946d8a540911abe3e7854a26f39f58b25c15342af');
      expect(script.chunks[3]).to.equal(opcodes.OP_2);
      expect(script.chunks[4]).to.equal(opcodes.OP_CHECKMULTISIG);
    });

    it('scripthash', function () {
      var script = new Script(new Buffer(scripts.scripthash, 'hex'));
      expect(script.chunks[0]).to.equal(opcodes.OP_HASH160);
      expect(script.chunks[1].toString('hex')).to.equal('19a7d869032368fd1f1e26e5e73a4ad0e474960e');
      expect(script.chunks[2]).to.equal(opcodes.OP_EQUAL);
    });

    it('nulldata', function () {
      var script = new Script(new Buffer(scripts.nulldata, 'hex'));
      expect(script.chunks[0]).to.equal(opcodes.OP_RETURN);
      expect(script.chunks[1].toString('hex')).to.equal('06706d409903a6b5dad3f703d00d03dbae5430a136f56d5c2dff7e5f18d12594b22558597cde');
    });

    it('don\'t throw on nonstandard or junk scripts', function () {
      scripts.nonstandard.forEach(function (script) {
        new Script(new Buffer(script, 'hex'));
      });
    });
  });

  describe('getOutputType', function () {
    it('pubkeyhash', function () {
      expect(new Script(scripts.pubkeyhash).getOutputType()).to.equal('pubkeyhash');
    });

    it('pubkey', function () {
      expect(new Script(scripts.pubkey).getOutputType()).to.equal('pubkey');
    });

    it('multisig', function () {
      expect(new Script(scripts.multisig).getOutputType()).to.equal('multisig');
    });

    it('scripthash', function () {
      expect(new Script(scripts.scripthash).getOutputType()).to.equal('scripthash');
    });

    it('nulldata', function () {
      expect(new Script(scripts.nulldata).getOutputType()).to.equal('nulldata');
    });

    it('nonstandard', function () {
      scripts.nonstandard.forEach(function (script) {
        expect(new Script(script).getOutputType()).to.equal('nonstandard');
      });
    });
  });

  describe('capture', function () {
    it('pubkeyhash', function () {
      expect(new Script(scripts.pubkeyhash).capture().toString('hex')).to.equal('badeecfdef0507247fc8f74241d73bc039972d7b');
    });

    it('pubkey', function () {
      expect(new Script(scripts.pubkey).capture().toString('hex')).to.equal('0568015a9facccfd09d70d409b6fc1a5546cecc6');
    });

    it('multisig', function () {
      expect(new Script(scripts.multisig).capture()).to.deep.equal([
        new Buffer('660d4ef3a743e3e696ad990364e555c271ad504b', 'hex'),
        new Buffer('641ad5051edd97029a003fe9efb29359fcee409d', 'hex')
      ]);
    });

    it('scripthash', function () {
      expect(new Script(scripts.scripthash).capture().toString('hex')).to.equal('19a7d869032368fd1f1e26e5e73a4ad0e474960e');
    });

    it('nulldata', function () {
      expect(new Script(scripts.nulldata).capture()).to.not.exist;
    });

    it('nonstandard', function () {
      scripts.nonstandard.forEach(function (script) {
        expect(new Script(script).capture()).to.not.exist;
      });
    });
  });

  describe('create', function () {
    function repeat(str, times) {
      return new Buffer(new Array(times + 1).join(str));
    }

    it('opcodes', function () {
      var script = Script.create(function (script) {
        Object.keys(opcodes).forEach(function (opcode) {
          script.writeChunk(opcodes[opcode]);
        });
      });
      var opcodeValues = Object.keys(opcodes).map(function (opcode) {
        return opcodes[opcode];
      });
      expect(script.buffer.toString('hex'))
        .to.equal(new Buffer(opcodeValues).toString('hex'));
    });

    it('length - length < 0x4c', function () {
      var script = Script.create(function (script) {
        script.writeChunk(repeat('0', 0x4b));
      });
      expect(script.buffer.toString('hex'))
        .to.equal('4b' + repeat('0', 0x4b).toString('hex'));
    });

    it('OP_PUSHDATA1(0x4c) - 0x4c < length <= 0xff', function () {
      var script = Script.create(function (script) {
        script.writeChunk(repeat('0', 0x4c));
        script.writeChunk(repeat('1', 0xff));
      });
      expect(script.buffer.toString('hex'))
        .to.equal('4c4c' + repeat('0', 0x4c).toString('hex') + '4cff' + repeat('1', 0xff).toString('hex'));
    });

    it('OP_PUSHDATA2(0x4d) - 0xff < length <= 0xffff', function () {
      var script = Script.create(function (script) {
        script.writeChunk(repeat('0', 0x100));
        script.writeChunk(repeat('1', 0xffff));
      });
      expect(script.buffer.toString('hex'))
        .to.equal('4d0100' + repeat('0', 0x100).toString('hex') + '4dffff' + repeat('1', 0xffff).toString('hex'));
    });

    it('OP_PUSHDATA4(0x4e) - 0xffff < length', function () {
      var script = Script.create(function (script) {
        script.writeChunk(repeat('0', 0x10000));
      });
      expect(script.buffer.toString('hex'))
        .to.equal('4e00010000' + repeat('0', 0x10000).toString('hex'));
    });
  });

  it('2 of 3 multisig script hash', function () {
    var keys = [
      hex('02b2b9815744d0c95bb3fa82db4563757f5223379cb16f6b4ecbab5677527f0552'),
      hex('03a7e75f1c9093622d16ecb9dee45b2f8ef10c84f7bfcd2d0ce29017ed97b9a52c'),
      hex('0331a136cb2190f9b576d16596cf10bdda3e75504e7021caa0921fc809e7756100')
    ];

    var signatures = [
      hex('30440220515a7e94aec5afddc05067e47f91b799301b2f613ac2ec2c76e224a4af7b614f022000c17bcb87eab038c023a968877702acc2fcebb7fc68eda680ac166b1b1e4e2201'),
      hex('30450220352dbd98e01cbdac931d868a62ca5abe5494ffc7a6da3e863f7e239a4a204aa0022100eb8198d942d745bdccbc6c3e61f5aa3f7e6855295de96484c308972cf025d92d01')
    ];

    var redeemOutput = Script.createMultisigOutput(2, keys);
    var redeemInput = Script.createMultisigInput(signatures);
    var inputScript = Script.createScriptHashInput(redeemInput, redeemOutput);

    expect(redeemOutput.buffer.toString('hex')).to.equal('522102b2b9815744d0c95bb3fa82db4563757f5223379cb16f6b4ecbab5677527f05522103a7e75f1c9093622d16ecb9dee45b2f8ef10c84f7bfcd2d0ce29017ed97b9a52c210331a136cb2190f9b576d16596cf10bdda3e75504e7021caa0921fc809e775610053ae');
    expect(redeemInput.buffer.toString('hex')).to.equal('004730440220515a7e94aec5afddc05067e47f91b799301b2f613ac2ec2c76e224a4af7b614f022000c17bcb87eab038c023a968877702acc2fcebb7fc68eda680ac166b1b1e4e22014830450220352dbd98e01cbdac931d868a62ca5abe5494ffc7a6da3e863f7e239a4a204aa0022100eb8198d942d745bdccbc6c3e61f5aa3f7e6855295de96484c308972cf025d92d01')
    expect(inputScript.buffer.toString('hex')).to.equal('004730440220515a7e94aec5afddc05067e47f91b799301b2f613ac2ec2c76e224a4af7b614f022000c17bcb87eab038c023a968877702acc2fcebb7fc68eda680ac166b1b1e4e22014830450220352dbd98e01cbdac931d868a62ca5abe5494ffc7a6da3e863f7e239a4a204aa0022100eb8198d942d745bdccbc6c3e61f5aa3f7e6855295de96484c308972cf025d92d014c69522102b2b9815744d0c95bb3fa82db4563757f5223379cb16f6b4ecbab5677527f05522103a7e75f1c9093622d16ecb9dee45b2f8ef10c84f7bfcd2d0ce29017ed97b9a52c210331a136cb2190f9b576d16596cf10bdda3e75504e7021caa0921fc809e775610053ae')
  });

  it('createNullDataOutput', function () {
    var script = Script.createNullDataOutput(new Buffer('hello'));
    expect(script.buffer.toString('hex')).to.equal('6a0568656c6c6f')
  });
});
