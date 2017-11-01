<?php
define('WEB_PUBLIC_PATH', __ROOT__.'/Public'); 

const ZS_VERSION = '1.0.141210';
const ZS_ADDON_PATH = './Addons/';

/**
 * 格式化字节大小
 * @param  number $size 字节数
 * @param  string $delimiter 数字和单位分隔符
 * @return string            格式化后的带单位的大小
 * @author 麦当苗儿 <zuojiazi@vip.qq.com>
 */
function format_bytes($size, $delimiter = '')
{
    $units = array('B', 'KB', 'MB', 'GB', 'TB', 'PB');
    for ($i = 0; $size >= 1024 && $i < 5; $i++) $size /= 1024;
    return round($size, 2) . $delimiter . $units[$i];
}
 // 分析枚举类型配置值 格式 a:名称1,b:名称2
function parse_config_attr($string) {
    $array = preg_split('/[,;\r\n]+/', trim($string, ",;\r\n"));
    if(strpos($string,':')){
        $value  =   array();
        foreach ($array as $val) {
            list($k, $v) = explode(':', $val);
            $value[$k]   = $v;
        }
    }else{
        $value  =   $array;
    }
    return $value;
}
 // 分析枚举类型字段值 格式 a:名称1,b:名称2
 // 暂时和 parse_config_attr功能相同
 // 但请不要互相使用，后期会调整
function parse_field_attr($string) {
    if(0 === strpos($string,':')){
        // 采用函数定义
        return   eval(substr($string,1).';');
    }
    $array = preg_split('/[,;\r\n]+/', trim($string, ",;\r\n"));
    if(strpos($string,':')){
        $value  =   array();
        foreach ($array as $val) {
            list($k, $v) = explode(':', $val);
            $value[$k]   = $v;
        }
    }else{
        $value  =   $array;
    }
    return $value;
}




function handle_exception($exception)
{
    // 显示错误消息
    $message = $exception->getMessage();
    if (method_exists($exception, 'getExtra')) {
        $extra = $exception->getExtra();
    } else {
        $extra = array();
    }
    $extra['error_code'] = $exception->getCode();
    api_show_error($message, $extra);
}

function getRootUrl()
{
    if (__ROOT__ != '') {
        return __ROOT__ . '/';
    }
    if (C('URL_MODEL') == 2)
        return __ROOT__ . '/';
    return __ROOT__;
}
/**对于附件来修正其url，兼容urlmodel2,sae
 * @param $url
 * @return string
 * @auth 陈一枭
 */
function fixAttachUrl($url)
{
    if(!is_sae()){
        return getRootUrl() . substr($url, 1);
    }else{
        return $url;
    }

}

function IP($ip = '', $file = 'UTFWry.dat') {
	$_ip = array();
	if (isset($_ip [$ip])) {
		return $_ip [$ip];
	} else {
		import("ORG.Net.IpLocation");
		$iplocation = new IpLocation($file);
		$location = $iplocation->getlocation($ip);
		$_ip [$ip] = $location ['country'] . $location ['area'];
	}
	return $_ip [$ip];
}
/**
 * 获取 IP  地理位置
 * 淘宝IP接口
 * @Return: array
 */
function get_city_by_ip($ip)
{
    $url = "http://ip.taobao.com/service/getIpInfo.php?ip=" . $ip;
    $ipinfo = json_decode(file_get_contents($url));
    if ($ipinfo->code == '1') {
        return false;
    }
    $city = $ipinfo->data->region . $ipinfo->data->city; //省市县
    $ip = $ipinfo->data->ip; //IP地址
    $ips = $ipinfo->data->isp; //运营商
    $guo = $ipinfo->data->country; //国家
    if ($guo == '中国') {
        $guo = '';
    }
    return $guo . $city . $ips . '[' . $ip . ']';

}

/* 解析列表定义规则*/

function get_list_field($data, $grid,$model){

	// 获取当前字段数据
    foreach($grid['field'] as $field){
        $array  =   explode('|',$field);
        $temp  =	$data[$array[0]];
        // 函数支持
        if(isset($array[1])){
            $temp = call_user_func($array[1], $temp);
        }
        $data2[$array[0]]    =   $temp;
    }
    if(!empty($grid['format'])){
        $value  =   preg_replace_callback('/\[([a-z_]+)\]/', function($match) use($data2){return $data2[$match[1]];}, $grid['format']);
    }else{
        $value  =   implode(' ',$data2);
    }

	// 链接支持
	if(!empty($grid['href'])){
		$links  =   explode(',',$grid['href']);
        foreach($links as $link){
            $array  =   explode('|',$link);
            $href   =   $array[0];
            if(preg_match('/^\[([a-z_]+)\]$/',$href,$matches)){
                $val[]  =   $data2[$matches[1]];
            }else{
                $show   =   isset($array[1])?$array[1]:$value;
                // 替换系统特殊字符串
                $href	=	str_replace(
                    array('[DELETE]','[EDIT]','[MODEL]'),
                    array('del?ids=[id]&model=[MODEL]','edit?id=[id]&model=[MODEL]',$model['id']),
                    $href);

                // 替换数据变量
                $href	=	preg_replace_callback('/\[([a-z_]+)\]/', function($match) use($data){return $data[$match[1]];}, $href);

                $val[]	=	'<a href="'.U($href).'">'.$show.'</a>';
            }
        }
        $value  =   implode(' ',$val);
	}
    return $value;
}


require_once(APP_PATH . '/Common/Common/api.php');//api相关调用
require_once(APP_PATH . '/Common/Common/user.php');//用户登录、用户信息相关
require_once(APP_PATH . '/Common/Common/mail.php');//邮件相关
require_once(APP_PATH . '/Common/Common/addons.php');//插件、钩子相关
require_once(APP_PATH . '/Common/Common/string.php');//数组处理、字符串处理，过滤转义字符等
require_once(APP_PATH . '/Common/Common/safe.php');//加密解密认证相关
require_once(APP_PATH . '/Common/Common/DirFile.php');//目录与文件操作相关
require_once(APP_PATH . '/Common/Common/date.php');//日期时间处理相关


// 获取模型名称
function get_model_by_id($id){
    return $model = M('Model')->getFieldById($id,'title');
}
// 获取属性类型信息
function get_attribute_type($type=''){
    // TODO 可以加入系统配置
    static $_type = array(
        'num'       =>  array('数字','int(10) UNSIGNED NOT NULL'),
        'string'    =>  array('字符串','varchar(255) NOT NULL'),
        'textarea'  =>  array('文本框','text NOT NULL'),
        'datetime'  =>  array('时间','int(10) NOT NULL'),
        'bool'      =>  array('布尔','tinyint(2) NOT NULL'),
        'select'    =>  array('枚举','char(50) NOT NULL'),
    	'radio'		=>	array('单选','char(10) NOT NULL'),
    	'checkbox'	=>	array('多选','varchar(100) NOT NULL'),
    	'editor'    =>  array('编辑器','text NOT NULL'),
    	'picture'   =>  array('上传图片','int(10) UNSIGNED NOT NULL'),
    	'file'    	=>  array('上传附件','int(10) UNSIGNED NOT NULL'),
    );
    return $type?$_type[$type][0]:$_type;
}