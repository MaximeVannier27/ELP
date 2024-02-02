function pioche(nombre, sac) {
    if (nombre === 0) {
        return [];
    } 
    else {
        let cartePiochee = sac[Math.floor(Math.random() * sac.length)];
        return [cartePiochee].concat(pioche(nombre - 1, sac));
    }
}

module.exports.pioche = pioche;