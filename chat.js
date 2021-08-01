console.log(
    new Array(100).fill(0).map(
        (_, numberThatIterates) =>
            [
                { number: 3, name: 'fizz' },
                { number: 5, name: 'buzz' },
            ]
                .map(configLiteral =>
                    (numberThatIterates + 1) % configLiteral.number === 0
                        ? configLiteral.name
                        : '',
                )
                .join('') || numberThatIterates + 1,
    ),
);
globalThis
Array(100).fill(0).map((_, i) => (i + 1) % 15 === 0 ? 'FizzBuzz' : (i + 1) % 5 === 0 ? 'Buzz' : (i + 1) % 3 === 0 ? 'Fizz' : (i + 1))