import ImageKit, { toFile } from '@imagekit/nodejs';
import { config } from '../config/config.js';

const client = new ImageKit({
    privateKey:config.IMAGEKIT_API_KEY,

});

async function uploadimage({buffer,filename,folder=""}){

    const file = await client.files.upload({
        file:await toFile(Buffer.from(buffer)),
        fileName:"filename",
        folder
    })
    return file
}

export default uploadimage
