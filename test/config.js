import Lab       from 'lab';
import Code      from 'code';
import AppConfig from '../server/config';

const {expect} = Code
const lab = exports.lab = Lab.script();

lab.experiment('Config', () => {

    lab.test('should get config data', (done) => {

        expect(AppConfig.get('/')).to.be.an.object();

        done();
    });


    lab.test('should get config meta data', (done) => {

        expect(AppConfig.meta('/')).to.match(/Our main Application config/i);

        done();
    });
});
