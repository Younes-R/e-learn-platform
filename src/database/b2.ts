/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */

import fs from "fs/promises";
import crypto from "crypto";
import { Buffer } from "buffer";
import { Readable } from "stream";
import { finished } from "stream/promises";

const getSHA1HashSum = async (fileBuffer: any) => {
  const hashSum = crypto.createHash("sha1");
  hashSum.update(fileBuffer);
  const hex = hashSum.digest("hex");
  return hex;
};

const getFileInfo = async (filePath: any) => {
  const fileBuffer = await fs.readFile(filePath);
  const hashSum = crypto.createHash("sha1");
  hashSum.update(fileBuffer);
  const hex = hashSum.digest("hex");

  const stats = await fs.stat(filePath);
  const fileSize = stats.size;

  const fileHashSum = hex;

  return { fileBuffer, fileSize, fileHashSum };
};

const b2_authorize_account = async () => {
  const buffer = Buffer.from(`${process.env.B2_KEY_ID}:${process.env.B2_APP_KEY_ID}`, "utf-8");
  const base64String = buffer.toString("base64");

  const res = await fetch("https://api.backblazeb2.com/b2api/v3/b2_authorize_account", {
    method: "GET",
    headers: {
      Authorization: `Basic ${base64String}`,
    },
  });

  console.log(res);
  const content = await res.json();
  console.log(content);

  const account_id = content.acountId;
  const auth_token = content.authorizationToken;
  const api_url = content.apiInfo.storageApi.apiUrl;
  const bucket_id = content.apiInfo.storageApi.bucketId;
  const download_url = content.apiInfo.storageApi.downloadUrl;

  return { account_id, auth_token, api_url, bucket_id, download_url };
};

const b2_get_upload_url = async (api_url: string, bucket_id: string, auth_token: string) => {
  const res2 = await fetch(`${api_url}/b2api/v3/b2_get_upload_url?bucketId=${bucket_id}`, {
    method: "GET",
    headers: {
      Authorization: auth_token,
    },
  });

  const res2_content = await res2.json();

  console.log("------------------------RES 02------------------------");
  console.log(res2);
  console.log(res2_content);

  const upload_auth_token = res2_content.authorizationToken;
  const upload_url = res2_content.uploadUrl;

  return { upload_auth_token, upload_url };
};

// FINISH THIS ONE
const upload_file = async (
  upload_url: string,
  upload_auth_token: string,
  file_buffer: any,
  file_name: string,
  file_size: string,
  file_mime_type: string
) => {
  //upload file put in a buffer from the server to BackBlaze B2 DB

  const file_hash_sum = await getSHA1HashSum(file_buffer);
  const res3 = await fetch(upload_url, {
    method: "POST",
    headers: {
      Authorization: upload_auth_token,
      "X-Bz-File-Name": file_name,
      "Content-Type": file_mime_type, // LAST UPDATE: WE ARE NOT SENDING JUST PDFs, SO WE NEED TO CHANGE THIS AS WELL, I SUUGEST USING MIME TYPE PROVIDED BY MULTER, AND PASSING IT AS ARGS TO THIS FUNCTION  ; UPDATE: WE DID IT
      "Content-Length": file_size,
      "X-Bz-Content-Sha1": file_hash_sum,
    },
    body: file_buffer,
  });

  const res3_content = await res3.json();

  console.log("------------------------RES 03------------------------");
  console.log(res3);
  console.log(res3_content);

  return res3_content;
};

const download_file = async (auth_token: string, download_url: string, file_id: string) => {
  // we get this arguments from b2_authorize_account

  const res3 = await fetch(`${download_url}/b2api/v3/b2_download_file_by_id?fileId=${file_id}`, {
    method: "GET",
    headers: {
      Authorization: auth_token,
    },
  });

  console.log("------------------------RES 03------------------------");
  console.log(res3);

  const body = Readable.fromWeb(res3.body as any);

  return { body, name: res3.headers.get("x-bz-file-name") };
};
// ERROR HANDLING AND RETURN VALUES: true when success, false otherwise
const uploadFile = async (file_buffer: any, file_name: string, file_size: string, file_mime_type: string) => {
  // note: most likely, file_buffer type is a node.js buffer. When we get the file in Next server action from the multi-part form, its type would be Web API File type, so we need to change it to buffer first before passing it to this function
  // file buffer

  const { api_url, bucket_id, auth_token } = await b2_authorize_account();
  const { upload_url, upload_auth_token } = await b2_get_upload_url(api_url, bucket_id, auth_token);
  const res3 = await upload_file(upload_url, upload_auth_token, file_buffer, file_name, file_size, file_mime_type);

  return res3.fileId;
};

// THIS FUNCTION SHOULD HAVE ALSO ERROR HANDLING
const downloadFile = async (file_id: string) => {
  const { auth_token, download_url } = await b2_authorize_account();
  const { body, name } = await download_file(auth_token, download_url, file_id);

  return { body, name };
};

module.exports = { uploadFile, downloadFile, download_file };
