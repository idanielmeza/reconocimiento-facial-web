const path = require('path');
const crypto = require('crypto')

const subirArchivo = (files)=>{

    return new Promise((resolve, reject)=>{

        const {image} = files;

        const nombre = crypto.randomUUID() + '.jpeg';
        const uploadPath =path.join( __dirname, '../../reconocimiento/images' ,nombre );

        image.mv(uploadPath, (err)=> {
            if (err) {
                reject(err);
            }
            resolve(nombre);
        });

    })

    

}

module.exports = {
    subirArchivo
}