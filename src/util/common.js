export const RTYPE = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
}

/**
 * 判断是否是日期类型
 * @param {*} date
 */
export function isDate(date) {
  return date && date instanceof Date
}

/**
 * 时间日期格式化
 * @param {*} date
 * @param {*} fmt
 */
export function dateFormat(date, fmt) {
  if (!date) {
    return ''
  }
  // 如果是时间戳则转化为时间
  if (typeof date === 'number') {
    date = new Date(date)
  }

  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }

  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }

  return fmt
}

/**
 * 判断日期类型是日期还是日期时间
 * @param {*} date
 */
export function getDateType(date) {
  if (!isDate(date)) {
    return
  }

  return (date.getHours() === 0 &&
    date.getMinutes() === 0 &&
    date.getSeconds() === 0) ? 'date' : 'datetime'
}