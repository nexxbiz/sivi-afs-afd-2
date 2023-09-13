//Generated and improved with help of ChatGPT 4 Code Inspector
function revertPolicySuperStructureToAfdMasterAgreement(source) {
    if (!source.policy || !source.masterAgreement) {
        console.error("Missing required properties for transformation.");
        return source;
    }
    
    // Map of masterAgreementRef to masterAgreement for quick look-up
    let maMap = {};
    source.masterAgreement.forEach(ma => {
        maMap[ma.refKey] = ma;
    });

    // Identify orphan policies
    let orphanPolicies = source.policy.filter(p => !p.masterAgreementRef || !p.masterAgreementRef.length);

    // Create new masterAgreements for orphan policies
    let newMaIndex = 1;
    orphanPolicies.forEach(orphanPolicy => {
        let newMaRefKey = "NewMA" + newMaIndex;
        let newMa = {
            refKey: newMaRefKey,
            policy: [orphanPolicy],
            entityType: "undefined"
        };
        source.masterAgreement.push(newMa);
        orphanPolicy.masterAgreementRef = [newMaRefKey];
        newMaIndex++;
    });

    // Move each policy back to its respective masterAgreement
    source.policy.forEach(p => {
        let maRef = p.masterAgreementRef[0];
        let ma = maMap[maRef];
        if (ma) {
            if (!ma.policy) ma.policy = [];
            ma.policy.push(p);
        }
        delete p.masterAgreementRef; // Remove masterAgreementRef from policy
    });
    delete source.policy; // Remove policies from root

    // Remove policyRef from each masterAgreement
    source.masterAgreement.forEach(ma => {
        delete ma.policyRef;
    });

    // Handle parties
    if (source.party) {
        source.masterAgreement.forEach(ma => {
            ma.party = [...source.party];
        });
        delete source.party; // Remove parties from root
    }

    return source;
}
