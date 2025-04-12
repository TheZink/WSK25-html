export const fetchData = async (url) => {
    try {
        const request = await fetch(`${url}`);

        if (!request.ok){
            throw new Error(`Fetch error:  ${request.status}`);
        }

        const data = await request.json();
        return data;

    } catch (error) {
        console.error('error', error);

    } finally {

        console.log('Request complete');
    }
}

export const fetchDataOptions = async (url, options) => {
    try {

        const request = await fetch(`${url}`, options);
        
        if (!request.ok){
            const errorMessage = await request.text();
            throw new Error(`Fetch error:  ${request.status} - ${errorMessage}`);
        }

        const data = await request.json();
        return data;

    } catch (error) {
        console.error('error', error);

    } finally {

        console.log('Request complete');
    }
}