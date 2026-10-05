const fs=require('fs'),crypto=require('crypto'),path=require('path');
const root=path.resolve(__dirname,'..');
const content=fs.readFileSync(root+'/contracts/XDOLToken.sol','utf8');
const manifest=JSON.parse(fs.readFileSync(root+'/evidence/manifest.json'));
if(crypto.createHash('sha256').update(content).digest('hex')!==manifest.sourceSha256)throw Error('Source hash mismatch');
const soljson=require(path.resolve(process.argv[2]||'soljson.cjs'));
const version=soljson.cwrap('solidity_version','string',[])();
if(!version.startsWith(manifest.compiler))throw Error('Wrong compiler: '+version);
const input={language:'Solidity',sources:{'XDOLToken.sol':{content}},settings:{optimizer:{enabled:true,runs:200},outputSelection:{'*':{'*':['abi','metadata','evm.bytecode.object','evm.deployedBytecode.object']}}}};
const output=JSON.parse(soljson.cwrap('solidity_compile','string',['string','number','number'])(JSON.stringify(input),0,0));
for(const error of output.errors||[]) {console.error(error.formattedMessage);if(error.severity==='error')process.exit(1);}
const contract=output.contracts['XDOLToken.sol'].XDOLToken;
const comparisons={};
for(const [kind,bytecode]of [['creation',contract.evm.bytecode.object],['runtime',contract.evm.deployedBytecode.object]]){
 const expected=fs.readFileSync(root+'/evidence/'+kind+'-bytecode.hex','utf8').trim();
 comparisons[kind]={fullMatch:bytecode===expected,executableMatch:strip(bytecode)===strip(expected)};
 if(!comparisons[kind].executableMatch)throw Error(kind+' executable bytecode mismatch');
}
function strip(hex){const length=parseInt(hex.slice(-4),16);return hex.slice(0,-(length+2)*2);}
fs.mkdirSync(root+'/build',{recursive:true});
fs.writeFileSync(root+'/build/standard-input.json',JSON.stringify(input,null,2)+'\n');
fs.writeFileSync(root+'/build/output.json',JSON.stringify(output,null,2)+'\n');
fs.writeFileSync(root+'/evidence/build-check.json',JSON.stringify({compiler:version,comparisons,metadata:JSON.parse(contract.metadata).settings},null,2)+'\n');
console.log(JSON.stringify(comparisons,null,2));
