import {webConfig} from './Constant';
import {getCosSigner} from '../services/api';
import { message } from 'antd';
import axios from 'axios';
var COS = require('cos-js-sdk-v5');

var cos = new COS({
  getAuthorization: function(options, callback) {
    getCosSigner({key: options.Pathname, signType: 'img'}).then(v => {
      console.log(v);
      callback({
				Authorization: v.sign,
			});
    }).then(v2 => {
      
    }).catch(err => {
      message.error('获取上传图片的签名失败');
    });
  },
});

export function uploadImg(img, imgPath, callback) {
  cos.putObject(
    {
      Bucket: webConfig.Bucket,
      Region: webConfig.Region,
      Key: imgPath,
      Body: img,
    },
    function(err, data) {
      if (data != undefined) {
        callback(true);
        //图片上传成功
        //console.log('upload code: ', data);
      } else {
        callback(false);
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
}

export function ugcGetSign(callback) {
  return axios.get('https://qqphoto.cn/pet/pet?command=getuploadsignaturevideo', { param: {} })
    .then(res => {
      console.log('ugcGetSign: ', res.data);
      return res.data;
    })
    .catch(err => {
      console.log(err);
    });
}

//上传视频，参数：视频文件
export function uploadUgc(ugcFile, progressCall) {
  console.log('开始上传视频');
  const tcVod = new TcVod.default({
    getSignature: ugcGetSign
  });
  const uploader = tcVod.upload({
    videoFile: ugcFile
  });
  return new Promise((resolve, reject) => {
    uploader.on('video_progress', function(info) {
      console.log('upload video: ', info.percent);
      progressCall(info.percent * 100);
    });
    uploader.done().then(res => {
      console.log('视频上传完成： ', res);
      resolve(res)
    });
  });
  
}