<?php
// +----------------------------------------------------------------------
// | Copyright (c) 2014-2020 http://zswin.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: zswin.cn
// +----------------------------------------------------------------------

function toDate($time, $format = 'Y-m-d H:i:s') {
	if (empty($time)) {
		return '';
	}
	$format = str_replace('#', ':', $format);
	return date($format, $time);
}
/**
 * 获取指定月份的第一天开始和最后一天结束的时间戳
 *
 * @param int $y 年份 $m 月份
 * @return array(本月开始时间，本月结束时间)
 */
function datetimeFristAndLast() {
	$t = time();
	$t1 = mktime(0, 0, 0, date("m", $t), date("d", $t), date("Y", $t));
	$t2 = mktime(0, 0, 0, date("m", $t), 1, date("Y", $t));
	$t3 = mktime(0, 0, 0, date("m", $t) - 1, 1, date("Y", $t));
	$t4 = mktime(0, 0, 0, 1, 1, date("Y", $t));
	$e1 = mktime(23, 59, 59, date("m", $t), date("d", $t), date("Y", $t));
	$e2 = mktime(23, 59, 59, date("m", $t), date("t"), date("Y", $t));
	$e3 = mktime(23, 59, 59, date("m", $t) - 1, date("t", $t3), date("Y", $t));
	$e4 = mktime(23, 59, 59, 12, 31, date("Y", $t));
	
	$returnTime = array();
	$returnTime['now'] = $t;
	$returnTime['todaybegintime'] = $t1;
	$returnTime['thismonthbegintime'] = $t2;
	$returnTime['lastmonthbegintime'] = $t3;
	$returnTime['thisyearbegintime'] = $t4;
	$returnTime['todayendtime'] = $e1;
	$returnTime['thismonthendtime'] = $e2;
	$returnTime['lastmonthendtime'] = $e3;
	$returnTime['thisyearendtime'] = $e4;
	return $returnTime;
}

/*
 * 比较时间段一与时间段二是否有交集
 */

function isMixTime($begintime1, $endtime1, $begintime2, $endtime2) {
	$status = $begintime2 - $begintime1;
	if ($status > 0) {
		$status2 = $begintime2 - $endtime1;
		if ($status2 > 0) {
			return false;
		} else {
			return true;
		}
	} else {
		$status2 = $begintime1 - $endtime2;
		if ($status2 > 0) {
			return false;
		} else {
			return true;
		}
	}
	return false;
}