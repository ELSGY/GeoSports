import axios from 'axios';

const headers = new Headers();
headers.append("Access-Control-Allow-Methods", "DELETE, POST, GET");
headers.append("Access-Control-Allow-Origin", "*");
headers.append("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
headers.append("Content-Type", "application/json");

export default axios.create({
    baseURL: "http://localhost:8080",
    headers: headers
});

axios.interceptors.response.use(
    response => responseSuccessHandler(response),
    error => responseErrorHandler(error)
);

// Provide only response json part
// => Chuk other metadata provided by axios
const responseSuccessHandler = response => {
    return response.data;
};

// Log & Sanitize errors response
// => The errors given by server will not be always consistent so we
//    could sanitize the response and return proper error to the client.
const responseErrorHandler = error => {
    let errors = ["Something went wrong, please try again!"];

    if (error.response) {
        if (error.response.data.errors)
            errors = error.response.data.errors;
        if (error.response.data.error)
            errors = [error.response.data.error];

        if (error.response.status === 401)
            errors.push("401 ERROR Status");
    } else if (error.request) {
        console.log(error.request);
    } else {
        console.log('Error', error.message);
    }

    console.log("responseErrorHandler");
    return Promise.reject({
        status: error.response.status,
        errors: errors
    });
}