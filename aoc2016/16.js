function run(input, len, prefix) {
    let data = input.split('').map(Number).map(Boolean);

    while (data.length < len) {
        data.push(false);
        for (let i = data.length - 2; i >= 0; i--) {
            data.push(!data[i]);
        }
    }

    data.length = len;
    data = data.map(a => a ? '1' : '0');

    while(data.length % 2 === 0) {
        let result = [];
        for (let i = 1; i < data.length; i += 2) {
            result.push(data[i] === data[i - 1] ? '1' : '0');
        }
        data = result;
    }

    console.log(`${prefix}: ${data.join('')}`);
}

run('10000', 20, 'test');

run('00111101111101000', 272, 'result1');
run('00111101111101000', 35651584, 'result2');
