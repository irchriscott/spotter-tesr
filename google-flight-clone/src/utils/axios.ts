"use client";

import { AxiosInstance } from "axios";
import axios from "axios";

//TODO: Move this to .env file
const baseURL = 'https://sky-scrapper.p.rapidapi.com';
const apiHost = 'sky-scrapper.p.rapidapi.com';
const apiKey = '6623a96a3bmsh3c575094ecfea57p142474jsn6096532fd89f';

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'x-rapidapi-key': apiKey,
	'x-rapidapi-host': apiHost,
  }
});

export default axiosInstance;