import {webConfig} from './Constant';
import axios from 'axios';
import {getCosSigner} from '../services/api';
import { message } from 'antd';
var COS = require('cos-js-sdk-v5');

var cos = new COS({
  getAuthorization: function(options, callback) {
		console.log('get sign key: ', options);
		const response = getCosSigner({key: options.Pathname});
		if(response){
			console.log('get cos signer: ', response);
			callback({
				Authorization: response.data.sign,
			});
		}else{
			message.error('获取上传图片的签名失败');
		}
  },
});

export function uploadImg(key, file) {
	console.log('myApi', petGlobal.myApi);
    axios.defaults.baseURL = petGlobal.myApi;
    var uploadState = false;
    cos.putObject(
      {
        Bucket: petGlobal.Bucket,
        Region: petGlobal.Region,
        Key: imgPath,
        Body: img,
      },
      function(err, data) {
        if (data != undefined) {
          uploadState = true;
          //图片上传成功
          var headers = data['headers'];
          for (var k in headers) {
            console.log(k + ': ' + headers[k]);
          }
          console.log('upload code: ', data);
        } else {
          //图片上传失败
          console.log('img upload fail');
          for (var k in err) {
            if (typeof err[k] == 'Object') {
              for (var k2 in err[k]) {
                console.log(k2 + ': ' + err[k][k2]);
              }
            } else {
              console.log(k + ': ' + err[k]);
            }
          }
        }
      }
    );
    return uploadState;
}