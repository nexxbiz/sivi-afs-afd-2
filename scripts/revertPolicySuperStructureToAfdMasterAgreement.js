
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

    // If there were parties associated with masterAgreements, you can re-associate them similarly. 
    // For now, I'm assuming the parties at the root belong to all masterAgreements.
    // If there's a more specific logic to associate parties, please specify.
    if (source.party) {
        source.masterAgreement.forEach(ma => {
            ma.party = [...source.party];
        });
        delete source.party; // Remove parties from root
    }

    return source;
}
