const fs = require('fs');

let input = '';
try {
    input = fs.readFileSync(__filename.replace('.js', '.txt'), 'utf8').trim();
} catch (e) {}
const testInputs = [
    `
mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)
`
].map((x) => x.trim());

/**
 * @param {string} input
 */
function run(input) {
    let part1 = undefined;
    let part2 = undefined;
    const lines = input.split('\n').filter((line) => line.length);

    const parsed = [];

    lines.forEach((line) => {
        const [ingredientsString, alergensString] = line.replace(')', '').split(' (contains ');
        const ingredients = ingredientsString.split(' ');
        const alergens = alergensString.split(', ');

        parsed.push({ ingredients, alergens });
    });

    /** @type {{[index:string]: Set<String>}} */
    const candidatesMap = {};
    const allIngredients = new Set();

    for (const { ingredients, alergens } of parsed) {
        for (const alergen of alergens) {
            const candidates = candidatesMap[alergen];
            if (!candidates) {
                candidatesMap[alergen] = new Set(ingredients);
            } else {
                for (const candidate of candidates.keys()) {
                    if (!ingredients.includes(candidate)) {
                        candidates.delete(candidate);
                    }
                }
            }
        }
        for (const ingredient of ingredients) {
            allIngredients.add(ingredient);
        }
    }

    const finalMap = {};

    while (true) {
        let change = false;
        for (const [alergen, candidates] of Object.entries(candidatesMap)) {
            if (candidates.size === 1) {
                const ingredient = candidates.keys().next().value;
                finalMap[ingredient] = alergen;
                delete candidatesMap[alergen];
                for (const otherCandidates of Object.values(candidatesMap)) {
                    otherCandidates.delete(ingredient);
                }
                change = true;
            }
        }
        if (!change) {
            break;
        }
    }

    const unknownIngredients = new Set();
    for (const ingredient of allIngredients) {
        if (!(ingredient in finalMap)) {
            unknownIngredients.add(ingredient);
        }
    }

    part1 = 0;
    for (const { ingredients } of parsed) {
        for (const ingredient of ingredients) {
            if (unknownIngredients.has(ingredient)) {
                part1++;
            }
        }
    }

    /////////////////
    const mappedIngredients = Object.keys(finalMap).sort((a, b) => finalMap[a].localeCompare(finalMap[b]));
    part2 = mappedIngredients.join(',');

    return [part1, part2];
}

for (const testInput of testInputs) {
    if (testInput) {
        const testResult = run(testInput);
        console.log('test: ', testResult.join(' / '));
    }
}

const result = run(input);
console.log('result: ', result.join(' / '));
