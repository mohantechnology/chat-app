const constant = {

    ONE_DAY_IN_MILLISECOND: 86400000, 

}

constant.ACTIVATE_ACCOUNT_EXPIRE_TIME = 7 * constant.ONE_DAY_IN_MILLISECOND;
constant.RESET_PASSWORD_EXPIRE_TIME =  1 * constant.ONE_DAY_IN_MILLISECOND;


module.exports = constant; 