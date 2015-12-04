import Lab       from 'lab';
import Code      from 'code';
import Manifest  from '../server/manifest';

const {expect} = Code;
const lab = exports.lab = Lab.script();

lab.experiment('Manifest', () => {

    lab.test('should get manifest data', (done) => {

        expect(Manifest.get('/')).to.be.an.object();

        done();
    });


    lab.test('should get manifest meta data', (done) => {

        expect(Manifest.meta('/')).to.match(/Our main server manifest/i);

        done();
    });
});
