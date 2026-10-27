import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = readFileSync('dist/meta-pixel.js','utf8');
const id = '43a1c1e2-6065-4d54-b227-f1726632dbef';
const confirmation = {type:'bastelli:waitlist:success',version:1,submissionId:id};
const origin = 'https://bc-contentadmin.lovable.app';
const store = new Map();
function documentHarness({storage=store,storageBlocked=false,hasForm=true}={}) {
  const listeners = {};
  const frameWindow = {};
  let insertions = 0;
  const document = {
    createElement:() => ({}),
    getElementsByTagName:() => [{parentNode:{insertBefore:() => insertions++}}],
    querySelector:selector => hasForm && selector === '#lista-espera iframe' ? {contentWindow:frameWindow} : null,
  };
  const window = {
    addEventListener:(type,fn) => { listeners[type]=fn; },
    sessionStorage:{
      getItem:key => {if(storageBlocked)throw Error('blocked');return storage.get(key) ?? null;},
      setItem:(key,value) => {if(storageBlocked)throw Error('blocked');storage.set(key,value);},
    },
  };
  const context = vm.createContext({window,document});
  const load = () => vm.runInContext(source,context);
  const message = (data=confirmation,overrides={}) => listeners.message({origin,source:frameWindow,data,...overrides});
  const events = name => window.fbq.queue.filter(args => args[0] === 'track' && args[1] === name);
  load();
  return {window,load,message,events,listeners,insertions:() => insertions};
}

const page = documentHarness();
page.load();
assert.equal(page.insertions(),1);
assert.equal(page.window.fbq.queue.filter(args => args[0] === 'init').length,1);
assert.equal(page.window.fbq.queue[0][1],'1126433449891278');
assert.equal(page.events('PageView').length,1);
assert.equal(page.events('Lead').length,0);
assert.deepEqual(Object.keys(page.listeners),['message'],'No click, load or submit tracking.');

for(const data of [null,'success',{}, {...confirmation,version:2},{...confirmation,type:'submit'}, {...confirmation,submissionId:'user@example.com'}])page.message(data);
page.message(confirmation,{origin:'https://example.com'});
page.message(confirmation,{origin:origin+'.example.com'});
page.message(confirmation,{source:{}});
assert.equal(page.events('Lead').length,0);
page.message();
assert.equal(page.events('Lead').length,1);
assert.equal(page.events('Lead')[0][3].eventID,'bastelli-waitlist-'+id);
assert.equal(Object.keys(page.events('Lead')[0][2]).length,0,'No personal data sent.');
page.message();
page.message({...confirmation,submissionId:id.toUpperCase()});
assert.equal(page.events('Lead').length,1);
assert.equal(page.events('PageView').length,1,'Lead must not add another PageView.');

const reloaded = documentHarness();
reloaded.message();
assert.equal(reloaded.events('Lead').length,0,'Session must deduplicate repeated confirmations after a parent reload.');
assert.equal(reloaded.events('PageView').length,1);
reloaded.message({...confirmation,submissionId:'2215dd3a-bc1f-46f7-9c0b-8800b6f1254d'});
assert.equal(reloaded.events('Lead').length,1,'A separate confirmed submission is a separate event.');

const blocked = documentHarness({storageBlocked:true});
blocked.message();blocked.message();
assert.equal(blocked.events('Lead').length,1);
const detail = documentHarness({hasForm:false});
detail.message();
assert.equal(detail.events('Lead').length,0);
assert.equal(detail.events('PageView').length,1);

console.log('Pixel OK: one PageView/document; Lead only from validated success; duplicate/foreign/invalid messages ignored. External form success hook still pending.');
