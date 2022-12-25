const constant = {

  ONE_DAY_IN_MILLISECOND: 86400000, 
  ACCEPTABLE_IMAGE_EXT_lIST: [ 'jpg','jpeg','png','gif','tiff','dib','ico','cur','xbm','webp','psd','raw','bmp','svg','pcx' , ] , 

};

constant.ACTIVATE_ACCOUNT_EXPIRE_TIME = 7 * constant.ONE_DAY_IN_MILLISECOND;
constant.RESET_PASSWORD_EXPIRE_TIME =  1 * constant.ONE_DAY_IN_MILLISECOND;
constant.USER_SESSION_EXPIRE_TIME =  1 * constant.ONE_DAY_IN_MILLISECOND;

module.exports = constant; 