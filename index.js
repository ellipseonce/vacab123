const axios = require('axios');

const word = 'boy';
const apiKey = '3PjI3TFLTig1G+mAln9fzQ==zMFbDIhQazuFnFYC';
const url = `https://api.api-ninjas.com/v1/dictionary?word=${word}`;

axios.get(url, {
    headers: { 'X-Api-Key': apiKey }
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error('Error: ', error.response ? error.response.data : error.message);
});