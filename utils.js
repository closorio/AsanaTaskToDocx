
import path from 'path';
import {fileURLToPath} from 'url';


export function getFullName(email) {
    const dotIndex = email.indexOf('.');
    const firstName = email.slice(0, dotIndex).charAt(0).toUpperCase() + email.slice(1, dotIndex);
    const lastName = email.slice(dotIndex + 1, email.indexOf('@')).charAt(0).toUpperCase() + email.slice(dotIndex + 2, email.indexOf('@'));
    const fullName = `${firstName} ${lastName}`;
    return fullName + ' <'+email+'>';
  }
  
  export function getFilename(metaUrl) {
    const __filename = fileURLToPath(metaUrl);
  
    return __filename;
  }
  
  export function getDirname(metaUrl) {
    const __dirname = path.dirname(getFilename(metaUrl));
  
    return __dirname;
  }
  