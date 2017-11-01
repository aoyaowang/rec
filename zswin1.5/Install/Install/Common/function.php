<?php

// 检测环境是否支持可写
define('IS_WRITE',APP_MODE !== 'sae');

/**
 * 写入配置文件
 * @param  array $config 配置信息
 */
function write_config($config, $auth){
	if(is_array($config)){
		//读取配置内容
		$conf = file_get_contents(MODULE_PATH . 'sqldata/conf.tpl');
		$user = file_get_contents(MODULE_PATH . 'sqldata/user.tpl');
		//替换配置项
		foreach ($config as $name => $value) {
			$conf = str_replace("[{$name}]", $value, $conf);
			$user = str_replace("[{$name}]", $value, $user);
		}

		//写入应用配置文件
        file_put_contents('./App/Common/Conf/config.php', $conf);
       file_put_contents('./App/User/Conf/config.php', $user);
			return '';
		

	}
}



/**
 * 生成系统AUTH_KEY
 */
function build_auth_key(){
	$chars  = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$chars .= '`~!@#$%^&*()_+-=[]{};:"|,.<>/?';
	$chars  = str_shuffle($chars);
	return substr($chars, 0, 40);
}

/**
 * 系统非常规MD5加密方法
 * @param  string $str 要加密的字符串
 * @return string
 */
function user_md5($str, $key = ''){
	return '' === $str ? '' : md5(sha1($str) . $key);
}
