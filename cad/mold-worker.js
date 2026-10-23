import {shaveBody} from './mold.js?v=4';

self.onmessage = ({data}) => {
  try { self.postMessage({body:shaveBody(data.body, data.stroke)}); }
  catch (error) { self.postMessage({error:error.message || 'The stroke could not finish.'}); }
};
