import axios from 'axios';

const endPoint = process.env.REACT_APP_API_ENDPOINT;

const apiConfig = (isFormData = false) => {
 {
    return {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
      method: 'POST,GET,PUT',
    };
  };
}

export const postApi = (url: string, apiData?: any, isFormData = false) => {
	return axios.post(`${endPoint}${url}`, apiData, apiConfig(isFormData));
};

export const getApi = (url: string,query?:any) => {
	return axios.get(`${endPoint}${url}`, {params:query, ...apiConfig()});
};

export const putApi = (url: string, apiData?: any, isFormData = false) => {
	return axios.put(`${endPoint}${url}`, apiData, apiConfig(isFormData));
};



