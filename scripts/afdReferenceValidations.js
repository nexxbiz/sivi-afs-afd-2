//Generated and improved with help of ChatGPT 4 Code Inspector
const validationResults = {
    errors: []
};


function validateAfdRefKey(obj, validationResults, path='') {
    const refKeyMap = new Map();

    if (Array.isArray(obj)) {
        let anyRefKeyPresent = obj.some(item => item.hasOwnProperty('refKey'));

        obj.forEach((item, i) => {
            const currentPath = `${path}[${i}]`;
            
            if (anyRefKeyPresent) {
                if (!item.hasOwnProperty('refKey')) {
                    validationResults.errors.push({
                        path: currentPath,
                        message: 'refKey property is missing',
                        method: 'refKeyMissing',
                    });
                } else if (item.refKey === '') {
                    validationResults.errors.push({
                        path: currentPath,
                        message: 'refKey cannot be empty',
                        method: 'refKeyNotEmpty',
                    });
                } else if (refKeyMap.has(item.refKey)) {
                    const conflictingPath = refKeyMap.get(item.refKey);
                    validationResults.errors.push({
                        path: currentPath,
                        message: `refKey must be unique within the array. Conflicts with ${conflictingPath}`,
                        method: 'uniqueRefKey',
                    });
                } else {
                    refKeyMap.set(item.refKey, currentPath);
                }
            }

            // Recursively check child properties
            for (const key in item) {
                validateAfdRefKey(item[key], validationResults, `${currentPath}.${key}`);
            }
        });
    } else if (typeof obj === 'object' && obj !== null) {
        // If it's an object (but not an array), recursively check its properties
        for (const key in obj) {
            validateAfdRefKey(obj[key], validationResults, `${path}.${key}`);
        }
    }
}

function getValueFromPath(data, path) {
    const parts = path.split('.');
    let currentData = [data];  // Initialize as an array to handle potential arrays in the data

    for (let part of parts) {
        let newValues = [];
        for (let value of currentData) {
            if (value && value.hasOwnProperty(part)) {
                if (Array.isArray(value[part])) {
                    newValues.push(...value[part]);
                } else {
                    newValues.push(value[part]);
                }
            }
        }
        currentData = newValues;
    }
    return currentData;
}

function validateAfdReferences(data, fromPath, toPath, validationResults) {
    // Use the helper function to get the values from paths
    const fromArray = getValueFromPath(data, fromPath);
    const toArray = getValueFromPath(data, toPath);

    if (!Array.isArray(fromArray) || !Array.isArray(toArray)) {
        throw new Error(`Invalid paths provided. Ensure both paths point to arrays in the data.`);
    }

    // Extract the refKey from the target scope
    const targetRefKeys = new Set(toArray.map(item => item.refKey));
    const refProperty = `${toPath.split('.').pop()}Ref`; // Construct the reference property name from the last segment of the toPath

    if (fromArray.length > 0 && !fromArray[0].hasOwnProperty(refProperty)) {
        throw new Error(`The reference property '${refProperty}' does not exist in the fromPath data.`);
    }

    // Iterate over the source scope to validate references
    fromArray.forEach((item, i) => {
        if (item[refProperty]) {
            item[refProperty].forEach(ref => {
                if (!targetRefKeys.has(ref)) {
                    validationResults.errors.push({
                        path: `${fromPath}[${i}].${refProperty}`,
                        message: `Reference ${ref} not found in ${toPath} refKeys`,
                        method: 'missingRef'
                    });
                }
            });
        }
    });
}
