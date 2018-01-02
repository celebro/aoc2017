const md5 = require('md5');
const Spinner = require('cli-spinner').Spinner;
const cluster = require('cluster');


if (cluster.isMaster) {
    const testWorker = cluster.fork();
    testWorker.send({ input: 'abc' });
    testWorker.on('message', (msg) => handle('test', msg));

    const worker = cluster.fork();
    worker.send({ input: 'cxdnnyjw' });
    worker.on('message', (msg) => handle('real', msg));

    const spinner = new Spinner();
    spinner.setSpinnerString(18);
    spinner.start();

    const data = {
        test: [{}, {}],
        real: [{}, {}]
    }

    function handle(type, { part, pwd, done }) {
        const tmp = data[type][part];
        tmp.data = pwd;
        tmp.done = done;

        update();
    }

    function update() {
        let empty = '........';
        let str = 'decrypting --- ';
        str += ['test', 'real'].map(type => {
            return type + ': ' + (data[type][0].data || empty) + ' / ' + (data[type][1].data || empty);
        }).join(', ');

        spinner.setSpinnerTitle(str);

        if (data.test[0].done && data.test[1].done && data.real[0].done && data.real[1].done) {
            spinner.onTick(str);
            spinner.stop();
            console.log('\ndone!');
            process.exit(1);
        }
    }
    update();

    process.on('uncaughtException', function() {
        testWorker.kill();
        worker.kill();
    });

} else {
    process.on('message', ({ input }) => {
        const pwd1 = [];
        const pwd2 = [];
        let len = 0;
        let ix = 0;

        while (len < 8) {
            let next;
            do {
                next = md5(input + ix);
                ix++;
            } while (!next.startsWith('00000'));

            const position = next.charAt(5);
            if (pwd1.length < 8) {
                pwd1.push(position);
                process.send({ part: 0, pwd: toStr(pwd1), done: pwd1.length === 8 });
            }
            if (position < 8 && pwd2[position] === undefined) {
                pwd2[position] = next.charAt(6);
                len++;
                process.send({ part: 1, pwd: toStr(pwd2), done: len === 8 });
            }
        }

        process.exit(0);
    })
}

function toStr(pwd) {
    let str = [];
    for (let i = 0; i < 8; i++) {
        str.push(pwd[i] === undefined ? '.' : pwd[i]);
    }
    return str.join('');
}
