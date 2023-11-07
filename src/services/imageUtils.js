


export const getIconFromFileEvent = (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];
    let resolve = null;
    let reject = null;

    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    if (!file) {
        resolve({ name: '', value: '',  size: 0 });
        return promise;
    }

    if (file.type !== 'image/svg+xml') {
        reject('Incorrect file type');
        return promise;
    }

    reader.readAsDataURL(file);

    reader.onerror = reject;
    reader.onload = () => {
        const result = { name: file.name || '', value: reader.result, size: file.size };
        resolve(result);
    };
    return promise;
};