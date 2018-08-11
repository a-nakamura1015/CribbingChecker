'use strict';

const fs = require('fs');
const path = require('path');
const request = require('request');

// Google Vison API Key
const apiKey = 'AIzaSyDuiQFlw0o6Kc2SXpMPDipvIiXYyf50lsk';
// 文字認識
const feature = 'TEXT_DETECTION';
// 取得結果の最大個数
const maxResults = 100;

// 引数チェック
if (process.argv.length < 3) {
  console.log('Usage:');
  console.log(`  node ${path.basename(process.argv[1])} <imagePath>`);
  process.exit();
}

let imagePath = process.argv[2];
fs.readFile(imagePath, 'base64', (err, base64) => {
  if (err) {
    console.error(`file read errror: ${err}`);
    return;
  }

  const params = {
    requests: [
      {
        image: {
          content: base64,
        },
        features: {
          type: feature,
          maxResults: maxResults,
        },
      },
    ],
  };
  const data = JSON.stringify(params);
  request.post({
    url: `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    headers: {
      'Contetn-Type': 'Content-Type: application/json',
      'Content-Length': data.length,
    },
    body: data,
  },
  (err, res, body) => {
    if (err) {
      console.error(`Cloud Vision API error: ${err}`);
      return;
    }

    let resFilePath =
      `${path.basename(imagePath, path.extname(imagePath))}.json`;
    let jsonData = JSON.stringify(JSON.parse(body), null, 2);
    fs.writeFile(resFilePath, jsonData, (err) => {
      console.log(`result json write: ${resFilePath}`);
    });
  });
});
