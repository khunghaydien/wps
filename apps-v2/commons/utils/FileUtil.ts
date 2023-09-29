export default class FileUtil {
  /**
   * Checks if b64File matches extension
   * @param b64File name of the file
   * @param extensionToMatch extension to match the original file extension
   * @returns {string || boolean} file extension or a boolean matching extensionToMatch
   */
  static getB64FileExtension(b64File: string, extensionToMatch?: string) {
    const fileExtension = b64File.split(';')[0].split('/')[1] || '';

    return extensionToMatch
      ? fileExtension === extensionToMatch
      : fileExtension;
  }

  /**
   * Get the file name without extension from a file name.
   * @param fileName name of the file
   * @returns {string} file name without extension
   */
  static getFileNameWithoutExtension(fileName: string) {
    return fileName.substr(0, fileName.lastIndexOf('.')) || fileName;
  }

  /**
   * Get the original file name from the saved file name.
   * @param fileName saved name of the file with prefix `Receipt_`
   * @returns {string} original file name without prefix `Receipt_`
   */
  static getOriginalFileNameWithoutPrefix(
    fileName: string,
    prefix = 'Receipt_'
  ) {
    // Old file name format: Receipt_{yyyyMMddhhmmss}_{sequenceNumber}
    // New file name format: Receipt_{originalFileName}

    if (fileName.includes(prefix)) {
      const receiptPrefixLength = prefix.length;
      return fileName.slice(receiptPrefixLength);
    }
    return fileName;
  }

  /**
   * Get the file extension from a file name.
   * If extensionToMatch is supplied, it will check if the file extension matches.
   * @param fileName name of the file
   * @param extensionToMatch extension to match the original file extension
   * @returns {string || boolean} file extension or a boolean matching extensionToMatch
   */
  static getFileExtension(fileName: string, extensionToMatch?: string) {
    const parts = fileName.split('.');
    const fileExtension = parts[parts.length - 1];

    return extensionToMatch
      ? fileExtension === extensionToMatch
      : fileExtension;
  }

  /**
   * Downloads the file in browser.
   * Needed to use this method because salesforce automatically convers normal tag to another redirct link, disabling downloads.
   * Example redirect link: https://ap4.lightning.force.com/one/one.app#/alohaRedirect
   *
   * @param targetFileBlob base64 file
   * @param targetFile target file ID to be downloaded
   * @param fileName
   * @param isPDF
   */
  static downloadFile(
    targetFileBlob: any,
    targetFile: any,
    fileName: string,
    isPDF = false
  ) {
    // for MS Edge and PDF
    if (window.navigator.msSaveBlob && isPDF) {
      const bin = atob(targetFileBlob.replace(/^.*,/, ''));
      const buffer = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
      }
      const blob = new Blob([buffer.buffer], {
        type: 'application/pdf',
      });
      window.navigator.msSaveBlob(blob, fileName);
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      // other browser
      const downloadLink = document.createElement('a');
      downloadLink.href = `/sfc/servlet.shepherd/document/download/${targetFile}?operationContext=S1`;
      downloadLink.download = fileName;
      downloadLink.target = '_blank';
      downloadLink.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    }
  }

  /**
   *
   *
   * Encodes binary data from file into a base 64 representation
   * @param file file needs to be encoded
   * @returns {Promise<string|ArrayBuffer>} encoded file
   */
  static getBase64(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Returns MIME type
   * @param fileType type of file in string format. Example: 'PDF'
   * @returns {string} MIME type in string format. Example: 'application/pdf'
   */
  static getMIMEType(fileType: string) {
    const isPDF = fileType === 'PDF' || fileType === 'pdf';

    return isPDF ? 'application/pdf' : 'image/png';
  }
}
