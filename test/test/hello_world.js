const HelloWorld = artifacts.require("HelloWorld");

contract('HelloWorld', function () {
    let instance;
    before(async () => {
        instance = await HelloWorld.deployed();
    });

    it('Should return `Hello World!`', async () => {
        let message = await instance.sayHelloWorld();
        assert.equal(message, 'Hello World!');
    });

    it('Should emit the event `PrintHelloWorld`', async () => {
        let log = await instance.logMessage();
        assert.equal(log.logs[0].event, 'PrintHelloWorld');
    })
})